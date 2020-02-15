from flask import Flask, g
from services.picamera import PiStreamingCamera

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello world'

@app.route('/camera/start')
def start_camera_stream():
    if 'picamera' not in g:
        g.picamera = PiStreamingCamera()
    g.picamera.start()
    return 'Raspberry Pi started streaming'

@app.route('/camera/stop')
def stop_camera_stream():
    if 'picamera' not in g:
        return 'PiStreamingCamera is uninitialized'
    g.picamera.stop()
    return 'Raspberry Pi stopped streaming'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
