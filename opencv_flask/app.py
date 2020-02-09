from flask import Flask, request
import cv2
import numpy as np
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/display')
def display_vid():
    file_name = request.args.get('file_name', default = '', type = str)
    cap = cv2.VideoCapture(file_name)
    if (cap.isOpened()== False): 
        print("Error opening video stream or file")
    while(cap.isOpened()):
        # Capture frame-by-frame
        ret, frame = cap.read()
        if ret == True:
            # Display the resulting frame
            cv2.imshow('Frame',frame)

            # Press Q on keyboard to  exit
            if cv2.waitKey(25) & 0xFF == ord('q'):
                break

        # Break the loop
        else: 
            break
 
    # When everything done, release the video capture object
    cap.release()
 
    # Closes all the frames
    cv2.destroyAllWindows()

