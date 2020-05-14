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
from rotate_face_images import prepare_images
from cassandra.cluster import Cluster
from cassandra.query import tuple_factory


cluster = Cluster(settings.CASSANDRA_CLUSTER_IPS, port=settings.CASSANDRA_CLUSTER_PORT)
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

def store_training_data(folder_path, class_name):
    """ Inserts images into database """
    training_data_paths = list(paths.list_images(folder_path))
    prepared_training_paths = prepare_images(training_data_paths)
    for img_path in prepared_training_paths:
        with open(img_path, 'rb') as file_data:
            stmt = session.prepare("""
                INSERT INTO streams.training_data (data_id, class_name, insert_date, data)
                VALUES(?, ?, ?, ?)
            """)
            stmt_results = session.execute(stmt,
                [uuid.uuid4(), class_name, time.time(), file_data.read()])
    os.system("rm -rf " + folder_path)

def retrieve_training_data(start_time):
    """ Obtains the training data from database """
    if not os.path.exists(settings.DATASET):
        os.system('mkdir ' + settings.DATASET)
    else:
        os.system('rm -rf ' + settings.DATASET)
        os.system('mkdir ' + settings.DATASET)
    stmt = session.prepare("""
        SELECT class_name, data from streams.training_data where insert_date > ?
        ALLOW FILTERING
    """)
    res = session.execute(stmt, [int(start_time)])
    counter = 0
    for data in res:
        class_path = settings.DATASET + '/' + data[0]
        if not os.path.exists(class_path):
            os.system('mkdir ' + class_path)
        with open(class_path + '/abc' + str(counter) + '.png', 'wb') as img_file:
            img_file.write(data[1])
        counter += 1
    
