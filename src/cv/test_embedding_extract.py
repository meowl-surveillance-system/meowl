import imutils
import cv2
import mock
import numpy as np
import os
import pytest
from pytest_mock import mocker
import embedding_extractor as ee

def test_load_configs(mocker):
    mocked_os = mocker.patch('os.path')
    mocked_os.exist.return_value = True
    mocked_list_images = mocker.patch('imutils.paths.list_images')
    mocked_list_images.return_value = []
    mocked_caffe_net = mocker.patch('cv2.dnn.readNetFromCaffe')
    mocked_torch_net = mocker.patch('cv2.dnn.readNetFromTorch')
    ee.load_configs()
    mocked_caffe_net.assert_called_once()
    mocked_torch_net.assert_called_once()

def test_detect_images(mocker):
    mocked_check_detections = mocker.patch('embedding_extractor.check_detections')
    mocked_blob = mocker.patch('cv2.dnn.blobFromImage')
    detector = mocker.Mock()
    embedder = mocker.Mock()
    mocked_frame = mocker.Mock()
    mocked_frame.shape = [1, 2]
    detector.read = mocker.Mock(return_value=(False, mocked_frame))
    detector.setInput = mocker.Mock(return_value='')
    detector.forward = mocker.Mock(return_value='') 
    ee.detect_images({'output':''}, detector, embedder, [])
    mocked_check_detections.assert_not_called()

def test_write_embeddings(mocker):
    mocked_open = mocker.patch('builtins.open')
    mocked_pickle = mocker.patch('pickle.dumps')
    ee.write_embeddings("", "")
    assert mocked_pickle.call_count == 1

