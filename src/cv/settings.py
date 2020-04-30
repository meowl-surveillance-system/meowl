import os
from dotenv import load_dotenv
load_dotenv(dotenv_path='./main.env')

WORKDIR = os.path.dirname(os.path.realpath(__file__))

"""
  Object Detection Model Configs
"""
YOLO_NAMES = WORKDIR + '/yolo-coco/coco.names'
WEIGHTS = WORKDIR +  '/yolo-coco/yolov3.weights'
CONFIGS = WORKDIR +  '/yolo-coco/yolov3.cfg'

"""
  Face Recognizer Model Configs
"""
DETECTOR_PROTOTXT = WORKDIR +  '/face_model_resources/face_detection_model/deploy.prototxt'
DETECTOR_MODEL = WORKDIR +  '/face_model_resources/face_detection_model/res10_300x300_ssd_iter_140000.caffemodel'
EMBEDDING_MODEL = WORKDIR +  '/face_model_resources/nn4.small2.v1.t7'
DATASET = WORKDIR +  '/dataset'
EMBEDDINGS = WORKDIR + '/output/embeddings.pickle'
RECOGNIZER = WORKDIR + '/face_model_resources/recognizer.pickle'
LABEL_ENCODER = WORKDIR + '/output/le.pickle'
TRACK_TIME = 600
"""
  Directories
"""
UPLOAD_FOLDER_PATH = '/tmp'

"""
  Kafka cv topic
"""
CV_TOPIC = 'notif'
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
LOGIN_URL = os.environ.get('AUTH_SERVER_URL') + '/auth/login'
RTMP_IP = os.environ.get('STUNNEL_IP')
RTMP_PORT = os.environ.get('STUNNEL_PORT')
RTMP_REQUEST_URL = os.environ.get('AUTH_SERVER_URL') + '/auth/rtmpRequest'

print(YOLO_NAMES)