import os
from flask import Flask, session
from meowlpi.camera.camera import PiStreamingCamera

def create_app(test_config=None):
    """ Create and configure Meowl app"""
    app = Flask(__name__, instance_relative_config=True)
    if not os.environ.get('RASPBERRY_PI_FLASK_SECRET_KEY'):
        print('RASPBERRY_PI_FLASK_SECRET_KEY: not found')
        return None
    else:
        app.secret_key = os.environ.get('RASPBERRY_PI_FLASK_SECRET_KEY')

    @app.route('/')
    def index():
        """Returns Hello World as a string"""
        return 'Hello world'

    @app.route('/camera/start')
    def start_camera_stream():
        """Starts streaming the camera and stores this in the session"""
        if 'picamera' not in session:
            session['picamera'] = PiStreamingCamera()
        session['picamera'].start()
        return 'Raspberry Pi started streaming'

    @app.route('/camera/stop')
    def stop_camera_stream():
        """Stops the camera from streaming if it is the session"""
        if 'picamera' not in session:
            return 'PiStreamingCamera is uninitialized'
        session['picamera'].stop()
        return 'Raspberry Pi stopped streaming'
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0')
