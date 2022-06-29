from bertdotbill.defaults import default_webterminal_host, default_webterminal_port

import os

from bertdotbill.logger import Logger

logger = Logger().init_logger(__name__)

class WebTerminal:

  def __init__(self, settings, **kwargs):
    self.settings = settings

  def start(self, **kwargs):

    logger.info('Staring WebTerminal websocket')
    port = kwargs.get('port', default_webterminal_port)
    host = kwargs.get('host', default_webterminal_host)

    if os.name == 'nt':
        # Utilize tornado for the webterminal websocket server
        # Taken from https://github.com/spyder-ide/spyder-terminal
        from bertdotbill.nt_webterminal import NT_WEBTERMINAL
        nt_webterminal = NT_WEBTERMINAL(self.settings)
        nt_webterminal.start(host, port)
    else:
        from bertdotbill.posix_webterminal import POSIX_WEBTERMINAL
        # Utilize aiohttp for the webterminal websocket server
        posix_webterminal = POSIX_WEBTERMINAL(self.settings)
        posix_webterminal.start(host, port)

