import os
import settings
import cv2

def extract_resources(file_name, rotation_amt):
    """ Extracts each frame from video and saves as jpg """
    cap = cv2.VideoCapture(file_name)
    i = 0
    os.system('mkdir frame_extractions')
    while(cap.isOpened()):
        ret, frame = cap.read()
        if (rotation_amt > -1) and (rotation_amt < 3):
            frame = cv2.rotate(frame, rotation_amt)
        if ret == False: 
            break
        cv2.imwrite('frame_extractions/abc'+str(i)+'.jpg',frame)
        i+=1
    cap.release()
    cv2.destroyAllWindows()

