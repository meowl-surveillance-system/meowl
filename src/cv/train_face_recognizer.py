from sklearn.preprocessing import LabelEncoder
from sklearn.svm import SVC
import argparse
import os
import pickle

def load_configs():
    """ Loading in resources """
    print("[INFO] loading face embeddings...")
    data = pickle.loads(open(os.environ.get('EMBEDDINGS_PATH'), "rb").read())
    print("[INFO] encoding labels...")
    le = LabelEncoder()
    labels = le.fit_transform(data["names"])
    return data, le, labels

def train_model(data, labels):
    """ Training the model using 128-d embeddings of face """
    print("[INFO] training model...")
    recognizer = SVC(C=1.0, kernel="linear", probability=True)
    recognizer.fit(data["embeddings"], labels)
    return recognizer

def write_data(recognizer, le):
    """ Write face recognition model and label encoder """
    f = open(os.environ.get('RECOGNIZER_PATH'), "wb")
    f.write(pickle.dumps(recognizer))
    f.close()
    f = open(os.environ.get('LABEL_ENCODER_PATH'), "wb")
    f.write(pickle.dumps(le))
    f.close()

def train_recognizer():
    """ Trains the recognizer """
    configs = load_configs()
    recognizer = train_model(configs[0], configs[2])
    write_data(recognizer, configs[1])
