import subprocess
import os

class MeowlPiStreamer():
    ffmpeg = subprocess.Popen([
        'ffmpeg', '-y', '-f', 'h264',
        '-i', '-', '-c:v', 'copy', '-map',
        '0:0', '-f', 'flv', os.environ['SERVER_RTMP_URL_LINK']
        ], stdin=subprocess.PIPE)

