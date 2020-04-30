#! /bin/bash
mkdir yolo-coco dataset output

# Install yolo-coco model
cd yolo-coco
curl -O https://raw.githubusercontent.com/pjreddie/darknet/master/cfg/yolov3.cfg 
curl -O https://raw.githubusercontent.com/pjreddie/darknet/master/data/coco.names
curl -O https://pjreddie.com/media/files/yolov3.weights
cd ../

# Install unknown dataset into frame_extractions and run initalize_state
source main.env
wget --no-check-certificate --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=1ufydwhMYtOhxgQuHs9SjERnkX0fXxorO' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=1ufydwhMYtOhxgQuHs9SjERnkX0fXxorO" -O unknown.rar && rm -rf /tmp/cookies.txt
