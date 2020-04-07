import sys
import cv2
import mock
import os
import pytest
from pytest_mock import mocker
sys.modules['cv_producer'] = __import__('mock')
import apply_detections as app_det
import yolo_video_detect
import settings
import train_face_recognizer

def test_load_configs(mocker):
    mocked_os = mocker.patch('os.path')
    mocked_os.exist.return_value = True
    mocked_pickle = mocker.patch('pickle.loads')
    mocked_pickle.return_value = {'names': ['abc']}
    mocked_open = mocker.patch('builtins.open')
    mocked_open.return_value = mocker.patch('builtins.open.read')
    mocked_le = mocker.patch('sklearn.preprocessing.LabelEncoder')
    mocked_le.fit_transform.return_value = []
    train_face_recognizer.load_configs()
    mocked_open.assert_called_once()

def test_train_model(mocker):
    mocked_SVC = mocker.patch('sklearn.svm.SVC')
    mocked_SVCreturn_value = "123"
    ret_val = train_face_recognizer.train_model({'embeddings': [[1], [2], [3]]}, ["a", "b", "c"])

def test_write_data(mocker):
    mocked_open = mocker.patch('builtins.open')
    mocked_pickle = mocker.patch('pickle.dumps')
    train_face_recognizer.write_data("", "")
    assert mocked_pickle.call_count == 2

