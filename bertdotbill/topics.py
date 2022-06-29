import base64
from bertdotbill.logger import Logger

logger = Logger().init_logger(__name__)

class Topics():

  def __init__(self, **kwargs):
    self.settings = kwargs['settings']
    self.args = kwargs['args']

  def get(self):

    logger.info('Retrieving available topics')
    topics = self.settings.get('topics', {})
    if len(topics) > 0:
      logger.info('Successfully retrieved available topics')
    else:
      logger.warning('No topics retrieved')
    logger.debug(f'Available topics: {topics}')
    if isinstance(topics, dict):
      return {'topics': topics}
    else:
      logger.error("Improperly structured 'topics' config block, seek --help")
      return {'topics': {}}