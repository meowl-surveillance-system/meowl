from picamera import PiCamera
from meowlpi.services.streamer import MeowlPiStreamer

class PiStreamingCamera():
    """
        A Raspberry Pi Camera interface for streaming purposes
    """

    def __init__(self, camera = PiCamera(), endpoint = MeowlPiStreamer()):
        """Saves the camera and the streaming endpoint"""
        self.__camera = camera
        self.__endpoint = endpoint

    def __del__(self):
        """Closes the camera if this class instance is destroyed"""
        if not self.__camera.closed:
            self.__camera.close()
        self.stop()

    def start(self, video_format="h264"):
        """Starts streaming from the camera on to the endpoint"""
        self.__camera.start_recording(self.__endpoint, video_format)

    def stop(self):
        """Stops streaming from the camera"""
        self.__camera.stop_recording()
        self.__camera.close()
