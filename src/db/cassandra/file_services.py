from cassandra.cluster import Cluster
from file_iterator import FileIterator
from hashlib import md5
from uuid import uuid4

class FileServices:
  """A class used for making video file queries
  
  Attributes:
      session: The Cassandra cluster session for execution of queries
      insert_files_query: Insert the file hash, chunk order and chunk ID into the files table
      insert_files_data_query: Insert the chunk of data into the files_data table
      select_file_query: Select the chunk IDs of the passed in file hash
      select_chunk_query: Select the chunks of data based on the Chunk IDs
  """

  def __init__(self, session):
    """Initlialize a Cassandra cluster session and prepare cql queries for file services"""
    self.session = session
    self.insert_files_query = "INSERT INTO files (file_id, chunk_order, chunk_id) VALUES (%s, %s, %s);"
    self.insert_files_data_query = "INSERT INTO files_data (chunk_id, chunk) VALUES (%s, %s);"
    self.select_file_query = self.session.prepare("SELECT chunk_id FROM files WHERE file_id = ?")
    self.select_chunk_query = self.session.prepare("SELECT chunk FROM files_data WHERE chunk_id = ?")


  def store_file(self, filename):
    """Store the passed in file as chunks in the database
    
    Args:
        filename: string
    Returns:
        None
    """
    filedata = self.get_bytes_from_file(filename)
    iterator = FileIterator(filedata)
    file_id = self.get_hash_of_filedata(filedata)
    chunk_order = 0

    for chunk in iterator:
      chunk_id = str(uuid4())
      self.session.execute(self.insert_files_query, (file_id, chunk_order, chunk_id))
      self.session.execute(self.insert_files_data_query, (chunk_id, bytearray(chunk)))
      chunk_order += 1


  def retrieve_file_bytes(self, file_id):
    """Retrieve the file from the database as a list of bytes with the file_id as lookup
    
    Args:
        filename: string
    Returns:
        bytearray
    """
    chunk_ids = self.session.execute(self.select_file_query, (file_id,))
    resulting_file = []

    for row in chunk_ids:
      result_set = self.session.execute(self.select_chunk_query, (row.chunk_id,))
      chunk_of_data = result_set[0].chunk
      resulting_file.extend(chunk_of_data)

    return bytearray(resulting_file)


  def get_bytes_from_file(self, filename):
    return open(filename, 'rb').read()


  def get_hash_of_filedata(self, filedata):
    return md5(filedata).hexdigest()
