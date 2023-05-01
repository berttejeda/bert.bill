from bertdotbill.logger import Logger
import json
from subprocess import run

logger = Logger().init_logger(__name__)

class Dashboard():

  def __init__(self, **kwargs):
    self.settings = kwargs['settings']
    self.args = kwargs['args']
    self.make_data()

  def make_data(self, **kwargs):
    for dk, dv in self.settings.dashboard.items():
      for ck,cv in list(self.settings.dashboard[dk].items()):
        for k, v in list(self.settings.dashboard[dk][ck].items()):
          data = self.settings.dashboard[dk][ck].get('data', {})
          data_exec = data.get('exec')
          if data_exec:
            try:
              exec_result = run(['/bin/bash', '-c', data_exec.command], capture_output=True, text=True)
              json_result = json.loads(exec_result.stdout)
            except Exception as e:
              json_result = json.loads('{"error":"%s"}' % e)
            self.settings.dashboard[dk][ck]['data'] = json_result
            break
