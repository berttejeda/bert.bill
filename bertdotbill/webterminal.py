import tornado.web
import tornado.ioloop
from bertdotbill.defaults import \
default_webterminal_shell, \
default_webterminal_shell_command
from bertdotbill.spyder_terminal.server.common import create_app

from bertdotbill.logger import Logger
logger = Logger().init_logger(__name__)

class WebTerminal:

    def __init__(self, settings, cli_args):
        self.settings = settings
        self.cli_args = cli_args

    def start(self, host, port):
        clr = 'cls'
        webterminal_shell = self.cli_args.webterminal_shell or self.settings.get('webterminal.shell', default_webterminal_shell)
        webterminal_shell_command = self.cli_args.webterminal_shell_command or self.settings.get('webterminal.command', default_webterminal_shell_command)
        logger.info(f'Server is now at: {host}:{port}')
        logger.info(f'Shell: {webterminal_shell}')
        debug = self.cli_args.debug or self.settings.get('webterminal.debug')
        serve_traceback = self.settings.get('webterminal.serve_traceback')
        autoreload = self.settings.get('webterminal.autoreload')
        application = create_app(webterminal_shell, 
                                 webterminal_shell_command,
                                 debug=debug,
                                 serve_traceback=serve_traceback,
                                 autoreload=autoreload)
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

