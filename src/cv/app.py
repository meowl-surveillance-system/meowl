from flask import Flask, request
from werkzeug.utils import secure_filename
from threading import Thread, Lock
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
import utils

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = settings.UPLOAD_FOLDER_PATH
training_mutex = Lock()

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

@app.route('/apply_detections/')
def process_detections():
    """ Applies object detection on an input """
    rtmp_connection_string = "rtmp://{0}:{1}/view/{2}".format(
        settings.RTMP_IP, 
        settings.RTMP_PORT, 
        request.args.get('stream_id'))
    rtmp_url = utils.get_auth_RTMP_url(
        rtmp_connection_string,
        settings.LOGIN_URL,
        settings.RTMP_REQUEST_URL,
        settings.ADMIN_USERNAME,
        settings.ADMIN_PASSWORD)
    args = {
        "input": rtmp_url,
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
    training_mutex.acquire()
    try:
        files = dict(request.files)
        user_id = request.headers.get('User-Id')
        for key in files:
            file = files[key]
            file_name = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file_name)
            print(file_name, file_path)
            file.save(file_path)
            print("Extracting resources of", file_name)
            extract_resources(file_path, user_id)
        print("Retrieve dataset from database...")
        retrieve_dataset_res(0)
        print("Extracting embeddings...")
        extract_embeddings()
        print("Training face recognition...")
        train_face_rec()
        print("Done.")
        return 'Successfully processed the training data'
    finally:
        training_mutex.release()

# TODO(mli): Organize these methods below in another file
# and make a structured project directory.
def extract_resources(file_name, class_name):
    """ Extracts resources from video """
    add_data.extract_resources(file_name, -1)
    insert_frame.store_training_data(class_name)    
    return "Finishing extracting resources"

def retrieve_dataset_res(start_time):
    """ Retrieves the dataset resources """
    insert_frame.retrieve_training_data(start_time)
    return "Finished retrieving dataset resources"

def extract_embeddings():
    """ Extracts the embeddings"""
    args = {
        'confidence': .5
    }
    res = embed_ex.extract_embeddings(args)
    print(res)
    return res

def train_face_rec():
    """ Trains the Face Recognizer """
    trainer.train_recognizer()
    return "Finished Training Face Recognizer"
