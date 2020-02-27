from cassandra.cluster import Cluster
from cluster_services import ClusterServices
from file_services import FileServices
from rtmp_saver import RtmpSaver
from flask import Flask
import settings

app = Flask(__name__)

cluster_services = ClusterServices(Cluster())

# Create and set the keyspace
cluster_services.create_keyspace('streams')
cluster_services.set_keyspace('streams')

# Create tables for storing stream
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS metadata (stream_id text, chunk_order timestamp, chunk_id text, PRIMARY KEY (stream_id, chunk_order))')
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS data (chunk_id text, chunk blob, PRIMARY KEY (chunk_id))')

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
  del running_stream[stream_id]

if __name__ == '__main__':
  app.run(debug=True)
