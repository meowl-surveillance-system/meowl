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
        raise Exception("DETECTOR_PROTOTXT_PATH: not found")
    proto_path = settings.DETECTOR_PROTOTXT
    if not os.path.exists(settings.DETECTOR_MODEL):
        raise Exception("DETECTOR_MODEL_PATH: not found")
    model_path = settings.DETECTOR_MODEL
    detector = cv2.dnn.readNetFromCaffe(proto_path, model_path)
    print("[INFO] loading face recognizer...")
    if not os.path.exists(settings.EMBEDDING_MODEL):
        raise Exception("EMBEDDING_MODEL_PATH: not found")
    embedder = cv2.dnn.readNetFromTorch(settings.EMBEDDING_MODEL)
    if not os.path.exists(settings.RECOGNIZER):
        raise Exception("RECOGNIZER_PATH: not found")
    recognizer = pickle.loads(open(settings.RECOGNIZER, "rb").read())
    if not os.path.exists(settings.LABEL_ENCODER):
        raise Exception("LABEL_ENCODER_PATH: not found")
    le = pickle.loads(open(settings.LABEL_ENCODER, "rb").read())
    return detector, embedder, recognizer, le

def iterate_frames(args, detector, embedder, recognizer, le):
    """ Reading in each frame and have it processed """
    stream = cv2.VideoCapture(args["input"])
    writer = None
    while True:
        (grabbed, frame) = stream.read()
        if not grabbed:
            break
        if writer is None and args["output"] is not None:
            fourcc = cv2.VideoWriter_fourcc(*"MJPG")
            writer = cv2.VideoWriter(args["output"], fourcc, 24,
                (frame.shape[1], frame.shape[0]), True)
        frame = imutils.resize(frame, width=600)
        (h, w) = frame.shape[:2]
        imageBlob = cv2.dnn.blobFromImage(
            cv2.resize(frame, (300, 300)), 1.0, (300, 300),
            (104.0, 177.0, 123.0), swapRB=False, crop=False)
        detector.setInput(imageBlob)
        detections = detector.forward()
        analyze_detections(args, embedder, recognizer, le, detections, writer, frame, w, h)
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
    return stream, writer

def analyze_detections(args, embedder, recognizer, le, detections, writer, frame, w, h):
    """ Analyzes each detection and make a prediction"""
    faces = {}
    for i in range(0, detections.shape[2]):
        confidence = detections[0, 0, i, 2]

        if confidence > 0.5:
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
            name = predict(vec, recognizer, le, writer, frame, startX, startY, endX, endY)
            faces[name] = faces.get(name, 0) + 1
    return faces

def predict(vec, recognizer, le, writer, frame, startX, startY, endX, endY):
    """ Prediction is made and box is applied to frame"""
    preds = recognizer.predict_proba(vec)[0]
    j = np.argmax(preds)
    proba = preds[j]
    name = le.classes_[j]

    text = "{}: {:.2f}%".format(name, proba * 100)
    y = startY - 10 if startY - 10 > 10 else startY + 10
    cv2.rectangle(frame, (startX, startY), (endX, endY), (0, 0, 255), 2)
    cv2.putText(frame, text, (startX, y),
        cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
    #cv2.imshow('Frame', frame)
    #cv2.waitKey(1)
    #write_frame(writer, frame)
    return name

def write_frame(writer, frame):
    """ Frame is written """
    if writer is not None:
        writer.write(frame)


def release(stream, writer):
    """ Resources are released """
    stream.release()
    if writer is not None:
        writer.release()

def recognize(args):
    """ Recognizes faces in frames """
    configs = load_configs()
    res = iterate_frames(args, configs[0], configs[1], configs[2], configs[3])
    release(res[0], res[1])
