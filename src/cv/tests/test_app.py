import mock
import pytest
from pytest_mock import mocker
import cv2
import server.stream as stream

def test_get_stream(mocker):
    mocked_vid_capture = mocker.Mock()
    mocked_vid_capture.read.return_value = mocker.Mock(), mocker.Mock()
    mock_cv2 = mocker.patch('cv2.VideoCapture')
    mock_cv2.return_value = mocked_vid_capture
    stream.get_stream('abc')
    mocked_vid_capture.isOpened.assert_called()
