from bertdotbill.cli import parse_args
from bertdotbill.config import AppConfig
from bertdotbill.defaults import default_footer_websocket_address
from bertdotbill.defaults import default_rightpane_websocket_address
from bertdotbill.entrypoint import get_static_folder
from bertdotbill.logger import Logger
from bertdotbill.topics import Topics
from bertdotbill.lessons import Lessons
from bertdotbill.webterminal import WebTerminal
from bertdotbill.websocket import WebSocket
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import threading
import webbrowser

import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/javascript', '.mjs')
mimetypes.add_type('text/css', '.css')

# Read command-line args
args = parse_args()
# Initialize logging facility
logger_obj = Logger(logfile_path=args.logfile_path, logfile_write_mode=args.logfile_write_mode)
logger = logger_obj.init_logger('app')

# Initialize Config Reader
settings = AppConfig().initialize(
  args=vars(args), verify_tls=args.verify_tls
)

if args.api_only:
    static_assets_folder = None
else:
    static_assets_folder = args.static_assets_folder or get_static_folder()
    logger.info(f'Static assets folder is {static_assets_folder}')

# Initialize Lesson Loader
topics = Topics(
  settings=settings,
  args=args)

# Initialize Lesson Loader
lessons = Lessons(
    settings=settings,
    args=args)

# Initialize Lesson Loader
websocket = WebSocket()

if static_assets_folder:
    app = Flask(__name__, static_url_path='', static_folder=static_assets_folder)
    if args.cors_origin:
      CORS(app, resources={r"*": {"origins": args.cors_origin}})
else:
    logger.info('Serving API Only, no static assets')
    app = Flask(__name__)
    if args.cors_origin:
      CORS(app, resources={r"*": {"origins": args.cors_origin}})
    else:
      logger.warn('CORS Policy effectively disabled, as oo Origin Pattern specified')
      CORS(app, resources={r"*": {"origins": "*"}})

def start_webterminal():
  WebTerminal(settings).start(port=args.webterminal_port)

def start_api():
  # Serve React App
  @app.route('/', defaults={'path': ''})
  @app.route('/<path:path>')
  def serve(path=""):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

  @app.route('/api/sendToWebsocket', methods=['POST'])
  def send_to_websocket():
    try:
      wsURL = request.json.get('wsURL')
      data = request.json.get('data')
      websocket.send_to_websocket(wsURL, data)
      resp = jsonify(success=True)
    except Exception as e:
      resp = jsonify(error=True)
    return resp

  @app.route('/api/loadLesson', methods=['POST'])
  def load_lesson():
    lesson_uri = request.json.get('uri')
    encoded_lesson_obj = lessons.load_lesson(lesson_uri)
    return encoded_lesson_obj

  @app.route('/api/getRightPaneWebSocketAddress')
  def get_rightpane_websocket_address():
    default_address = settings.get('terminals.rightpane.address', default_rightpane_websocket_address)
    effective_address = default_address
    response_obj = {'address': effective_address}
    return response_obj

  @app.route('/api/getFooterWebSocketAddress')
  def get_footer_websocket_address():
    default_address = settings.get('terminals.footer.address', default_footer_websocket_address)
    effective_address = default_address
    response_obj = {'address': effective_address}
    return response_obj

  @app.route('/api/getTopics')
  def get_topics():
    available_topics = topics.get()
    return available_topics

  @app.route('/api/ping')
  def get_current_time():
    return {'message': "pong"}

  logger.info("Starting API")

  local_url = f"http://localhost:{args.port}"
  if 'WERKZEUG_RUN_MAIN' not in os.environ:
    threading.Timer(args.open_browser_delay, lambda: webbrowser.open(local_url)).start()    

  if args.all_in_one:
    app.run(host=args.host_address, port=args.port)
  else:
    app.run(use_reloader=True, host=args.host_address, port=args.port)

if __name__ == '__main__':

    if args.all_in_one:
      import multiprocessing as mp
      if hasattr(os, 'getppid'):  # only available on Unix
          logger.info(f'parent process: {os.getppid()}')
      
      proc_api = mp.Process(target=start_api)
      proc_api.deamon = True
      proc_api.start()

      proc_webterminal = mp.Process(target=start_webterminal)
      proc_webterminal.deamon = True
      proc_webterminal.start()

      proc_api.join()
      proc_webterminal.join()

    else:
        start_api()


