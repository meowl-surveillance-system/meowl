from imutils import paths
import numpy as np
import argparse
import imutils
import pickle
import cv2
import os
import settings

def load_configs():
    """ Loads in resources """
    print("Loading Caffe based face detector to localize faces in an image")
    if not os.path.exists(settings.DETECTOR_PROTOTXT):
        raise OSError("DETECTOR_PROTOTXT_PATH: not found")
    proto_path = settings.DETECTOR_PROTOTXT
    if not os.path.exists(settings.DETECTOR_MODEL):
        raise OSError("DETECTOR_MODEL_PATH: not found")
    model_path = settings.DETECTOR_MODEL

    detector = cv2.dnn.readNetFromCaffe(proto_path, model_path)

    print("Loading Openface imlementation of Facenet model")
    if not os.path.exists(settings.EMBEDDING_MODEL):
        raise OSError("EMBEDDING__MODEL_PATH: not found")
    embedder = cv2.dnn.readNetFromTorch(settings.EMBEDDING_MODEL)

    if not os.path.exists(settings.DATASET):
        raise OSError("DATASET_PATH: not found")
    image_paths = list(paths.list_images(settings.DATASET))
    return detector, embedder, image_paths

def detect_images(args, detector, embedder, image_paths):
    """ Detects images """
    known_embeddings = []
    known_names = []

    total = 0

    for (i, image_path) in enumerate(image_paths):
        print("[INFO] processing image {}/{}".format(i + 1, len(image_paths)))
        name = image_path.split(os.path.sep)[-2]
        image = cv2.imread(image_path)
        image = imutils.resize(image, width=600)
        (h, w) = image.shape[:2]
        image_blob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 1.0, (300, 300),
            (104.0, 177.0, 123.0), swapRB=False, crop=False)
        detector.setInput(image_blob)
        detections = detector.forward()
        if len(detections) > 0:
            res = check_detections(args, detections, embedder, known_embeddings, known_names, w, h, image, name)
            if res:
                total += 1
    return known_embeddings, known_names

def check_detections(args, detections, embedder, known_embeddings, known_names, w, h, image, name):
    """ Analyzes the detections """
    i = np.argmax(detections[0, 0, :, 2])
    confidence = detections[0, 0, i, 2]
    if confidence > args["confidence"]:
        box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
        (startX, startY, endX, endY) = box.astype("int")
        face = image[startY:endY, startX:endX]
        (fH, fW) = face.shape[:2]
        if fW < 20 or fH < 20:
            return False
        faceBlob = cv2.dnn.blobFromImage(face, 1.0 / 255,
            (96, 96), (0, 0, 0), swapRB=True, crop=False)
        embedder.setInput(faceBlob)
        vec = embedder.forward()
        known_names.append(name)
        known_embeddings.append(vec.flatten())
    return True

def write_embeddings(known_embeddings, known_names):
    """ Writes embeddings """
    print("Writing Embeddings")
    data = {"embeddings": known_embeddings, "names": known_names}
    f = open(settings.EMBEDDINGS, "wb")
    f.write(pickle.dumps(data))
    f.close()

def extract_embeddings(args):
    """ Extracts the 128-d embeddings for the face """
    configs = load_configs()
    detect_res = detect_images(args, configs[0], configs[1], configs[2])
    write_embeddings(detect_res[0], detect_res[1])
