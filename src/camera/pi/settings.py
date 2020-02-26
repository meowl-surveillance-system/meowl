import os
"""
  Default values for Meowl
"""
# PiCamera Configurations
# Source: https://picamera.readthedocs.io/en/release-1.13/api_camera.html
FRAME_RATE = 60
CAMERA_RESOLUTION = (1280, 720)
CAMERA_QUALITY = 25
VIDEO_FORMAT = "h264"
BIT_RATE = 6000000

# Streaming Configs for ffmpeg
STREAM_INPUT_FORMAT = "h264"
STREAM_OUTPUT_FORMAT = "flv"
STREAM_OUTPUT_URL = os.environ.get('SERVER_RTMP_URL_LINK',
  '/tmp/meowl_video_stream.flv')

# Meowl Configs
SECRET_KEY = os.environ.get('RASPBERRY_PI_FLASK_SECRET_KEY')
