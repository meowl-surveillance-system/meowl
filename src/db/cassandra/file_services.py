from cassandra.cluster import Cluster
from file_iterator import FileIterator
from hashlib import md5
from uuid import uuid4

class FileServices:
  
  def __init__(self, session):
    self.session = session
    self.insert_files_query = "INSERT INTO files (file_id, chunk_order, chunk_id) VALUES (%s, %s, %s);"
    self.insert_files_data_query = "INSERT INTO files_data (chunk_id, chunk) VALUES (%s, %s);"
    self.select_file = self.session.prepare("SELECT chunk_id FROM files WHERE file_id = ?")
    self.select_chunk = self.session.prepare("SELECT chunk FROM files_data WHERE chunk_id = ?")


  def store_file(self, filename):
    filedata = self.get_bytes_from_file(filename)
    iterator = FileIterator(filedata)
    file_id = self.get_hash_of_filedata(filedata)
    chunk_order = 0

    for chunk in iterator:
      chunk_id = str(uuid4())
      self.session.execute(self.insert_files_query, (file_id, chunk_order, chunk_id))
      self.session.execute(self.insert_files_data_query, (chunk_id, bytearray(chunk)))
      chunk_order += 1


  def retrieve_file(self, filename):
    filedata = self.get_bytes_from_file(filename)
    file_id = self.get_hash_of_filedata(filedata) 
    chunk_ids = self.session.execute(self.select_file, (file_id,))
    resulting_file = []
    for row in chunk_ids:
      result_set = self.session.execute(self.select_chunk, (row.chunk_id,))
      chunk_of_data = result_set[0].chunk
      # combine each chunk
      resulting_file.extend(chunk_of_data)
    # return combined chunks
    return resulting_file

  def get_bytes_from_file(self, filename):
    return open(filename, 'rb').read()


  def get_hash_of_filedata(self, filedata):
    return md5(filedata).hexdigest()
