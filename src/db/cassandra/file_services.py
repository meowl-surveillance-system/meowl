import sys
from cassandra.cluster import Cluster
from uuid import uuid4

class FileServices:
  """A class used for making video file queries
  
  Attributes:
      session: The Cassandra cluster session for execution of queries
      insert_metadata_query: Insert the stream ID, timestamp and chunk ID into the metadata table
      insert_data_query: Insert the chunk of data into the data table
      select_file_query: Select the chunk IDs of the passed in file hash
      select_chunk_query: Select the chunks of data based on the Chunk IDs
  """

  def __init__(self, session):
    """Initlialize a Cassandra cluster session and prepare cql queries for file services"""
    self.session = session
    self.insert_metadata_query = "INSERT INTO metadata (stream_id, time, chunk_id) VALUES (%s, %s, %s);"
    self.insert_data_query = "INSERT INTO data (chunk_id, chunk) VALUES (%s, %s);"
    self.select_chunk_id_query = self.session.prepare("SELECT chunk_id FROM metadata WHERE stream_id = ?")
    self.select_chunk_query = self.session.prepare("SELECT chunk FROM data WHERE chunk_id = ?")


  def store_bytes(self, stream_id, data, timestamp):
    """Store the passed in file as chunks in the database
    
    Args:
        stream_id: unique identifier for a stream
        data: bytes
        timestamp: time when stored in DB
    Returns:
        None
    """
    chunk_id = str(uuid4())
    self.session.execute(self.insert_metadata_query, (stream_id, timestamp, chunk_id))
    self.session.execute(self.insert_data_query, (chunk_id, bytearray(data)))


  def retrieve_bytes(self, stream_id):
    """Retrieve the file from the database as a list of bytes with the file_id as lookup
    
    Args:
        stream_id: id for file lookup
    Returns:
        bytearray
    """
    chunk_ids = self.session.execute(self.select_chunk_id_query, (stream_id,))
    resulting_bytes = []

    for row in chunk_ids:
      result_set = self.session.execute(self.select_chunk_query, (row.chunk_id,))
      chunk_of_data = result_set[0].chunk
      resulting_bytes.extend(chunk_of_data)

    print(bytearray(resulting_bytes))
    sys.stdout.flush()

