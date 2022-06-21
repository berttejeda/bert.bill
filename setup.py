import configparser as ConfigParser
import os
from setuptools import setup
import sysconfig
import sys

gui_dirname = 'bill.gui'

cfg = ConfigParser.ConfigParser()
cfg.read('setup.cfg')
my_package_name = cfg.get('metadata', 'name')

if sys.platform == 'win32':
  site_packages_path = 'scripts'
else:
  site_packages_path = 'bin'

data_files_path = site_packages_path

def tree(src):
  result = []
  data_file_path = os.path.join(data_files_path, src)
  for root, dirs, files in os.walk(src):
    for file in files:
      if os.path.sep in root:
          sub_root = root.split(os.path.sep, 1)[-1]
          file = os.path.join(sub_root, file)
      result.append(os.path.join(src, file))
  return [(data_file_path, result)]

DATA_FILES = tree(gui_dirname)

setup(data_files=DATA_FILES)