import os
from dotenv import load_dotenv
load_dotenv(dotenv_path='./main.env')

WORKDIR = os.path.dirname(os.path.realpath(__file__))
"""
  Object Detection Model Configs
"""
YOLO_NAMES = WORKDIR + os.environ.get('YOLO_NAMES_PATH')
WEIGHTS = WORKDIR +  os.environ.get('YOLO_WEIGHTS_PATH')
CONFIGS = WORKDIR +  os.environ.get('YOLO_CONFIG_PATH')

"""
  Face Recognizer Model Configs
"""
DETECTOR_PROTOTXT = WORKDIR +  os.environ.get('DETECTOR_PROTOTXT_PATH')
DETECTOR_MODEL = WORKDIR +  os.environ.get('DETECTOR_MODEL_PATH')
EMBEDDING_MODEL = WORKDIR +  os.environ.get('EMBEDDING_MODEL_PATH')
DATASET = WORKDIR +  os.environ.get('DATASET_PATH')
EMBEDDINGS = WORKDIR + os.environ.get('EMBEDDINGS_PATH')
RECOGNIZER = WORKDIR + os.environ.get('RECOGNIZER_PATH')
LABEL_ENCODER = WORKDIR + os.environ.get('LABEL_ENCODER_PATH')
TRACK_TIME = 600
"""
  Directories
"""
UPLOAD_FOLDER_PATH = '/tmp'

"""
  Kafka cv topic
"""
CV_TOPIC = os.environ.get('CV_PRODUCER_TOPIC')
KAFKA_BROKER = os.environ.get('KAFKA_BROKER_URL')

"""
  Training Data Storage
"""
TRAINING_DATA = 'frame_extractions'

"""
  Cassanda Clusters
"""
CASSANDRA_CLUSTER_IPS = os.environ.get('CASSANDRA_CLUSTER_IPS', '127.0.0.1').split(' ')
CASSANDRA_CLUSTER_PORT = int(os.environ.get('CASSANDRA_CLUSTER_PORT', 9042))

"""
  Admin Username & Password
"""
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'password')

"""
  Services URL
"""
LOGIN_URL = os.environ.get('AUTH_SERVER_URL') + os.environ.get('LOGIN_ENDPOINT')
RTMP_IP = os.environ.get('STUNNEL_IP')
RTMP_PORT = os.environ.get('STUNNEL_PORT')
RTMP_REQUEST_URL = os.environ.get('AUTH_SERVER_URL') + os.environ.get('RTMP_REQUEST_ENDPOINT')
