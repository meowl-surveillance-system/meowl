class FileIterator:
  """An iterator for breaking a file into chunks

  Attributes:
      filedata: Bytes of data of file
      size: Number of bytes of filedata
      chunk_size: An int to determine the size of each individual chunk
      offset: An int used to determine the start of the next chunk
  """

  def __init__(self, filedata, chunk_size=2097152):
    """Initialize the variables needed to slice the filedata"""
    self.filedata = filedata
    self.size = len(self.filedata)
    self.chunk_size = chunk_size
    self.offset = 0

  def __iter__(self):
    return self

  def __next__(self):
    """Gets the next chunk in the iteration

    Returns:
        string
    """
    if self.offset < self.size:
      if self.size > self.offset + self.chunk_size:
        chunk = self.filedata[self.offset:self.offset + self.chunk_size]
        self.offset += self.chunk_size
      else:
          chunk = self.filedata[self.offset:self.size]
          self.offset = self.size
      return chunk
    else:
      raise StopIteration
