import os

"""
  Object Detection Model Configs
"""
YOLO_NAMES = os.environ.get('YOLO_NAMES_PATH')
WEIGHTS = os.environ.get('YOLO_WEIGHTS_PATH')
CONFIGS = os.environ.get('YOLO_CONFIG_PATH')
