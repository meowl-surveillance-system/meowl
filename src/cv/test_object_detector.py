import cv2
import mock
import os
import pytest
from pytest_mock import mocker
import yolo_video_detect as obj_detector

def test_get_configs(mocker):
    mocked_os = mocker.patch('os.path')
    mocked_os.exist.return_value = True
    mocked_pickle = mocker.patch('pickle.loads')
    mocked_pickle.return_value = ""
    mocked_open = mocker.patch('builtins.open')
    mocked_open.return_value = mocker.patch('builtins.open.read')
    obj_detector.get_configs("abc")
    mocked_open.assert_called_once()

def test_load_object_detector(mocker):
   mocked_net = mocker.patch('cv2.dnn.readNetFromDarknet')
   obj_detector.load_object_detector('conf_path', 'weight_path')
   mocked_net.assert_any_call('conf_path', 'weight_path')

def test_draw_box(mocker):
    mocked_NMS_Boxes = mocker.patch('cv2.dnn.NMSBoxes')
    obj_detector.draw_box({'confidence': 1, 'threshold': .5}, 1, 2, [], 1, 2, "frame", [], [],  3)
    mocked_NMS_Boxes.assert_called_with([], [], 1, .5)

