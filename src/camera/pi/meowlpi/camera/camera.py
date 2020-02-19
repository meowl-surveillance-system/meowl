from picamera import PiCamera
from meowlpi.camera.streamer import MeowlPiStreamer

class PiStreamingCamera():
    """
        A Raspberry Pi Camera interface for streaming purposes
    """

    def __init__(self, camera=None, endpoint=MeowlPiStreamer()):
        """Saves the camera and the streaming endpoint"""
        if camera is not None:
            self.camera = camera
        else:
            self.camera = PiCamera()
        self.__endpoint = endpoint

    def __del__(self):
        """Closes the camera if this class instance is destroyed"""
        self.stop()

    def start(self, video_format="h264"):
        """Starts streaming from the camera on to the endpoint"""
        self.camera.start_recording(self.__endpoint, video_format)

    def stop(self):
        """Stops streaming from the camera"""
        self.camera.stop_recording()
        self.camera.close()
