import cv2
import imutils
import numpy as np
import os
import time
import settings

def get_configs(args):
    """ Retrieves the object detector model resources """
    if not os.path.exists(settings.YOLO_NAMES):
        raise Exception("YOLO_NAMES_PATH: not found")
    labelsPath = settings.YOLO_NAMES
    labels = open(labelsPath).read().strip().split("\n")

    np.random.seed(int(time.time()))
    colors = np.random.randint(0, 255, size=(len(labels), 3), dtype="uint8")

    if not os.path.exists(settings.WEIGHTS):
        raise Exception("YOLO_WEIGHTS_PATH: not found")
    weightsPath = settings.WEIGHTS
    if not os.path.exists(settings.CONFIGS):
        raise Exception("YOLO_WEIGHTS_PATH: not found")
    configPath = settings.CONFIGS

    return labels, colors, weightsPath, configPath

def load_object_detector(configPath, weightsPath):
    """ Loads the yolo model """
    print("Loading Object Detector")
    net = cv2.dnn.readNetFromDarknet(configPath, weightsPath)
    ln = net.getLayerNames()
    ln = [ln[i[0] - 1] for i in net.getUnconnectedOutLayers()]
    return net, ln

def draw_box(args, start, end, layerOutputs,
             W, H, frame, colors, labels, total):
    """ Draws boxes around detected elements in frame and writes the frame"""
    boxes = []
    confidences = []
    classIDs = []

    for output in layerOutputs:
        for detection in output:
            scores = detection[5:]
            classID = np.argmax(scores)
            confidence = scores[classID]
            if confidence > args["confidence"]:
                 box = detection[0:4] * np.array([W, H, W, H])
                 (centerX, centerY, width, height) = box.astype("int")
                 x = int(centerX - (width / 2))
                 y = int(centerY - (height / 2))
                 boxes.append([x, y, int(width), int(height)])
                 confidences.append(float(confidence))
                 classIDs.append(classID)

    objs = {}
    idxs = cv2.dnn.NMSBoxes(boxes, confidences,
        args["confidence"], args["threshold"])
    if len(idxs) > 0:
        for i in idxs.flatten():
            (x, y) = (boxes[i][0], boxes[i][1])
            (w, h) = (boxes[i][2], boxes[i][3])
            color = [int(c) for c in colors[classIDs[i]]]
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            text = "{}: {:.4f}".format(labels[classIDs[i]],
                confidences[i])
            key = labels[classIDs[i]]
            objs[key] = objs.get(key, 0) + 1
            cv2.putText(frame, text, (x, y - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    return objs

