from settings import CASSANDRA_CLUSTER_IPS, CASSANDRA_CLUSTER_PORT
from cassandra.cluster import Cluster
from src.cluster_services import ClusterServices
from src.file_services import FileServices
from src.rtmp_saver import RtmpSaver
from flask import Flask
from getpass import getpass
import settings

app = Flask(__name__)
auth_options = {"loginUrl": settings.LOGIN_URL,
    "rtmpRequestUrl": settings.RTMP_REQUEST_URL,
    "username": settings.USERNAME,
    "password": settings.PASSWORD}

# Connects to local/remote Cluster set by environment variables
cluster_services = ClusterServices(Cluster(CASSANDRA_CLUSTER_IPS, port=CASSANDRA_CLUSTER_PORT))

# Set the keyspace
cluster_services.set_keyspace('streams')

file_services = FileServices(cluster_services.get_session())

# Handles multiple streams
running_streams = {}


@app.route("/")
def hello():
  return "Hello World"

@app.route("/store/<stream_id>")
def store_stream(stream_id):
  """Read from stream and store in DB"""
  try:
    rtmp_saver = RtmpSaver(
      settings.RTMP_IP,
      settings.RTMP_PORT,
      stream_id,
      auth_options)
  except BaseException:
    return "Error connecting to stream", 400
  try:
    running_streams[stream_id] = rtmp_saver
    rtmp_saver.start(file_services)
  except BaseException:
    return "Error storing stream", 500

  return "Started storing stream", 200


@app.route("/stop/<stream_id>")
def stop_stream(stream_id):
  """Stop reading from stream"""
  try:
    running_streams[stream_id].stop()
    del running_streams[stream_id]
  except BaseException:
    return "Error halting saving of stream", 400

  return "Stopped storing stream", 200


if __name__ == '__main__':
  app.run(debug=True)
