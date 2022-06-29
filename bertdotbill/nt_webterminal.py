import tornado.web
import tornado.ioloop
from bertdotbill.defaults import \
default_webterminal_shell_name
from bertdotbill.spyder_terminal.server.common import create_app

from bertdotbill.logger import Logger
logger = Logger().init_logger(__name__)

class NT_WEBTERMINAL:

    def __init__(self, settings):
        self.settings = settings

    def start(self, host, port):
        clr = 'cls'
        webterminal_shell_name = self.settings.get('webterminal.shell.name', default_webterminal_shell_name)
        logger.info(f'Server is now at: {host}:{port}')
        logger.info(f'Shell: {webterminal_shell_name}')
        application = create_app(webterminal_shell_name)
        ioloop = tornado.ioloop.IOLoop.instance()
        application.listen(port, address=host)
        try:
            ioloop.start()
        except KeyboardInterrupt:
            pass
        finally:
            logger.info("Closing server...\n")
            application.term_manager.shutdown()
            tornado.ioloop.IOLoop.instance().stop()