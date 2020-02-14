import mock
import pytest
from pytest_mock import mocker
import cv2
import app

def test_display(mocker):
    mocked_vid_capture = mocker.Mock()
    mocked_vid_capture.read.return_value = mocker.Mock(), mocker.Mock()
    mock_cv2 = mocker.patch('cv2.VideoCapture')
    mock_cv2.return_value = mocked_vid_capture
    app.display_vid('abc')
    mocked_vid_capture.isOpened.assert_called()

