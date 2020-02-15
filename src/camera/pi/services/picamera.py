from picamera import PiCamera
from time import sleep

class CameraStream():
    def write(self, buffer):
        print(buffer)
        print('hello')
    
    def flush(self):
        pass

class PiStreamingCamera():
    def __init__(self):
        self.__camera = PiCamera()
        self.__endpoint = CameraStream()

    def __del__(self):
        self.stop()
        if not self.__camera.closed:
            self.__camera.close()

    def start(self):
        self.__camera.start_recording(self.__endpoint, 'h264')

    def stop(self):
        self.__camera.stop_recording()
        self.__camera.close()

    def __stream(seconds = 5):
        with PiCamera() as camera:
            endpoint = CameraStream()
            camera.start_recording(endpoint, 'h264')
            sleep(seconds)
            camera.stop_recording()
