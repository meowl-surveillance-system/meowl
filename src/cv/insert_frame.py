import cv2
from datetime import datetime
from imutils import paths
import imutils
import json
import numpy as np
import os
import time
import settings
import uuid
from cassandra.cluster import Cluster
from cassandra.query import tuple_factory

cluster = Cluster()
session = cluster.connect()
session.row_factory = tuple_factory

def insert_frame(camera_id, stream_id, frame_id, frame, objs):
    """ Inserts frame into cv_frames table """
    stmt = session.prepare("""
        INSERT INTO streams.cv_frames
        (camera_id, stream_id, frame_id, frame, objects_detected)
        VALUES(?, ?, ?, ?, ?)
    """)
    stmt_results = session.execute(stmt, [camera_id, stream_id, frame_id, frame, objs])

def store_training_data(class_name):
    """ Inserts images into database """
    training_data_paths = list(paths.list_images(settings.TRAINING_DATA))
    for img_path in training_data_paths:
        with open(img_path, 'rb') as file_data:
            stmt = session.prepare("""
                INSERT INTO streams.training_data (data_id, class_name, data)
                VALUES(?, ?, ?)
            """)
            stmt_results = session.execute(stmt,
                [uuid.uuid4(), class_name, file_data.read()])
    os.system("rm -rf " + settings.TRAINING_DATA)

def retrieve_training_data():
    """ Obtains the training data from database """
    if not os.path.exists(settings.DATASET):
        os.system('mkdir ' + settings.DATASET)
    res = session.execute("SELECT class_name, data from streams.training_data")
    counter = 0
    for data in res:
        class_path = settings.DATASET + '/' + data[0]
        if not os.path.exists(class_path):
            os.system('mkdir ' + class_path)
        with open(class_path + '/abc' + str(counter) + '.png', 'wb') as img_file:
            img_file.write(data[1])
        counter += 1
    
