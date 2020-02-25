from flask import Flask, request
import cv2
import numpy as np
import server.stream as stream

app = Flask(__name__)

@app.route('/display_stream/')
def display_stream():
    link = request.args.get('link')
    stream.get_stream(link)
    return "Finished Displaying" 
