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

# TODO(chc5): Create a test for camera/start route
def test_camera_start():
    pass

# TODO(chc5): Create a test for camera/stop route
def test_camera_end():
    pass
