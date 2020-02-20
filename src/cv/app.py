from flask import Flask, request
import cv2
import numpy as np
import yolo_video_detect as obj_detector
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World'

def display_vid(file_name):
    cap = cv2.VideoCapture(file_name)
    if (cap.isOpened()== False): 
        print("OpenCV failed to open video stream or file")
    while(cap.isOpened()):
        ret, frame = cap.read()
        if ret == True:
            cv2.imshow('Frame',frame)

            if cv2.waitKey(25) & 0xFF == ord('q'):
                break
        else: 
            break
 
    cap.release()
 
    cv2.destroyAllWindows()

    print("Finished Displaying Video")

@app.route('/process/')
def process_video():
    args = {
        "input": 'car_chase_01.mp4',
        "output": 'car_chase_01.avi',
        "yolo": 'yolo-coco',
        "confidence": .5,
        "threshold": .3
    }
    obj_detector.run_object_detection(args)
