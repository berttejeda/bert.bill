import argparse
from bertdotbill.defaults import app_name, \
  default_open_browser_delay

def parse_args(**kwargs):

  parser = argparse.ArgumentParser(description=app_name)
  parser.add_argument('--username', '-U', help="Username, if the URL requires authentication")
  parser.add_argument('--password', '-P', help="Password, if the URL requires authentication")
  parser.add_argument('--lesson-url', '-url', help="The URL for the lesson definition")
  parser.add_argument('--static-assets-folder', '-S', help="Explicity specify the folder for static HTML assets")
  parser.add_argument('--config-file', '-f', help="Path to app configuration file")
  parser.add_argument('--cors-origin', '-o', help="Override CORS origin pattern")
  parser.add_argument('--logfile-path', '-L', help="Path to logfile")
  parser.add_argument('--host-address', '-l', help="Override default host address")
  parser.add_argument('--port', '-p', help="Override default listening port")
  parser.add_argument('--webterminal-host-address', '-wh', help="Override default listening host address for the webterminal socket")
  parser.add_argument('--webterminal-port', '-wp', help="Override default listening port for the webterminal socket")
  parser.add_argument('--open-browser-delay', '-bd', help="Override default time in seconds to delay when opening the system's web browser", default=default_open_browser_delay)
  parser.add_argument('--logfile-write-mode', '-w', default='w', choices=['a', 'w'], help="File mode when writing to log file, 'a' to append, 'w' to overwrite")
  parser.add_argument('--config-file-templatized', '-fT', action='store_true', default=True, help="Render configuration via jinja2 templating")
  parser.add_argument('--api-only', action='store_true', help="Don't serve static assets, only start API")
  parser.add_argument('--all-in-one', '-aio', action='store_true', help="Run the shell websocket process alongside app")
  parser.add_argument('--debug', action='store_true')
  parser.add_argument('--verify-tls', action='store_true', help='Verify SSL cert when downloading web content', default=False)
  parser.add_argument('--no-render-markdown', '-nomarkdown', action='store_true')
  parser.add_argument('run', nargs="?", default=None) # this is just a stub for running via `flask run`
  return parser.parse_args()