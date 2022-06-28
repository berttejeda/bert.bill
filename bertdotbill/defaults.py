import random
app_name = "Bert's Interactive Lesson Loader (BILL)"
gui_dirname = 'bill.gui'
default_port = 10000
default_open_browser_delay = 1.25
default_webterminal_port = 10001
default_websocket_address = f'ws://127.0.0.1:{default_webterminal_port}/ws'
default_footer_websocket_address = default_websocket_address
default_rightpane_websocket_address = default_websocket_address
default_config_file_name = 'bill.config.yaml'
default_host = '0.0.0.0'

settings = {
  "terminals": {
    "default": {
      "address": default_websocket_address
    },
    "footer": {
      "address": default_footer_websocket_address
    },
    "rightpane": {
      "address": default_rightpane_websocket_address
    }
  },
  "external_configs": [
    {
      "name": "someconfig",
      "uri": "https://raw.githubusercontent.com/someuser/somerepo/main/bill.config.yaml"
    }
  ]
}