import cv2
import mock
import os
import pytest
from pytest_mock import mocker
import yolo_video_detect as obj_detector

def test_get_configs(mocker):
    mocked_os = mocker.patch('os.environ.get')
    mocked_os.return_value = 'path'
    mocked_open = mocker.patch('builtins.open')
    mocked_open.return_value = mocker.patch('builtins.open.read')
    obj_detector.get_configs('abc')
    mocked_os.assert_any_call('YOLO_NAMES_PATH')
    mocked_os.assert_any_call('YOLO_WEIGHTS_PATH')
    mocked_os.assert_any_call('YOLO_CONFIG_PATH')

def test_load_object_detector(mocker):
   mocked_net = mocker.patch('cv2.dnn.readNetFromDarknet')
   obj_detector.load_object_detector('conf_path', 'weight_path')
   mocked_net.assert_any_call('conf_path', 'weight_path')

def test_init_video_stream(mocker):
    mocked_video_stream = mocker.patch('cv2.VideoCapture')
    mocked_video_stream.return_value = 'abc'
    obj_detector.init_video_stream({'input':'123'})
    mocked_video_stream.assert_any_call('123')

def test_iterate_frames(mocker):
    mocked_video_writer = mocker.patch('cv2.VideoWriter')
    mocked_draw_box = mocker.patch('yolo_video_detect.draw_box')
    mocked_blob = mocker.patch('cv2.dnn.blobFromImage')
    vs = mocker.Mock()
    net = mocker.Mock()
    ln = mocker.Mock()
    colors = mocker.Mock()
    labels = mocker.Mock()
    total = mocker.Mock()
    mocked_frame = mocker.Mock()
    mocked_frame.shape = [1, 2]
    vs.read = mocker.Mock(return_value=(False, mocked_frame))
    net.setInput = mocker.Mock(return_value='')
    net.forward = mocker.Mock(return_value='') 
    obj_detector.iterate_frames({'output':''}, vs, net, ln, colors, labels, total)
    mocked_draw_box.assert_not_called()
    mocked_blob.assert_not_called()

def test_draw_box(mocker):
    mocked_NMS_Boxes = mocker.patch('cv2.dnn.NMSBoxes')
    mocked_video_writer = mocker.patch('cv2.VideoWriter')
    mocked_video_writer.write = mocker.Mock(return_value='')
    obj_detector.draw_box(mocked_video_writer, {'confidence': 1, 'threshold': .5}, 1, 2, [], 1, 2, "frame", [], [],  3)
    mocked_NMS_Boxes.assert_called_with([], [], 1, .5)
    mocked_video_writer.write.assert_called_with("frame")

def test_clean_up(mocker):
    mocked_video_writer = mocker.patch('cv2.VideoWriter')
    mocked_video_writer.release = mocker.Mock()
    mocked_vs = mocker.patch('cv2.VideoCapture')
    mocked_vs.release = mocker.Mock()
    obj_detector.clean_up(mocked_video_writer, mocked_vs)
    mocked_video_writer.release.assert_any_call()
    mocked_vs.release.assert_any_call()
