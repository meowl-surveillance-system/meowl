from picamera import PiCamera
from meowlpi.camera.streamer import MeowlPiStreamer
from time import sleep

class PiStreamingCamera:
    """
        A Raspberry Pi Camera class interface for streaming purposes
    """
    camera = None
    endpoint = MeowlPiStreamer()

    def start(video_format='h264'):
        """Starts streaming from the camera on to the endpoint"""
        # Initalizes the camera singleton instance and wait for camera to warm up
        if not PiStreamingCamera.camera:
            PiStreamingCamera.camera = PiCamera()
            sleep(2)

        PiStreamingCamera.camera.start_recording(PiStreamingCamera.endpoint, video_format)
        return "Successfully started streaming from Raspberry Pi to {0} in video_format:{1}" \
                .format(str(PiStreamingCamera.endpoint), video_format)

    def stop():
        """Stops streaming from the camera"""
        if PiStreamingCamera.camera is not None and not PiStreamingCamera.camera.closed:
            PiStreamingCamera.camera.stop_recording()
            PiStreamingCamera.camera.close()
            return "Successfully stopped streaming from Raspberry Pi"
        else:
            return "PiCamera did not start streaming"
