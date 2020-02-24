from picamera import PiCamera
from meowlpi.camera.streamer import MeowlPiStreamer
from time import sleep

class PiStreamingCamera:
    """
        A Raspberry Pi Camera class interface for streaming purposes
    """
    camera = None
    streamer = None

    def start(video_format='h264'):
        """Starts streaming from the camera on to the endpoint"""
        # Initalizes the camera singleton instance and wait for camera to warm up
        if not PiStreamingCamera.camera:
            PiStreamingCamera.camera = PiCamera(framerate=60, resolution=(1280,720))
            sleep(2)
        if not PiStreamingCamera.streamer:
            PiStreamingCamera.streamer = MeowlPiStreamer()

        PiStreamingCamera.camera.start_recording(PiStreamingCamera.streamer.get_input(), video_format)
        return "Successfully started streaming from Raspberry Pi to {0} in video_format:{1}" \
                .format("ffmpeg", video_format, bitrate=2000000, intra_period=0)

    def stop():
        """Stops streaming from the camera"""
        if PiStreamingCamera.camera is not None and not PiStreamingCamera.camera.closed:
            PiStreamingCamera.camera.stop_recording()
            PiStreamingCamera.camera.close()
            return "Successfully stopped streaming from Raspberry Pi"
        else:
            return "PiCamera did not start streaming"
