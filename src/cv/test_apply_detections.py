import sys
import cv2
import mock
import os
import pytest
from pytest_mock import mocker
sys.modules['cv_producer'] = __import__('mock')
import apply_detections as app_det
import yolo_video_detect
import recognize_faces

def test_init_video_stream(mocker):
    mocked_video_stream = mocker.patch('cv2.VideoCapture')
    tmp_mock = mocker.Mock()
    tmp_mock.get.return_value = "123"
    mocked_video_stream.return_value = tmp_mock
    app_det.init_video_stream({'input':'123'})
    mocked_video_stream.assert_any_call('123')

def test_iterate_frames(mocker): 
    mocked_draw_box = mocker.patch('yolo_video_detect.draw_box')
    mocked_analyze_detections = mocker.patch(
        'recognize_faces.analyze_detections')
    mocked_blob = mocker.patch('cv2.dnn.blobFromImage')
    mocked_init = mocker.patch('apply_detections.init_video_stream')
    mocked_video_capture = mocker.patch('cv2.VideoCapture')
    mocked_frame = mocker.Mock()
    mocked_frame.shape = [1, 2]
    mocked_video_capture.read = mocker.Mock(return_value=(False, mocked_frame))
    mocked_init.return_value = mocked_video_capture
    detector = mocker.Mock()
    embedder = mocker.Mock()
    recognizer = mocker.Mock()
    le = mocker.Mock()
    net = mocker.Mock()
    ln = mocker.Mock()
    colors = mocker.Mock()
    labels = mocker.Mock()
    total = mocker.Mock()
    mocked_frame = mocker.Mock()
    mocked_frame.shape = [1, 2]
    net.setInput = mocker.Mock(return_value='')
    net.forward = mocker.Mock(return_value='') 
    app_det.iterate_frames({'input':''}, detector,
        embedder, recognizer, le, net, ln, colors, labels, total)
    mocked_draw_box.assert_not_called()
    mocked_blob.assert_not_called()
    mocked_analyze_detections.assert_not_called()

def test_release(mocker):
    mocked_stream = mocker.patch('cv2.VideoCapture')
    mocked_stream.release = mocker.Mock()
    app_det.release(mocked_stream)
    mocked_stream.release.assert_any_call()

