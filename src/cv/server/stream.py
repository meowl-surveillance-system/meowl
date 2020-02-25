import cv2
import numpy as np

def get_stream(link):
    cap = cv2.VideoCapture()
    cap.open(link)
    if not cap.open:
        print("Failed To Open")
    while (cap.isOpened()):
        ret, frame = cap.read()
        if ret == True:
            cv2.imshow('Frame',frame)

            if cv2.waitKey(25) & 0xFF == ord('q'):
                break
        else: 
            break
 
    cap.release()
 
    cv2.destroyAllWindows()

    print("Finished Displaying Video")

