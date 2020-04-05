import numpy as np
import argparse
import imutils
import json
import pickle
import cv2
import os
import settings
import time
import yolo_video_detect as obj_detector
import recognize_faces as face_recognize
import cv_producer
import insert_frame

def add_unknown_detections(face_tracker, new_detections):
    """ Add unknown detections to face_tracker
    Returns True if there is at least 1 new detection
    """
    ret_val = False
    for i in range(len(new_detections)):
        if new_detections[i] == "unknown":
            continue
        elif not new_detections[i] in face_tracker:
            face_tracker.append(new_detections[i])
            ret_val = True
    return ret_val

def init_video_stream(args):
    """ Returns the video stream """
    stream = cv2.VideoCapture(args["input"])
    try:
        if imutils.is_cv2():
            prop = cv2.cv.CV_CAP_PROP_FRAME_COUNT
        else:
            prop = cv2.CAP_PROP_FRAME_COUNT
        total = int(stream.get(prop))
        print("{} total frames in video".format(total))

    except:
        raise Exception("Could not determine # of frames in video")
    return stream

def iterate_frames(args, detector, embedder, recognizer, le, net, ln, colors, labels, total):
    """ Reading in each frame and have it processed """
    stream = init_video_stream(args)
    frame_id = 1
    face_tracker = []
    start_time = int(round(time.time()))
    while True:
        if int(round(time.time())) - start_time > 600:
            face_tracker = []
            start_time = int(round(time.time()))
        res = {}
        (grabbed, frame) = stream.read()
        if not grabbed:
            break
        frame = imutils.resize(frame, width=600)
        (h, w) = frame.shape[:2]
        imageBlob = cv2.dnn.blobFromImage(
            cv2.resize(frame, (300, 300)), 1.0, (300, 300),
            (104.0, 177.0, 123.0), swapRB=False, crop=False)
        detector.setInput(imageBlob)
        detections = detector.forward()
        res['faces'] = face_recognize.analyze_detections(args, embedder, recognizer, le, detections, frame, w, h)
        #blob = cv2.dnn.blobFromImage(frame, 1 / 255.0, (416, 416),
         #   swapRB=True, crop=False)
        #net.setInput(blob)
        #start = time.time()
        #layerOutputs = net.forward(ln)
        #end = time.time()

        #res['objects'] = obj_detector.draw_box(args, start, end, layerOutputs,
        #    w, h, frame, colors, labels, total)

        #if len(res['objects'].keys()) > 0 or len(res['faces']) > 0:

        new_detect_exist = add_unknown_detections(face_tracker, res['faces'])
        if len(res['faces']) > 0 and new_detect_exist:
            img_str = cv2.imencode('.jpg', frame)[1].tostring()
            img_str = bytes(img_str)
            insert_frame.insert_frame(args['camera_id'], args['stream_id'], str(frame_id), img_str, json.dumps(res).encode('utf-8'))        
            cv_producer.send_metadata(args['camera_id'], args['stream_id'], str(frame_id), res)
            frame_id += 1
            #cv2.imshow('Frame', frame)
            #key = cv2.waitKey(1) & 0xFF
            #if key == ord("q"):
            #    break
        cv2.imshow('Frame', frame)
        key = cv2.waitKey(1) & 0xFF
    return stream

def release(stream):
    """ Resources are released """
    stream.release()

def process(args):
    obj_configs = obj_detector.get_configs(args)
    object_detector = obj_detector.load_object_detector(obj_configs[3], obj_configs[2])
    face_configs = face_recognize.load_configs()
    res = iterate_frames(args, face_configs[0], face_configs[1], face_configs[2], face_configs[3],
        object_detector[0], object_detector[1], obj_configs[1], obj_configs[0], 0)
    release(res)
