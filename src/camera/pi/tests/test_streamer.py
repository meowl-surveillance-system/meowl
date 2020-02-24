import mock
import pytest
from pytest_mock import mocker
from meowlpi.camera.streamer import MeowlPiStreamer
import settings
import subprocess

def test_if_subprocess_is_open(mocker):
    with mock.patch.object(subprocess, 'Popen') as mock_Popen:
        streamer = MeowlPiStreamer()
        mock_Popen.assert_called_once()

def test_subprocess_pipe(mocker):
    popen_mock = mocker.Mock()
    popen_mock.stdin = "hello"
    with mock.patch.object(subprocess, 'Popen', return_value=popen_mock) as mock_Popen:
        streamer = MeowlPiStreamer()
        assert streamer.get_input() == "hello"
