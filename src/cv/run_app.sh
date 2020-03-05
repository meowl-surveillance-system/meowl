APP_NAME='app'
YOLO_NAMES='coco.names'
YOLO_CONFIG='yolov3.cfg'
YOLO_WEIGHTS='yolov3.weights'

PARENT=$(pwd)
YOLO='yolo-coco'
export YOLO_NAMES_PATH=${PARENT}/${YOLO}/${YOLO_NAMES}
export YOLO_CONFIG_PATH=${PARENT}/${YOLO}/${YOLO_CONFIG}
export YOLO_WEIGHTS_PATH=${PARENT}/${YOLO}/${YOLO_WEIGHTS}

CAFFE_NAMES='names.txt'
CAFFE_MODEL='senet50_128.caffemodel'
CAFFE_PROTOTEXT='senet50_128.prototxt'
CAFFE='senet50_128_caffe'
export CAFFE_NAMES_PATH=${PARENT}/'vgg_face_caffe'/${CAFFE_NAMES}
export CAFFE_MODEL_PATH=${PARENT}/${CAFFE}/${CAFFE_MODEL}
export CAFFE_PROTOTEXT_PATH=${PARENT}/${CAFFE}/${CAFFE_PROTOTEXT}

# Run Opencv Server
source venv/bin/activate
export FLASK_APP=${APP_NAME}
# Runs on port 5000 by default
flask run
