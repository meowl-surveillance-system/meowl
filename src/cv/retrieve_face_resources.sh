#! /bin/bash
mkdir face_model_resources
cd face_model_resources

curl -O https://storage.cmusatyalab.org/openface-models/nn4.small2.v1.t7

mkdir face_detection_model
cd face_detection_model
wget https://github.com/Ravi-Singh88/Face-Recognition-OpenCV-Facenet/raw/master/face_detection_model/res10_300x300_ssd_iter_140000.caffemodel
curl -O https://raw.githubusercontent.com/Ravi-Singh88/Face-Recognition-OpenCV-Facenet/master/face_detection_model/deploy.prototxt

cd ../

