from settings import CASSANDRA_CLUSTER_IPS, CASSANDRA_CLUSTER_PORT, USERNAME, PASSWORD, EMAIL
from cassandra.cluster import Cluster
from src.cluster_services import ClusterServices
from uuid import uuid4
import bcrypt 

cluster_services = ClusterServices(Cluster(CASSANDRA_CLUSTER_IPS, port=CASSANDRA_CLUSTER_PORT))

# Create keyspace
cluster_services.create_keyspace('streams')
cluster_services.set_keyspace('streams')

# Metadata table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS metadata (stream_id text, chunk_order timestamp, chunk_id text, PRIMARY KEY (stream_id, chunk_order))')

# Data table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS data (chunk_id text, chunk blob, PRIMARY KEY (chunk_id))')

# Camera streamid table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS camera_streams (camera_id text, stream_id text, stream_date timestamp, PRIMARY KEY (camera_id, stream_date)) WITH CLUSTERING ORDER BY(stream_date DESC);')

# Livestreaming cameras table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS live_cameras (camera_id text, live boolean, PRIMARY KEY (camera_id));')

# User Camera table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS user_cameras (user_id text, camera_id text, PRIMARY KEY (user_id, camera_id))')

# User Camera table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS camera_users (user_id text, camera_id text, PRIMARY KEY (camera_id, user_id))')

# Session table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS sessions (sid text, session text, expires timestamp, PRIMARY KEY (sid))')

# Users table for querying with user_id
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS users_id (user_id text, email text, username text, password text, sid text, admin boolean, PRIMARY KEY(user_id))')

# Users table for querying with username
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS users_name (user_id text, email text, username text, password text, sid text, admin boolean, PRIMARY KEY(username))')

# Pending accounts table to be approved or rejected by an admin
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS pending_accounts (user_id text, email text, username text, password text, PRIMARY KEY(username))')

# User Groups table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS user_groups (user_id text, group_id text, PRIMARY KEY (user_id, group_id))')

# Group Users table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS group_users (group_id text, user_id text, PRIMARY KEY (group_id, user_id))')

# Password reset token table
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS password_reset_tokens (reset_token text, user_id text, PRIMARY KEY(reset_token))')

# Tables for storing OpenCV frames
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS cv_frames (camera_id text, stream_id text, frame_id text, frame blob, objects_detected blob, PRIMARY KEY(frame_id, stream_id))')

# Table for storing training data
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS training_data (data_id uuid, class_name text, insert_date timestamp, data blob, PRIMARY KEY(data_id))')

# Table for storing Notifications
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS notif (date timestamp, type text, email text, name text, frame_id text, stream_id text, PRIMARY KEY(date))')

# Table for Blacklist
cluster_services.create_table_schema('CREATE TABLE IF NOT EXISTS blacklist (name text), PRIMARY KEY(name))')

# Add admin credentials
userId = str(uuid4())
hashed = bcrypt.hashpw(PASSWORD.encode(), bcrypt.gensalt()).decode('utf-8')
cluster_services.get_session().execute('INSERT INTO users_id (user_id, email, username, password, admin) VALUES (%s, %s, %s, %s, %s)', (userId, EMAIL, USERNAME, hashed, True))
cluster_services.get_session().execute('INSERT INTO users_name (user_id, email, username, password, admin) VALUES (%s, %s, %s, %s, %s)', (userId, EMAIL, USERNAME, hashed, True))
