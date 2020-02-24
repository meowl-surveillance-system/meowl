import subprocess
import os
import settings

class MeowlPiStreamer():
    ffmpeg = None
    
    def __init__(self):
        self.__ffmpeg_command = [
            'ffmpeg', '-y', 
            '-f', settings.STREAM_INPUT_FORMAT,
            '-i', '-', '-c:v', 'copy', '-map',
            '0:0', '-f', settings.STREAM_OUTPUT_FORMAT, 
            os.environ['SERVER_RTMP_URL_LINK']
            ]
        self.__process = subprocess.Popen(self.__ffmpeg_command, stdin=subprocess.PIPE)

    def get_input(self):
        return self.__process.stdin

    def __del__(self):
        if self.__process.poll() is None:
            self.__process.kill()

