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
    stmt = session.prepare(
        "INSERT INTO streams.cv_frames (frame_id, frame, objects_detected) VALUES(?, ?, ?)")
    stmt_results = session.execute(stmt, [frame_id, frame, objs])
    stmt_meta = session.prepare(
    "INSERT INTO streams.cv_frames_metadata (stream_id, camera_id, frame_order, frame_id) VALUES(?, ?, ?, ?)")
    stmt_meta_results = session.execute(stmt_meta, [stream_id, camera_id, datetime.now(), frame_id])
