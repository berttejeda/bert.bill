import sys
if sys.version_info > (3, 8):
  from importlib import metadata
  __version__ = metadata.version("bertdotbill")
else:
  import importlib_metadata;
  __version__ = importlib_metadata.version('bertdotbill')