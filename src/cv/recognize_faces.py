import numpy as np
import argparse
import imutils
import pickle
import cv2
import os
import settings

def load_configs():
    """ Loading Configurations """
    if not os.path.exists(settings.DETECTOR_PROTOTXT):
        raise OSError("DETECTOR_PROTOTXT_PATH: not found")
    proto_path = settings.DETECTOR_PROTOTXT
    if not os.path.exists(settings.DETECTOR_MODEL):
        raise OSError("DETECTOR_MODEL_PATH: not found")
    model_path = settings.DETECTOR_MODEL
    detector = cv2.dnn.readNetFromCaffe(proto_path, model_path)
    print("[INFO] loading face recognizer...")
    if not os.path.exists(settings.EMBEDDING_MODEL):
        raise OSError("EMBEDDING_MODEL_PATH: not found")
    embedder = cv2.dnn.readNetFromTorch(settings.EMBEDDING_MODEL)
    if not os.path.exists(settings.RECOGNIZER):
        raise OSError("RECOGNIZER_PATH: not found")
    recognizer = pickle.loads(open(settings.RECOGNIZER, "rb").read())
    if not os.path.exists(settings.LABEL_ENCODER):
        raise OSError("LABEL_ENCODER_PATH: not found")
    le = pickle.loads(open(settings.LABEL_ENCODER, "rb").read())
    return detector, embedder, recognizer, le

def analyze_detections(args, embedder, recognizer, le, detections, frame, w, h):
    """ Analyzes each detection and make a prediction"""
    faces = []
    for i in range(0, detections.shape[2]):
        confidence = detections[0, 0, i, 2]

        if confidence > args['confidence']:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")

            face = frame[startY:endY, startX:endX]
            (fH, fW) = face.shape[:2]

            if fW < 20 or fH < 20:
                continue

            face_blob = cv2.dnn.blobFromImage(face, 1.0 / 255,
                (96, 96), (0, 0, 0), swapRB=True, crop=False)
            embedder.setInput(face_blob)
            vec = embedder.forward()
            name = predict(args, vec, recognizer, le, frame, startX, startY, endX, endY)
            if not name == "":
                faces.append(name)
    return faces

def predict(args, vec, recognizer, le, frame, startX, startY, endX, endY):
    """ Prediction is made and box is applied to frame"""
    preds = recognizer.predict_proba(vec)[0]
    j = np.argmax(preds)
    proba = preds[j]
    name = le.classes_[j]

    if proba > args['confidence']:
        text = "{}: {:.2f}%".format(name, proba * 100)
        y = startY - 10 if startY - 10 > 10 else startY + 10
        cv2.rectangle(frame, (startX, startY), (endX, endY), (0, 0, 255), 2)
        cv2.putText(frame, text, (startX, y),
            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
        return name
    return ""
