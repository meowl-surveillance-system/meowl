APP_NAME='app'
DETECTOR_PROTOTXT='deploy.prototxt'
DETECTOR_MODEL='res10_300x300_ssd_iter_140000.caffemodel'
EMBEDDING_MODEL='nn4.small2.v1.t7'
DATA_SET='dataset'
EMBEDDINGS='output/embeddings.pickle'
RECOGNIZER='output/recognizer.pickle'
LABEL_ENCODER='output/le.pickle'

PARENT=$(pwd)
DETECTOR='face_detection_model'
export DETECTOR_PROTOTXT_PATH=${PARENT}/${DETECTOR}/${DETECTOR_PROTOTXT}
export DETECTOR_MODEL_PATH=${PARENT}/${DETECTOR}/${DETECTOR_MODEL}
export EMBEDDING_MODEL_PATH=${PARENT}/${EMBEDDING_MODEL}
export DATASET_PATH=${PARENT}/${DATA_SET}
export EMBEDDINGS_PATH=${PARENT}/${EMBEDDINGS}
export RECOGNIZER_PATH=${PARENT}/${RECOGNIZER}
export LABEL_ENCODER_PATH=${PARENT}/${LABEL_ENCODER}

# Run Opencv Server
source venv/bin/activate
export FLASK_APP=${APP_NAME}
# Runs on port 5000 by default
flask run
