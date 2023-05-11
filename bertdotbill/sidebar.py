from bertdotbill.config import AppConfig
from bertdotbill.defaults import default_sidebar_config_file
from bertdotbill.defaults import default_verify_tls
from bertdotbill.logger import Logger

logger = Logger().init_logger(__name__)

class SideBar():

  def __init__(self, **kwargs):
    args = kwargs['args']
    verify_tls = args.no_verify_tls or default_verify_tls
    sidebar_config = AppConfig().initialize(
      args=vars(kwargs['args']),
      config_file=args.sidebar_config_file or default_sidebar_config_file,
      verify_tls=verify_tls
    )
    self.settings = sidebar_config
