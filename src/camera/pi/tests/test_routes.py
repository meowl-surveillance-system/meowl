import mock
from meowlpi.app import create_app
from meowlpi.camera.camera import PiStreamingCamera
def test_index():
    app = create_app()
    with app.test_client() as client:
        response = client.get('/')
        assert response.status_code == 200
        assert response.get_data().decode() == 'Hello world'

def test_camera_start():
    with mock.patch.object(PiStreamingCamera, 'start', return_value='Hello') as mock_method:
        app = create_app()
        with app.test_client() as client:
            response = client.get('camera/start')
            assert response.get_data().decode() == 'Hello'
            mock_method.assert_called_with()

def test_camera_stop():
    with mock.patch.object(PiStreamingCamera, 'stop', return_value='World') as mock_method:
        app = create_app()
        with app.test_client() as client:
            response = client.get('camera/stop')
            assert response.get_data().decode() == 'World'
            mock_method.assert_called_with()
