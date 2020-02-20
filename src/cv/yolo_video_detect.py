import numpy as np
import imutils
import time
import cv2
import os

def get_configs(args):
    # Loads labels
    labelsPath = os.path.sep.join([args["yolo"], "coco.names"])
    labels = open(labelsPath).read().strip().split("\n")

    # Create list of colors
    np.random.seed(42)
    colors = np.random.randint(0, 255, size=(len(labels), 3), dtype="uint8")

    # Paths to YOLO weights and configurations
    weightsPath = os.path.sep.join([args["yolo"], "yolov3.weights"])
    configPath = os.path.sep.join([args["yolo"], "yolov3.cfg"])

    return labels, colors, weightsPath, configPath

def load_object_detector(configPath, weightsPath):
    print("Loading Object Detector")
    net = cv2.dnn.readNetFromDarknet(configPath, weightsPath)
    ln = net.getLayerNames()
    ln = [ln[i[0] - 1] for i in net.getUnconnectedOutLayers()]
    return net, ln

def init_video_stream(args):
    vs = cv2.VideoCapture(args["input"])
    # Determining Total Frames
    try:
        if imutils.is_cv2():
            prop = cv2.cv.CV_CAP_PROP_FRAME_COUNT
        else:
            prop = cv2.CAP_PROP_FRAME_COUNT
        total = int(vs.get(prop))
        print("[INFO] {} total frames in video".format(total))

    # Error occurred while determining # of frames
    except:
        print("[INFO] Could not determine # of frames in video")
        total = -1

    return vs, total

def iterate_frames(args, vs, net, ln, colors, labels, total):
    writer = None
    (W, H) = (None, None)
    # Iterate over frames
    while True:
        (grabbed, frame) = vs.read()
        if writer is None:
            fourcc = cv2.VideoWriter_fourcc(*"MJPG")
            writer = cv2.VideoWriter(args["output"], fourcc, 30, (frame.shape[1], frame.shape[0]), True)
        # If not grabbed then end was reached
        if not grabbed:
            break
        # If frame dimensions are empty
        if W is None or H is None:
            (H, W) = frame.shape[:2]

        # construct a blob from the input frame and then perform a forward
        # pass of the YOLO object detector, giving us our bounding boxes
        # and associated probabilities
        blob = cv2.dnn.blobFromImage(frame, 1 / 255.0, (416, 416),
	        swapRB=True, crop=False)
        net.setInput(blob)
        start = time.time()
        layerOutputs = net.forward(ln)
        end = time.time()

        draw_box(writer, args, start, end, layerOutputs, W, H, frame, colors, labels, total)

    return writer

def draw_box(writer, args, start, end, layerOutputs, W, H, frame, colors, labels, total):
    # initialize lists of detected bounding boxes, confidences, and class IDs
    boxes = []
    confidences = []
    classIDs = []

    # loop over each of the layer outputs
    for output in layerOutputs:
	# loop over each of the detections
        for detection in output:
            # extract the classID and confidence
            scores = detection[5:]
            classID = np.argmax(scores)
            confidence = scores[classID]
            # filter out weak predictions
            if confidence > args["confidence"]:
                 # scale the bounding box coordinates back relative to
                 # the size of the image
                 box = detection[0:4] * np.array([W, H, W, H])
                 (centerX, centerY, width, height) = box.astype("int")
                 # use the center (x, y)-coordinates to derive the top
                 # and and left corner of the bounding box
                 x = int(centerX - (width / 2))
                 y = int(centerY - (height / 2))
                 # update list of bounding box coordinates, confidences, and class IDs
                 boxes.append([x, y, int(width), int(height)])
                 confidences.append(float(confidence))
                 classIDs.append(classID)

    # apply non-maxima suppression to suppress weak, overlapping bounding boxes
    idxs = cv2.dnn.NMSBoxes(boxes, confidences, args["confidence"],
    args["threshold"])
    # ensure at least one detection exists
    if len(idxs) > 0:
        # loop over the indexes we are keeping
        for i in idxs.flatten():
            # extract the bounding box coordinates
            (x, y) = (boxes[i][0], boxes[i][1])
            (w, h) = (boxes[i][2], boxes[i][3])
            # draw a bounding box rectangle and label on the frame
            color = [int(c) for c in colors[classIDs[i]]]
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            text = "{}: {:.4f}".format(labels[classIDs[i]],
                confidences[i])
            cv2.putText(frame, text, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    writer.write(frame)

def clean_up(writer, vs):
    print("[INFO] cleaning up...")
    writer.release()
    vs.release()

def run_object_detection(args):
    configs = get_configs(args)
    object_detector = load_object_detector(configs[3], configs[2])
    vs, total = init_video_stream(args)
    writer = iterate_frames(args, vs, object_detector[0], object_detector[1], configs[1], configs[0], total)
    clean_up(writer, vs)

