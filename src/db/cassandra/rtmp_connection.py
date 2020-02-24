import librtmp

class RtmpConnection:
  """Create a RTMP connection"""
  def __init__(self, rtmp_ip, stream_id, chunk_size=2097152):
    self.rtmp_ip = rtmp_ip
    self.stream_id = stream_id
    self.connection = librtmp.RTMP(self.rtmp_ip, live=True)
    self.stream = connection.create_stream()
    self.chunk_size = chunk_size
    self.bytes_read = 0
    self.previous_read = 0
    self.data = b''

  def read(self, file_service):
    """Continuously read (chunk_size)MB chunks from RTMP server"""
    while True:
      self.data += self.stream.read(self.chunk_size)
      self.bytes_read = len(self.data)

      if self.is_last_chunk(self.bytes_read, self.previous_read):
        file_service.store_bytes(self.stream_id, self.data[:self.bytes_read], datetime.now())
        self.data = self.data[self.bytes_read:]

      elif self.bytes_read >= self.chunk_size:
        file_service.store_bytes(self.stream_id, self.data[:self.chunk_size], datetime.now())
        self.data = self.data[self.chunk_size:]

      self.previous_read = self.bytes_read

  def is_last_chunk(self, bytes_read, previous_read):
    """Check if the last chunk is received"""
    return bytes_read == previous_read and bytes_read != 0
