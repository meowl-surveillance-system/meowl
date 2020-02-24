import subprocess
import mock
from meowlpi.camera.streamer import MeowlPiStreamer
import settings

def test_if_subprocess_is_open():
    with mock.patch.object(subprocess, 'Popen') as mock_popen:
        streamer = MeowlPiStreamer()
        mock_popen.assert_called_once()

def test_subprocess_pipe(mocker):
    popen_mock = mocker.Mock()
    popen_mock.stdin = "hello"
    with mock.patch.object(subprocess, 'Popen', return_value=popen_mock):
        streamer = MeowlPiStreamer()
        assert streamer.get_input() == "hello"
