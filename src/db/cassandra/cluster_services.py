import re

class ClusterServices:
  """The ClusterServices class provides methods used to create the keyspaces and tables 
     for the Meowl application
  
  Attributes:
      cluster: The Cassandra cluster for this instance
      session: The current session
  """
  def __init__(self, cluster):
    self.cluster = cluster
    self.__session = self.cluster.connect()


  def get_session(self):
    return self.__session


  def create_keyspace(self, keyspace_name):
    """Creates a Cassandra keyspace"""
    create_keyspace_query = "CREATE KEYSPACE IF NOT EXISTS %s WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }"
    if self.is_valid_keyspace_name(keyspace_name):
      self.get_session().execute(create_keyspace_query % (keyspace_name))
    else:
      print("Invalid keyspace name")


  def set_keyspace(self, keyspace_name):
    """Use a Cassandra keyspace"""
    self.get_session().set_keyspace(keyspace_name);


  def create_table_schema(self, table_query):
    """Creates a table"""
    self.get_session().execute(table_query);


  def shutdown_cluster(self):
    """Close the cluster when done"""
    self.cluster.shutdown()


  def is_valid_keyspace_name(self, keyspace_name):
    """Check if a keyspace name is valid"""
    if keyspace_name == None or not keyspace_name:
      return False
    return re.match(r"^[a-z_]*[^-]$", keyspace_name)
