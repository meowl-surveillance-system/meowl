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

def init_video_stream(args):
    """ Obtains the video stream """
    #stream = cv2.VideoCapture(args["input"])
    stream = cv2.VideoCapture(0)
    try:
        if imutils.is_cv2():
            prop = cv2.cv.CV_CAP_PROP_FRAME_COUNT
        else:
            prop = cv2.CAP_PROP_FRAME_COUNT
        total = int(stream.get(prop))
        print("{} total frames in video".format(total))

    except:
        raise Exception("Could not determine # of frames in video")
        total = -1

    return stream

def iterate_frames(args, detector, embedder, recognizer, le, net, ln, colors, labels, total):
    """ Reading in each frame and have it processed """
    stream = init_video_stream(args)
    writer = None
    frame_id = 1
    while True:
        res = {}
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
        res['faces'] = face_recognize.analyze_detections(args, embedder, recognizer, le, detections, writer, frame, w, h)
        blob = cv2.dnn.blobFromImage(frame, 1 / 255.0, (416, 416),
            swapRB=True, crop=False)
        net.setInput(blob)
        start = time.time()
        layerOutputs = net.forward(ln)
        end = time.time()

        res['objects'] = obj_detector.draw_box(writer, args, start, end, layerOutputs,
            w, h, frame, colors, labels, total)

        if len(res['objects'].keys()) > 0 or len(res['faces'].keys()) > 0:
            img_str = cv2.imencode('.jpg', frame)[1].tostring()
            img_str = bytes(img_str)
            insert_frame.insert_frame(repr(args['camera_id']), repr(args['stream_id']), repr(frame_id), img_str, json.dumps(res).encode('utf-8'))        
            cv_producer.send_metadata(repr(args['camera_id']), repr(args['stream_id']), repr(str(frame_id)))
            frame_id += 1
            #cv2.imshow('Frame', frame)
            #key = cv2.waitKey(1) & 0xFF
            #if key == ord("q"):
            #    break
    return stream, writer

def process(args):
    obj_configs = obj_detector.get_configs(args)
    object_detector = obj_detector.load_object_detector(obj_configs[3], obj_configs[2])
    face_configs = face_recognize.load_configs()
    res = iterate_frames(args, face_configs[0], face_configs[1], face_configs[2], face_configs[3],
        object_detector[0], object_detector[1], obj_configs[1], obj_configs[0], 0)
    face_recognize.release(res[0], res[1])
