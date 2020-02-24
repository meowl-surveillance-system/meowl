from picamera import PiCamera
from meowlpi.camera.streamer import MeowlPiStreamer
from time import sleep
import settings

class PiStreamingCamera():
    """
        A Raspberry Pi Camera class interface for streaming purposes
    """
    camera = None
    streamer = None

    def start(video_format='h264'):
        """Starts streaming from the camera on to the endpoint"""
        # Initalizes the camera static instance and wait for camera to warm up
        if not PiStreamingCamera.camera:
            PiStreamingCamera.camera = PiCamera( \
                    framerate=settings.FRAME_RATE, \
                    resolution=settings.CAMERA_RESOLUTION)
            sleep(2)
        if not PiStreamingCamera.streamer:
            PiStreamingCamera.streamer = MeowlPiStreamer()

        PiStreamingCamera.camera.start_recording(
            PiStreamingCamera.streamer.get_input(), \
            settings.VIDEO_FORMAT, \
            intra_period=settings.INTRA_PERIOD, \
            bitrate=settings.BIT_RATE, \
            quality=settings.CAMERA_QUALITY)
        return "Successfully started streaming from Raspberry Pi to {0} in video_format: {1}" \
                .format("ffmpeg", settings.VIDEO_FORMAT)

    def stop():
        """Stops streaming from the camera"""
        if PiStreamingCamera.camera is not None and not PiStreamingCamera.camera.closed:
            PiStreamingCamera.camera.stop_recording()
            PiStreamingCamera.camera.close()
            return "Successfully stopped streaming from Raspberry Pi"
        else:
            return "PiCamera did not start streaming"
