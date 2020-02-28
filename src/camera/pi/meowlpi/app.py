from flask import Flask, session, current_app
from meowlpi.camera.camera import PiStreamingCamera
import settings

def create_app(test_config=None):
    """ Create and attach the camera to the Meowl-Pi app"""
    app = Flask(__name__, instance_relative_config=True)
    app.pi_streaming_camera = PiStreamingCamera
    if settings.SECRET_KEY is None:
        raise Exception('RASPBERRY_PI_FLASK_SECRET_KEY: not found')
    app.secret_key = settings.SECRET_KEY

    @app.route('/')
    def index():
        """Returns Hello World as a string"""
        return 'Hello world'

    @app.route('/camera/start')
    def start_camera_stream():
        """Starts streaming the camera"""
        return current_app.pi_streaming_camera.start()

    @app.route('/camera/stop')
    def stop_camera_stream():
        """Stops the camera from streaming"""
        return current_app.pi_streaming_camera.stop()
    return app

if __name__ == '__main__':
    main_app = create_app()
    with main_app.app_context():
        main_app.run(debug=True, host='0.0.0.0')
