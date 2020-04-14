from settings import CASSANDRA_CLUSTER_IPS, CASSANDRA_CLUSTER_PORT
from cassandra.cluster import Cluster
from src.cluster_services import ClusterServices

cluster_services = ClusterServices(Cluster(CASSANDRA_CLUSTER_IPS, port=CASSANDRA_CLUSTER_PORT))

# Create keyspace
cluster_services.create_keyspace('streams')
cluster_services.set_keyspace('streams')

# Metadata table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS metadata (stream_id text, chunk_order timestamp, chunk_id text, PRIMARY KEY (stream_id, chunk_order))')

# Data table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS data (chunk_id text, chunk blob, PRIMARY KEY (chunk_id))')

# Session table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS sessions (sid text, session text, expires timestamp, PRIMARY KEY (sid))')

# Users table for querying with user_id
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS users_id (user_id text, email text, username text, password text, sid text, PRIMARY KEY(user_id))')

# Users table for querying with username
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS users_name (user_id text, email text, username text, password text, sid text, PRIMARY KEY(username))')

# Tables for storing OpenCV frames
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS cv_frames (camera_id text, stream_id text, frame_id text, frame blob, objects_detected blob, PRIMARY KEY(frame_id))')