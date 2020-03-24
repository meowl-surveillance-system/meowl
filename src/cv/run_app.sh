APP_NAME='app'
YOLO_NAMES='coco.names'
YOLO_CONFIG='yolov3.cfg'
YOLO_WEIGHTS='yolov3.weights'

PARENT=$(pwd)
YOLO='yolo-coco'
export YOLO_NAMES_PATH=${PARENT}/${YOLO}/${YOLO_NAMES}
export YOLO_CONFIG_PATH=${PARENT}/${YOLO}/${YOLO_CONFIG}
export YOLO_WEIGHTS_PATH=${PARENT}/${YOLO}/${YOLO_WEIGHTS}

export CV_PRODUCER_TOPIC='cvdata'
export KAFKA_BROKER='localhost:9092'

# Run Opencv Server
source venv/bin/activate
export FLASK_APP=${APP_NAME}
# Runs on port 5000 by default
flask run
