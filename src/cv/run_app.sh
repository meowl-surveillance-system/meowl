#!/bin/bash
APP_NAME='app'
DETECTOR_PROTOTXT='deploy.prototxt'
DETECTOR_MODEL='res10_300x300_ssd_iter_140000.caffemodel'
EMBEDDING_MODEL='nn4.small2.v1.t7'
DATA_SET='dataset'
EMBEDDINGS='output/embeddings.pickle'
RECOGNIZER='recognizer.pickle'
LABEL_ENCODER='output/le.pickle'

PARENT=$(pwd)
FACE_MODEL_RESOURCES='face_model_resources'
DETECTOR='face_detection_model'
export DETECTOR_PROTOTXT_PATH=${PARENT}/${FACE_MODEL_RESOUCES}/${DETECTOR}/${DETECTOR_PROTOTXT}
export DETECTOR_MODEL_PATH=${PARENT}/${FACE_MODEL_RESOURCES}/${DETECTOR}/${DETECTOR_MODEL}
export EMBEDDING_MODEL_PATH=${PARENT}/${FACE_MODEL_RESOURCES}/${EMBEDDING_MODEL}
export DATASET_PATH=${PARENT}/${DATA_SET}
export EMBEDDINGS_PATH=${PARENT}/${EMBEDDINGS}
export RECOGNIZER_PATH=${PARENT}/${FACE_MODEL_RESOURCE}/${RECOGNIZER}
export LABEL_ENCODER_PATH=${PARENT}/${LABEL_ENCODER}
YOLO_NAMES='coco.names'
YOLO_CONFIG='yolov3.cfg'
YOLO_WEIGHTS='yolov3.weights'

PARENT=$(pwd)
YOLO='yolo-coco'
export YOLO_NAMES_PATH=${PARENT}/${YOLO}/${YOLO_NAMES}
export YOLO_CONFIG_PATH=${PARENT}/${YOLO}/${YOLO_CONFIG}
export YOLO_WEIGHTS_PATH=${PARENT}/${YOLO}/${YOLO_WEIGHTS}

export CV_PRODUCER_TOPIC='cvdata'
export KAFKA_BROKER=${KAFKA_BROKER_URL:-localhost:9093}

# Start stunnel in background
# sudo stunnel /etc/stunnel/stunnel.conf 2>&1 | tee stunnel-service.log &

# Open the Python virtual environment if it exists
[[ -d "./venv" ]] && source venv/bin/activate

# Run Flask
export FLASK_APP=${APP_NAME}
# Runs on port 5000 by default
flask run
