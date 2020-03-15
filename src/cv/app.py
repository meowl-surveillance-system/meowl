from flask import Flask, request
import cv2
import numpy as np
import embedding_extractor as embed_ex
import train_face_recognizer as trainer
import recognize_faces as recognizer
app = Flask(__name__)

def display_vid(file_name):
    """ Displays a vid """
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
    return "Finsihed Training Face Recognizer"

@app.route('/recognize_faces/')
def recognize():
    """ Recognizes the Faces on frames """
    args = {
        'confidence': .5,
        'input': request.args.get('input'),
        'output': 'res.avi'
    }
    recognizer.recognize(args)
    return "Finished Recognizing Faces"
