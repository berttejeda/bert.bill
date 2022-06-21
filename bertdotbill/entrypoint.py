from bertdotbill.logger import Logger
from bertdotbill.defaults import gui_dirname
import os
import sys

logger = Logger().init_logger(__name__)
is_frozen = getattr(sys, 'frozen', False)
if is_frozen:
  my_file_name = os.path.basename(sys.executable)
  project_root = os.path.dirname(os.path.abspath(sys.executable))  
else:
  my_file_name = __file__
  project_root = os.path.dirname(my_file_name)


def do_if_frozen():

  logger.debug('Detected installation type is "frozen"')
  static_folder_relative = './%s' % gui_dirname
  static_folder = os.path.join(project_root, static_folder_relative)
  logger.info('Checking %s' % static_folder)
  if os.path.exists(static_folder):
    logger.info('Found %s' % static_folder)
    return static_folder
  else: # Check for frozen py2app
    static_folder_relative = '../Resources/%s' % gui_dirname
    static_folder = os.path.join(project_root, static_folder_relative)
    logger.info('Checking %s' % static_folder)
    if os.path.exists(static_folder):
      logger.info('Found %s' % static_folder)
      return static_folder_relative
    else:
      logger.error('%s not found' % static_folder)
      return None

def do_if_not_frozen():

  import re
  import site
  import sysconfig
  root_package_name = __name__.split('.')[0]
  site_packages_path = sysconfig.get_paths()['purelib']
  user_scripts_paths = [p for p in site.getsitepackages() if 'site-packages' in p]
  if len(user_scripts_paths) > 0:
    user_scripts_path = user_scripts_paths[0]
    user_package_path = os.path.realpath(os.path.join(user_scripts_path, root_package_name))
  else:
    user_scripts_path = user_package_path = 'DNE'
  root_package_path = os.path.realpath(os.path.join(site_packages_path, root_package_name))
  logger.debug(f'Root Package Name: {root_package_name}')
  logger.debug(f'Root Package Path: {root_package_path}')
  logger.debug(f'Site Packages Path: {site_packages_path}')
  logger.debug(f'User Scripts Path: {user_scripts_paths}')
  try:
    import bertdotbill
    pip_package_path = ''.join(bertdotbill.__path__)
    logger.debug(f'Pip Package Path: {pip_package_path}')
    if re.search('dist-packages|site-packages', pip_package_path):
      logger.debug('Found pip package path at %s' % pip_package_path)
      if sys.platform == 'win32':
        package_path = root_package_path if os.path.isdir(root_package_path) else user_package_path
      else:
        pattern = re.compile('/lib/.*')
        logger.debug('Platform is POSIX-compliant')
        package_path_base_dir = pattern.sub('', ''.join(pip_package_path))
        package_path = os.path.join(package_path_base_dir, 'bin')
        logger.debug('Using pip package path of %s' % package_path)
    else:
      package_path = 'DNE'
      logger.debug('pip package does not exist')
  except Exception as e:
    logger.debug(f'pip package does not exist: {e}')
    pass
  if os.path.isdir(package_path):
    logger.debug('Detected installation type is "pip"')
    static_folder_relative = f'./{gui_dirname}'
    static_folder = os.path.join(package_path, gui_dirname)
  else:
    logger.debug('Detected installation type is "development"')
    static_folder_relative = f'../{gui_dirname}'
    static_folder = os.path.join(project_root, static_folder_relative)
  logger.info(f'Checking {static_folder}')
  if os.path.exists(static_folder):
    logger.info(f'Found {static_folder}')
    return static_folder
  else:
    static_folder = f'{package_path}/../scripts/{gui_dirname}'
    if os.path.exists(static_folder):
      logger.info(f'Found {static_folder}')
      return static_folder
    else:
      # Fallback paths
      logger.error(f'{static_folder} not found')
      return None

def get_static_folder():
  logger.info('Determining path to static assets')
  logger.debug(f'Is Frozen?: {is_frozen}')
  logger.debug(f'Detected file name: {my_file_name}')
  logger.debug(f'Detected project root: {project_root}')
  if is_frozen: # Check for frozen pyinstaller app
    static_folder = do_if_frozen()
  else: # Check for unfrozen development app
    static_folder = do_if_not_frozen()
  if static_folder:
    return static_folder
  else:
    raise Exception('No folder found for static assets')