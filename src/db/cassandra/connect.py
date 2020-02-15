from cassandra.cluster import Cluster

# cqlsh statements
CREATE_KEYSPACE = "CREATE KEYSPACE IF NOT EXISTS streams WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }"

SELECT_STREAMS_KEYSPACE = "USE streams"

CREATE_FILES_TABLE = "CREATE TABLE IF NOT EXISTS files (file_id text, chunk_order int, chunk_id text, PRIMARY KEY(file_id, chunk_order))"

CREATE_FILES_DATA_TABLE = "CREATE TABLE IF NOT EXISTS files_data (chunk_id text, chunk blob, PRIMARY KEY(chunk_id))"


# Open a Cassandra cluster connection
cluster = Cluster()
session = cluster.connect()

# Set up keyspace and tables
session.execute(CREATE_KEYSPACE);
session.execute(SELECT_STREAMS_KEYSPACE);
session.execute(CREATE_FILES_TABLE);
session.execute(CREATE_FILES_DATA_TABLE);
