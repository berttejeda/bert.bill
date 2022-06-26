import base64
from bertdotbill.logger import Logger

logger = Logger().init_logger(__name__)

class Topics():

  def __init__(self, **kwargs):
    self.settings = kwargs['settings']
    self.args = kwargs['args']

  def get(self):

    logger.info('Retrieving available topics')
    topics = self.settings.get('topics', [])
    if isinstance(topics, list):
      logger.info('Successfully retrieved available topics')
      return {'topics': topics}
    else:
      logger.error("Improperly structured 'topics' config block, seek --help")
      return {'topics': []}