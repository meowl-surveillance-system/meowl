import mock
import pytest
from pytest_mock import mocker
from picamera import PiCamera
from meowlpi.camera.camera import PiStreamingCamera

def test_picamera_recording(mocker):
    picamera_mock = mocker.Mock()
    picamera_mock.start_recording.return_value = mocker.Mock()
    picamera_mock.stop_recording.return_value = mocker.Mock()
    picamera_mock.close.return_value = mocker.Mock()
    picamera_mock.closed.__bool__= mocker.Mock(return_value=False)
    endpoint_stub = mocker.stub(name="endpoint_stub")

    PiStreamingCamera.camera = picamera_mock
    PiStreamingCamera.start('h264', endpoint_stub)
    picamera_mock.start_recording.assert_called_with(endpoint_stub, 'h264')
    PiStreamingCamera.stop()
    picamera_mock.stop_recording.assert_called_with()
    picamera_mock.close.assert_called_with()

def test_picamera_not_recording(mocker):
    picamera_mock = mocker.Mock()
    picamera_mock.closed.__bool__= mocker.Mock(return_value=True)
    picamera_mock.stop_recording.return_value = mocker.Mock()
    picamera_mock.close.return_value = mocker.Mock()
    endpoint_stub = mocker.stub(name="endpoint_stub")
    
    PiStreamingCamera.camera = picamera_mock
    PiStreamingCamera.endpoint = endpoint_stub
    PiStreamingCamera.stop()

    picamera_mock.stop_recording.assert_not_called()
    picamera_mock.close.assert_not_called()
