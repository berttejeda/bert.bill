from bertdotbill.logger import Logger

logger = Logger().init_logger(__name__)

class SideBar():

  def __init__(self, **kwargs):
    self.settings = kwargs['settings']
    self.args = kwargs['args']
