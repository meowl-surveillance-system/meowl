class ClusterServices:
  """The ClusterServices class provides methods used to initialize a Cassandra connection and to create the appropriate table schemas for video storage
  
  Attributes:
      create_keyspace_query: Create the streams keyspace
      select_keyspace_query: Select and use the streams keyspace
      create_files_table_query: Create the files table
      create_files_data_table_query: Create the files_data table
      cluster: The Cassandra cluster for this instance
      session: The current session
  """

  def __init__(self, cluster):
    self.create_keyspace_query = "CREATE KEYSPACE IF NOT EXISTS streams WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }"
    self.select_keyspace_query = "USE streams"
    self.create_files_table_query = "CREATE TABLE IF NOT EXISTS files (file_id text, chunk_order int, chunk_id text, PRIMARY KEY(file_id, chunk_order))"
    self.create_files_data_table_query = "CREATE TABLE IF NOT EXISTS files_data (chunk_id text, chunk blob, PRIMARY KEY(chunk_id))"
    self.cluster = cluster
    self.session = self.cluster.connect()
    self.create_keyspace()
    self.select_keyspace()
    self.create_table_schemas()


  def get_session(self):
    return self.session


  def create_keyspace(self):
    self.session.execute(self.create_keyspace_query);


  def select_keyspace(self):
    self.session.execute(self.select_keyspace_query);


  def create_table_schemas(self):
    self.session.execute(self.create_files_table_query);
    self.session.execute(self.create_files_data_table_query);

  def shutdown_cluster(self):
    self.cluster.shutdown()
