import subprocess
import mock
import settings
from meowlpi.camera.camera import PiStreamingCamera
from meowlpi.camera.streamer import MeowlPiStreamer

def test_picamera_recording(mocker):
    picamera_mock = mocker.Mock()
    picamera_mock.start_recording.return_value = mocker.Mock()
    picamera_mock.stop_recording.return_value = mocker.Mock()
    picamera_mock.close.return_value = mocker.Mock()
    picamera_mock.closed.__bool__ = mocker.Mock(return_value=False)
    with mock.patch.object(MeowlPiStreamer, 'get_input', return_value="hello") as _, \
            mock.patch.object(subprocess, 'Popen', return_value=mocker.Mock()) as __:
        PiStreamingCamera.camera = picamera_mock
        PiStreamingCamera.start()
        picamera_mock.start_recording.assert_called_with( \
                "hello", \
                settings.VIDEO_FORMAT, \
                bitrate=settings.BIT_RATE, \
                quality=settings.CAMERA_QUALITY)
    PiStreamingCamera.stop()
    picamera_mock.stop_recording.assert_called_with()
    picamera_mock.close.assert_called_with()

def test_picamera_not_recording(mocker):
    picamera_mock = mocker.Mock()
    picamera_mock.closed.__bool__ = mocker.Mock(return_value=True)
    picamera_mock.stop_recording.return_value = mocker.Mock()
    picamera_mock.close.return_value = mocker.Mock()
    endpoint_stub = mocker.stub(name="endpoint_stub")
    PiStreamingCamera.camera = picamera_mock
    PiStreamingCamera.endpoint = endpoint_stub
    PiStreamingCamera.stop()

    picamera_mock.stop_recording.assert_not_called()
    picamera_mock.close.assert_not_called()
