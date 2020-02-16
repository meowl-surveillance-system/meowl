from cassandra.cluster import Cluster
from file_services import FileServices


# cqlsh statements
create_keyspace = "CREATE KEYSPACE IF NOT EXISTS streams WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }"

select_keyspace = "USE streams"

create_files_table = "CREATE TABLE IF NOT EXISTS files (file_id text, chunk_order int, chunk_id text, PRIMARY KEY(file_id, chunk_order))"

create_files_data_table = "CREATE TABLE IF NOT EXISTS files_data (chunk_id text, chunk blob, PRIMARY KEY(chunk_id))"


# Open a Cassandra cluster connection
cluster = Cluster()
session = cluster.connect()

# Set up keyspace and tables
session.execute(create_keyspace);
session.execute(select_keyspace);
session.execute(create_files_table);
session.execute(create_files_data_table);


fs = FileServices(session)

video_bytes = fs.retrieve_file('/home/goat/Downloads/vid.mp4')

FILE_OUTPUT = 'vid.mp4'

out_file = open(FILE_OUTPUT, 'wb')
out_file.write(bytearray(video_bytes))
out_file.close()


