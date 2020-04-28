import os

"""
  Object Detection Model Configs
"""
YOLO_NAMES = os.environ.get('YOLO_NAMES_PATH')
WEIGHTS = os.environ.get('YOLO_WEIGHTS_PATH')
CONFIGS = os.environ.get('YOLO_CONFIG_PATH')

"""
  Face Recognizer Model Configs
"""
DETECTOR_PROTOTXT = os.environ.get('DETECTOR_PROTOTXT_PATH')
DETECTOR_MODEL = os.environ.get('DETECTOR_MODEL_PATH')
EMBEDDING_MODEL = os.environ.get('EMBEDDING_MODEL_PATH')
DATASET = os.environ.get('DATASET_PATH')
EMBEDDINGS = os.environ.get('EMBEDDINGS_PATH')
RECOGNIZER = os.environ.get('RECOGNIZER_PATH')
LABEL_ENCODER = os.environ.get('LABEL_ENCODER_PATH')
TRACK_TIME = 600

"""
  Directories
"""
UPLOAD_FOLDER_PATH = '/tmp'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

"""
  Kafka cv topic
"""
CV_TOPIC = os.environ.get('CV_PRODUCER_TOPIC')
KAFKA_BROKER = os.environ.get('KAFKA_BROKER')

"""
  Training Data Storage
"""
TRAINING_DATA = 'frame_extractions'
