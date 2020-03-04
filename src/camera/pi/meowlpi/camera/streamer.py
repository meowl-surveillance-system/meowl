import subprocess
import settings

class MeowlPiStreamer():
    """
        A ffmpeg wrapper to convert the stream in flv and send it to server
    """
    def __init__(self):
        """Opens a new process to run ffmpeg"""
        self.__ffmpeg_command = [
            'ffmpeg', '-y', 
            '-f', settings.STREAM_INPUT_FORMAT,
            '-i', '-', '-c:v', 'copy', '-map',
            '0:0', '-f', settings.STREAM_OUTPUT_FORMAT, 
            settings.STREAM_OUTPUT_URL]
        self.__process = subprocess.Popen(self.__ffmpeg_command, stdin=subprocess.PIPE)

    def get_input(self):
        """Returns the process pipe for input"""
        return self.__process.stdin

    def __del__(self):
        """Kills the ffmpeg process if this class instance is destroyed"""
        if self.__process.poll() is None:
            self.__process.kill()

