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

def init_video_stream(args):
    """ Obtains the video stream """
    vs = cv2.VideoCapture(args["input"])
    try:
        if imutils.is_cv2():
            prop = cv2.cv.CV_CAP_PROP_FRAME_COUNT
        else:
            prop = cv2.CAP_PROP_FRAME_COUNT
        total = int(vs.get(prop))
        print("{} total frames in video".format(total))

    except:
        raise Exception("Could not determine # of frames in video")
        total = -1

    return vs, total

def iterate_frames(args, vs, net, ln, colors, labels, total):
    """ Iterate through each frame and pass it through the net """
    writer = None
    (W, H) = (None, None)
    while True:
        (grabbed, frame) = vs.read()
        if writer is None:
            fourcc = cv2.VideoWriter_fourcc(*"MJPG")
            writer = cv2.VideoWriter(args["output"], fourcc, 30,
                (frame.shape[1], frame.shape[0]), True)
        if not grabbed:
            break
        if W is None or H is None:
            (H, W) = frame.shape[:2]

        blob = cv2.dnn.blobFromImage(frame, 1 / 255.0, (416, 416),
	        swapRB=True, crop=False)
        net.setInput(blob)
        start = time.time()
        layerOutputs = net.forward(ln)
        end = time.time()

        draw_box(writer, args, start, end, layerOutputs,
            W, H, frame, colors, labels, total)

    return writer

def draw_box(writer, args, start, end, layerOutputs,
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
            cv2.putText(frame, text, (x, y - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    writer.write(frame)

def clean_up(writer, vs):
    """ Releases the writer and Video Capture """
    print("Cleaning up...")
    writer.release()
    vs.release()

def run_object_detection(args):
    """ Runs object detection with the configurations in args """
    configs = get_configs(args)
    object_detector = load_object_detector(configs[3], configs[2])
    vs, total = init_video_stream(args)
    writer = iterate_frames(args, vs, object_detector[0], object_detector[1],
        configs[1], configs[0], total)
    clean_up(writer, vs)