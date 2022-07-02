import tornado.web
import tornado.ioloop
from bertdotbill.defaults import \
default_webterminal_shell_name
from bertdotbill.spyder_terminal.server.common import create_app

from bertdotbill.logger import Logger
logger = Logger().init_logger(__name__)

class WebTerminal:

    def __init__(self, settings, cli_args):
        self.settings = settings
        self.cli_args = cli_args

    def start(self, host, port):
        clr = 'cls'
        webterminal_shell_name = self.cli_args.webterminal_shell or self.settings.get('webterminal.shell.name', default_webterminal_shell_name)
        logger.info(f'Server is now at: {host}:{port}')
        logger.info(f'Shell: {webterminal_shell_name}')
        debug = self.cli_args.debug or self.settings.get('webterminal.debug')
        serve_traceback = self.settings.get('webterminal.serve_traceback')
        autoreload = self.settings.get('webterminal.autoreload')
        application = create_app('/bin/bash',
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

