
"""General server constants and utillty functions."""

import tornado
import os.path
import bertdotbill.spyder_terminal.server.routes as routes
from bertdotbill.spyder_terminal.server.logic.term_manager import TermManager


def create_app(shell, shell_command, close_future=None, **kwargs):
    """Create and return a tornado Web Application instance."""
    debug = kwargs.get('debug')
    serve_traceback = kwargs.get('serve_traceback')
    autoreload = kwargs.get('autoreload')
    settings = {"static_path": os.path.join(
        os.path.dirname(__file__), "static")}
    application = tornado.web.Application(routes.gen_routes(close_future),
                                          debug=debug,
                                          serve_traceback=serve_traceback,
                                          autoreload=autoreload, **settings)
    application.term_manager = TermManager([shell, shell_command])
    return application
