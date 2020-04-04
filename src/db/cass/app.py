from cassandra.cluster import Cluster
from src.cluster_services import ClusterServices
from src.file_services import FileServices
from src.rtmp_saver import RtmpSaver
from flask import Flask
import settings

app = Flask(__name__)

cluster_services = ClusterServices(Cluster())

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
  rtmp_saver = RtmpSaver(settings.RTMP_IP, settings.PORT, stream_id)
  running_streams[stream_id] = rtmp_saver
  rtmp_saver.start(file_services)

@app.route("/stop/<stream_id>")
def stop_stream(stream_id):
  """Stop reading from stream"""
  running_streams[stream_id].stop()
  del running_streams[stream_id]

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0')
