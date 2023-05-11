from bertdotbill.config import AppConfig
from bertdotbill.defaults import default_dashboard_config_file
from bertdotbill.defaults import default_verify_tls
from bertdotbill.logger import Logger
import json
from subprocess import run

logger = Logger().init_logger(__name__)

class Dashboard():

  def __init__(self, **kwargs):
    args = kwargs['args']
    verify_tls = args.no_verify_tls or default_verify_tls
    dashboard_config = AppConfig().initialize(
    args=vars(args),
    config_file=args.dashboard_config_file or default_dashboard_config_file,
    verify_tls=verify_tls
    )    
    self.settings = dashboard_config
    self.make_data()

  def make_data(self, **kwargs):
    for dk, dv in self.settings.dashboard.items():
      for ck,cv in list(self.settings.dashboard[dk].items()):
        for k, v in list(self.settings.dashboard[dk][ck].items()):
          data = self.settings.dashboard[dk][ck].get('data', {})
          data_exec = data.get('exec')
          if data_exec:
            try:
              command = data_exec.command
              command_args = ' '.join(data_exec.args)
              exec_command = f"{command} {command_args}"
              exec_result = run(['/bin/bash', '-c', exec_command], capture_output=True, text=True)
              json_result = json.loads(exec_result.stdout)
            except Exception as e:
              json_result = json.loads('{"error":"%s"}' % e)
            self.settings.dashboard[dk][ck]['data'] = json_result
            break
