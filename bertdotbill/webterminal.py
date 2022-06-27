import asyncio
from aiohttp import web
import aiohttp
import os
import pty
import fcntl
import sys

from bertdotbill.logger import Logger

logger = Logger().init_logger(__name__)

class WebTerminal:

  def __init__(self, settings={}, **kwargs):
    self.settings = settings

  async def posix_websocket_handler(self, request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    loop = asyncio.get_running_loop()
    master, slave = pty.openpty()
    tty_name = os.ttyname(slave)
    logger.info(f'TTY Name is {tty_name}')
    pid = os.fork()
    terminal_env = os.environ.copy()
    terminal_env["SHELL"] = "bash"
    terminal_env["TERM"] = "xterm"
    terminal_env["WEBTERMINAL"] = "True"
    for k, v in self.settings.get('webterminal', {}).get('env', {}).items():
        terminal_env[k] = v
    if pid == 0:
        os.setsid()
        os.dup2(slave,0)
        os.dup2(slave,1)
        os.dup2(slave,2)
        os._exit(os.execve('/bin/bash',('-i', ),terminal_env))
    stdin = os.fdopen(master, 'wb+', buffering=0)
    fl = fcntl.fcntl(master, fcntl.F_GETFL)
    fcntl.fcntl(master, fcntl.F_SETFL, fl | os.O_NONBLOCK)
    def pipe_data_received(ws):
        data = stdin.read()
        logger.debug(f'Incoming data: {data}')
        try:
            asyncio.ensure_future(ws.send_str(data.decode()))
        except:
            pass
    loop.add_reader(master, pipe_data_received, ws)
    async for msg in ws:
        if msg.type == aiohttp.WSMsgType.TEXT:
            stdin.write(msg.data.encode())
        elif msg.type == aiohttp.WSMsgType.BINARY:
            stdin.write(msg.data)
        elif msg.type == aiohttp.WSMsgType.CLOSE:
            await ws.close()
            logger.info('Connection closed with WSMsgType.CLOSE (PID:%s)' % pid)
        elif msg.type == aiohttp.WSMsgType.CLOSED:
            logger.info('Connection closed with WSMsgType.CLOSED (PID:%s)' % pid)
        elif msg.type == aiohttp.WSMsgType.ERROR:
            logger.info('Connection closed with WSMsgType.ERROR (PID:%s)' % pid)
    logger.info('Connection refreshed (PID:%s)' % pid)
    return ws

  def start(self, **kwargs):

    if sys.platform == 'win32':
        logger.info('The WebTerminal websocket component is not yet implemented for this OS')
    else:
        logger.info('Staring WebTerminal websocket')
        port = kwargs.get('port', 5001)
        app = web.Application()
        app.add_routes([web.get('/ws', self.posix_websocket_handler)])
        web.run_app(app, port=int(port))

