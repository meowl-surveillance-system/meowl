from picamera import PiCamera
from time import sleep
import sys
#n = 0
class CameraStream():
    def write(self, buffer):
        print(buffer)
        #global n
        #print("hello", n, sys.getsizeof(buffer))
        #n += 1
    def flush(self):
        pass

def record_video(path_to_file, seconds = 5):
    with PiCamera() as camera:
        camera.start_recording(path_to_file)
        sleep(seconds)
        camera.stop_recording()

def capture_picture(path_to_file, annotate_text = '', seconds_to_adjust = 1):
    with PiCamera() as camera:
        camera.annotate_text = annotate_text
        sleep(seconds_to_adjust)
        camera.capture(path_to_file)

def stream(seconds = 10):
    with PiCamera() as camera:
        endpoint = CameraStream()
        camera.start_recording(endpoint, 'h264')
        sleep(seconds)
        camera.stop_recording()
       
def preview(seconds = 5):
    with PiCamera() as camera:
        camera.start_preview()
        sleep(seconds)
        camera.end_preview()

#irecord_video('./output/video.h264')
# capture_picture('./output/image.jpeg', 'Testing!!!')
stream()
# preview()

