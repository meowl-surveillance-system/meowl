from uuid import uuid4

class FileServices:
  """A class used for making video file queries
  
  Attributes:
      session: The Cassandra cluster session for execution of queries
      insert_metadata_query: Insert the stream ID, timestamp and chunk ID into the metadata table
      insert_data_query: Insert the chunk of data into the data table
  """

  def __init__(self, session):
    """Initlialize a Cassandra cluster session and prepare cql queries for file services"""
    self.session = session
    self.insert_metadata_query = "INSERT INTO metadata (stream_id, chunk_order, chunk_id) VALUES (%s, %s, %s);"
    self.insert_data_query = "INSERT INTO data (chunk_id, chunk) VALUES (%s, %s);"


  def store_bytes(self, stream_id, data, timestamp):
    """Store the passed in file as chunks in the database
    
    Args:
        stream_id: unique identifier for a stream
        data: content to be stored
        timestamp: time when stored in DB
    Returns:
        None
    """
    chunk_id = str(uuid4())
    self.session.execute(self.insert_metadata_query, (stream_id, timestamp, chunk_id))
    self.session.execute(self.insert_data_query, (chunk_id, bytearray(data)))

