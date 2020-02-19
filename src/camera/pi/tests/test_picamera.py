import mock
import pytest
from pytest_mock import mocker
from picamera import PiCamera
from meowlpi.camera.camera import PiStreamingCamera
from meowlpi.camera.streamer import MeowlPiStreamer

def test_picamera_recording(mocker):
    picamera_mock = mocker.Mock()
    picamera_mock.start_recording.return_value = mocker.Mock()
    picamera_mock.stop_recording.return_value = mocker.Mock()
    picamera_mock.close.return_value = mocker.Mock()
    picamera_mock.closed.return_value = False

    endpoint_stub = mocker.stub(name="endpoint_stub")
    camera = PiStreamingCamera(picamera_mock, endpoint_stub)
    camera.start()
    picamera_mock.start_recording.assert_called_with(endpoint_stub, 'h264')
    camera.stop()
    picamera_mock.stop_recording.assert_called_with()
    picamera_mock.close.assert_called_with()

