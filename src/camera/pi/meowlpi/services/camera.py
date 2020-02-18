from picamera import PiCamera
from meowlpi.services.streamer import MeowlPiStreamer

# An interface for the Raspberry Pi Camera for streaming
class PiStreamingCamera():
    # Sets the camera and the endpoint where the stream goes to
    def __init__(self, camera = PiCamera(), endpoint = MeowlPiStreamer()):
        self.__camera = camera
        self.__endpoint = endpoint

    # Stops the camera from streaming and closes it
    def __del__(self):
        self.stop()
        if not self.__camera.closed:
            self.__camera.close()

    # Starts streaming from the camera
    def start(self):
        self.__camera.start_recording(self.__endpoint, 'h264')

    # Stops streaming from the camera and closes it
    def stop(self):
        self.__camera.stop_recording()
        self.__camera.close()
