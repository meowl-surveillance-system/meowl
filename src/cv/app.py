from flask import Flask
import cv2
import numpy as np
app = Flask(__name__)

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
