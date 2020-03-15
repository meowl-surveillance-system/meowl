import numpy as np
import argparse
import imutils
import pickle
import cv2
import os

def load_configs():
    """ Loading Configurations """
    proto_path = os.environ.get('DETECTOR_PROTOTXT_PATH')
    model_path = os.environ.get('DETECTOR_MODEL_PATH')
    detector = cv2.dnn.readNetFromCaffe(proto_path, model_path)
    print("[INFO] loading face recognizer...")
    embedder = cv2.dnn.readNetFromTorch(os.environ.get('EMBEDDING_MODEL_PATH'))
    recognizer = pickle.loads(open(os.environ.get('RECOGNIZER_PATH'), "rb").read())
    le = pickle.loads(open(os.environ.get('LABEL_ENCODER_PATH'), "rb").read())
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
            predict(vec, recognizer, le, writer, frame, startX, startY, endX, endY)

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
    cv2.imshow('Frame', frame)
    cv2.waitKey(25)
    write_frame(writer, frame)

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
