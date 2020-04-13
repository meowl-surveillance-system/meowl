import cv2
from datetime import datetime
import imutils
import json
import numpy as np
import os
import time
import settings
from cassandra.cluster import Cluster
from cassandra.query import tuple_factory

cluster = Cluster()
session = cluster.connect()
session.row_factory = tuple_factory

def insert_frame(camera_id, stream_id, frame_id, frame, objs):
    """ Inserts frame into cv_frames table """
    stmt = session.prepare("""
        INSERT INTO streams.cv_frames (camera_id, stream_id, frame_id, frame, objects_detected)
        VALUES(?, ?, ?, ?, ?)
    """)
    stmt_results = session.execute(stmt, [camera_id, stream_id, frame_id, frame, objs])
