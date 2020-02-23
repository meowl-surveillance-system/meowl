import librtmp
from cassandra.cluster import Cluster
from cluster_services import ClusterServices
from datetime import datetime
from file_services import FileServices




cluster_services = ClusterServices(Cluster())
cluster_services.create_keyspace('streams')
cluster_services.set_keyspace('streams')
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS metadata (stream_id text, time timestamp, chunk_id text, PRIMARY KEY (stream_id, time))')
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS data (chunk_id text, chunk blob, PRIMARY KEY (chunk_id))')


file_services = FileServices(cluster_services.get_session())


conn = librtmp.RTMP("some ip", live=True)
conn.connect()
stream = conn.create_stream()


chunk_size=2097152
bytes_read = 0
previous_read = 0
data=b''

def is_last_chunk(bytes_read, previous_read):
  return bytes_read == previous_read and bytes_read != 0

while True:
  data += stream.read(chunk_size)
  bytes_read = len(data)
  # Store the last remaining chunk in Cassandra
  if is_last_chunk(bytes_read, previous_read):
    file_services.store_bytes('test_id', data[:bytes_read], datetime.now())
    data = data[bytes_read:]
  # Store (chunk_size)MB chunks in Cassandra
  if bytes_read >= chunk_size:
    file_services.store_bytes('test_id', data[:chunk_size], datetime.now()) 
    data = data[chunk_size:]
  # Keep track of the length of the previous read
  previous_read = bytes_read
