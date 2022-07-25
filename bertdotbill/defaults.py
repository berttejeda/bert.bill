import os

# Websocket Settings
default_webterminal_listen_port = 10001
default_webterminal_listen_host  = '0.0.0.0'
default_websocket_address = f'ws://127.0.0.1:{default_webterminal_listen_port}'
default_footer_websocket_address = default_websocket_address
default_rightpane_websocket_address = default_websocket_address
default_webterminal_shell = '/bin/bash'
default_webterminal_shell_command = '-l'
default_webterminal_env = {
  "SHELL": 'bash',
  "TERM": 'xterm',
  "WEBTERMINAL": 'True',
  "TESTING": 'True',
}

# Flask app settings
app_name = "Bert's Interactive Lesson Loader (BILL)"
gui_dirname = 'bill.gui'
default_app_port = 10000
default_open_browser_delay = 1.25
default_config_file_name = 'bill.config.yaml'
default_app_host_address = '0.0.0.0'
default_settings = {
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

