import concurrent
import cv2
import numpy as np
import sys

def prepare_images(image_paths):
  """Prepare the images by rotating the images for upright face

    This method also filters out all the images that aren't single-face 
    pictures by forking out each image into their own process. 
    The method replaces the current image with the rotated, verified image.

    Args:
      image_paths: List of proper paths to the images
    
    Returns:
      Image paths that are verified by this method
  """
  proper_paths = []
  with concurrent.futures.ProcessPoolExecutor(max_workers=10) as executor:
    proper_paths = executor.map(_prepare_image, [path for path in image_paths])
  proper_paths = list(filter(None, proper_paths))
  return proper_paths

def _prepare_image(path):
  """
    Returns a path if the model detects a face in image else None

    Overwrites the image path with a face-aligned image
  """
  img = cv2.imread(path)
  faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
  ROTATE_FLAGS = [None, cv2.ROTATE_90_CLOCKWISE, cv2.ROTATE_90_COUNTERCLOCKWISE, cv2.ROTATE_180]
  for flag in ROTATE_FLAGS:
    curr_img = cv2.rotate(img, flag) if flag else img
    gray_img = cv2.cvtColor(curr_img, cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale(
        gray_img,
        scaleFactor=1.6,
        minNeighbors=2,
        minSize=(30, 30)
    )
    if len(faces) == 1:
      print('[INFO] Verified {path}'.format(path=path))
      if flag:
        cv2.imwrite(path, curr_img)
      return path
  return None