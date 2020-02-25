"""
  Default values for Meowl
"""
# Camera Configurations
# Source: https://picamera.readthedocs.io/en/release-1.13/api_camera.html
FRAME_RATE = 60
CAMERA_RESOLUTION = (1280, 720)
CAMERA_QUALITY = 25
VIDEO_FORMAT = "h264"
BIT_RATE = 6000000

# Streaming Configurations using ffmpeg
STREAM_INPUT_FORMAT = "h264"
STREAM_OUTPUT_FORMAT = "flv"
