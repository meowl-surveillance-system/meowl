from cassandra.cluster import Cluster
from src.cluster_services import ClusterServices

cluster_services = ClusterServices(Cluster())

# Create keyspace
cluster_services.create_keyspace('streams')
cluster_services.set_keyspace('streams')

# Metadata table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS metadata (stream_id text, chunk_order timestamp, chunk_id text, PRIMARY KEY (stream_id, chunk_order))')

# Data table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS data (chunk_id text, chunk blob, PRIMARY KEY (chunk_id))')

# Session table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS session (sid text, session text, expires timestamp, PRIMARY KEY (sid))')

# Users table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS users (user_id text, username text, password text, sid text, PRIMARY KEY(user_id))')
