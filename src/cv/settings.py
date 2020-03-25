import os

"""
  Kafka cv topic
"""
CV_TOPIC = os.environ.get('CV_PRODUCER_TOPIC')
KAFKA_BROKER = os.environ.get('KAFKA_BROKER')

"""
  Object Detection Model Configs
"""
YOLO_NAMES = os.environ.get('YOLO_NAMES_PATH')
WEIGHTS = os.environ.get('YOLO_WEIGHTS_PATH')
CONFIGS = os.environ.get('YOLO_CONFIG_PATH')
