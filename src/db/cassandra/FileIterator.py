class FileIterator:
  def __init__(self, filedata, chunk_size=2097152):
    self.filedata = filedata
    self.size = len(self.filedata)
    self.chunk_size = chunk_size
    self.offset = 0

  def __iter__(self):
    return self

  def __next__(self):
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
