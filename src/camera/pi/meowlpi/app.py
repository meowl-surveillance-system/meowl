import os
from flask import Flask, session 
from meowlpi.services.camera import PiStreamingCamera

app = Flask(__name__)

# Returns Hello world
@app.route('/')
def index():
    return 'Hello world'

# Starts streaming the camera on the session
@app.route('/camera/start')
def start_camera_stream():
    if 'picamera' not in session:
        session['picamera'] = PiStreamingCamera()
    session['picamera'].start()
    return 'Raspberry Pi started streaming'

# Stops the camera stream if it is in the session
@app.route('/camera/stop')
def stop_camera_stream():
    if 'picamera' not in session:
        return 'PiStreamingCamera is uninitialized'
    session['picamera'].stop()
    return 'Raspberry Pi stopped streaming'

# Gets the secret Key from the environment and runs the app
if __name__ == '__main__':
    if not os.environ.get('RASPBERRY_PI_FLASK_SECRET_KEY'):
        print('RASPBERRY_PI_FLASK_SECRET_KEY: not found')
    else:
        app.secret_key = os.environ.get('RASPBERRY_PI_FLASK_SECRET_KEY')
        app.run(debug=True, host='0.0.0.0')
