import sys
import cv2
import mock
import numpy
import os
import pytest
from pytest_mock import mocker
import yolo_video_detect
import pickle
import settings
import recognize_faces

def test_load_configs(mocker):
    mocked_os = mocker.patch('os.path')
    mocked_os.exist.return_value = True
    mocked_pickle = mocker.patch('pickle.loads')
    mocked_pickle.return_value = ""
    mocked_open = mocker.patch('builtins.open')
    mocked_open.return_value = mocker.patch('builtins.open.read')
    mocked_net = mocker.patch('cv2.dnn.readNetFromCaffe')
    mocked_embedder = mocker.patch('cv2.dnn.readNetFromTorch')
    recognize_faces.load_configs()
    mocked_net.assert_any_call(settings.DETECTOR_PROTOTXT,
        settings.DETECTOR_MODEL)
    mocked_embedder.assert_any_call(settings.EMBEDDING_MODEL)

def test_analyze_detections(mocker):
    mocked_blob = mocker.patch('cv2.dnn.blobFromImage')
    mocked_predict = mocker.patch('recognize_faces.predict')
    net = mocker.Mock()
    net.setInput = mocker.Mock(return_value='')
    net.forward = mocker.Mock(return_value='')
    mocked_detections = mocker.Mock()
    mocked_detections.shape = [1, 2, 0]
    recognize_faces.analyze_detections({'confidence': 1, 'threshold': .5},
        mocker.Mock(), mocker.Mock(), mocker.Mock(), mocked_detections, [],
        216, 216)
    mocked_predict.assert_not_called()

def test_predict(mocker):
    mocked_pickle = mocker.patch('pickle.loads')
    mocked_pickle.predict_proba.return_value = [[0]]
    mocked_arg_max = mocker.patch('numpy.argmax')
    mocked_arg_max.return_value = 0
    mocked_le = mocker.Mock()
    mocked_le.classes_ = [0]
    mocked_rectangle = mocker.Mock('cv2.rectangle')
    mocked_put_text = mocker.Mock('cv2.putText')
    recognize_faces.predict({'confidence': 1, 'threshold': .5},
        mocker.Mock(), mocked_pickle, mocked_le, [], 0, 0, 216, 216)
    mocked_rectangle.assert_not_called()
    mocked_put_text.assert_not_called()
