from flask import Flask, request
import cv2
import numpy as np
import yolo_video_detect as obj_detector
app = Flask(__name__)

@app.route('/')
def hello_world():
    """ Returns Hello World as a String """
    return 'Hello World'

def display_vid(file_name):
    """ Displays frames from VideoCapture """
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
    """ Applies object detection on an input """
    args = {
        "input": request.args.get('input'),
        "output": request.args.get('output'),
        "confidence": request.args.get('confidence', default = .5, type = float),
        "threshold": request.args.get('threshold', default = .3, type = float)
    }
    obj_detector.run_object_detection(args)
