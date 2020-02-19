import mock
import pytest
from pytest_mock import mocker
from meowlpi.app import create_app

def test_index():
    app = create_app()
    with app.test_client() as client:
        response = client.get('/')
        assert response.status_code == 200
        assert response.get_data().decode() == "Hello world"

def test_camera_start(mocker):
    camera_mock = mocker.Mock()
    camera_mock.start_recording = mocker.Mock()
    mock_camera = mocker.patch('meowlpi.camera.camera.PiStreamingCamera')
    mock_camera.return_value = camera_mock
    app = create_app()
    with app.test_client() as client:
        response = c.get('camera/start')
        assert response.status_code == 200
        assert response.get_data().decode() == "Raspberry Pi started streaming"

