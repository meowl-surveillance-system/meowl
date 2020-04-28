from flask import Flask, request
from werkzeug.utils import secure_filename
import os
import requests
import cv2
import numpy as np
import add_dataset_resources as add_data
import insert_frame
import embedding_extractor as embed_ex
import apply_detections
import train_face_recognizer as trainer
import recognize_faces as recognizer
import yolo_video_detect as obj_detector
import settings

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = settings.UPLOAD_FOLDER_PATH

@app.route('/')
def hello_world():
    """ Returns Hello World as a String """
    return 'Hello World'

@app.route('/test_ssl/')
def display_vid():
    """ Displays frames from VideoCapture """
    cap = cv2.VideoCapture(request.args.get('input'))
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

def extract_resources(file_name, class_name):
    """ Extracts resources from video """
    add_data.extract_resources(file_name, -1)
    insert_frame.store_training_data(class_name)    
    return "Finishing extracting resources"

@app.route('/retrieve_dataset/')
def retrieve_dataset_res():
    """ Retrieves the dataset resources """
    insert_frame.retrieve_training_data(request.args.get("start_time"))
    return "Finished retrieving dataset resources"

@app.route('/extract_embeddings/')
def extract_embeddings():
    """ Extracts the embeddings"""
    args = {
        'confidence': .5
    }
    embed_ex.extract_embeddings(args)
    return "Finished extracting embeddings"

@app.route('/train_face_rec/')
def train_face_rec():
    """ Trains the Face Recognizer """
    trainer.train_recognizer()
    return "Finished Training Face Recognizer"

@app.route('/apply_detections/')
def process_detections():
    """ Applies object detection on an input """
    args = {
        "input": request.args.get('input'),
        "output": request.args.get('output'),
        "camera_id": request.args.get('camera_id'),
        "stream_id": request.args.get('stream_id'),
        "confidence": request.args.get('confidence', default = .8, type = float),
        "threshold": request.args.get('threshold', default = .3, type = float)
    }
    apply_detections.process(args)
    return "Finished Processing detections"

@app.route('/upload_training_data/', methods=['PUT'])
def upload_training_data():
    """ Uploads data to train the models """
    # TODO(mli): using that file_path, extract_resources and
    # do whatever you can to train that model in this call
    # and please make extract embeddings andtrain_face_rec just
    # a normal method to call. It doesn't seem like we would
    # need to call this from our front-end.
    # Have fun! :)
    files = dict(request.files)
    user_id = request.headers.get('User-Id')
    for key in files:
        file = files[key]
        file_name = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file_name)
        print(file_name, file_path)
        file.save(file_path)
        # extract_resources(file_path, user_id)
       
    return 'Successfully processed the training data'