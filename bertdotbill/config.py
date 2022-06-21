from bertdotbill.defaults import settings as default_settings
from bertdotbill.defaults import default_config_file_name
from bertdotbill.logger import Logger
import os
from bertdotconfig import Config

logger = Logger().init_logger(__name__)

class AppConfig():

  def __init__(self, **kwargs):
    pass

  def initialize(self, **kwargs):

    args = kwargs['args']
    verify_tls = kwargs.get('verify_tls', False)
    # Initialize App Config
    initial_data = {
    'environment': os.environ
    }  

    # Initialize App Config
    config = Config(
        config_file_uri=default_config_file_name,
        default_value=default_settings,
        initial_data=initial_data,
        args=args,
        verify_tls=verify_tls
    )

    settings = config.read()

    return settings