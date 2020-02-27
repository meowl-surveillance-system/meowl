import librtmp
import threading
from datetime import datetime

class RtmpSaver:
  """Create a RTMP connection"""
  def __init__(self, ip, port, stream_id, chunk_size=2097152):
    self.stream_id = stream_id
    self.connection_string = "rtmp://{0}:{1}/view/{2}".format(ip, port, stream_id)
    self.connection = librtmp.RTMP(self.connection_string, live=True)
    self.connection.connect()
    self.stream = self.connection.create_stream()
    self.chunk_size = chunk_size
    self.bytes_read = 0
    self.previous_read = 0
    self.data = b''
    self.is_reading = True

  def start(self, file_service):
    self.is_reading_lock = threading.Lock()
    self.read_thread = threading.Thread(target=self._read, args=(file_service,))
    self.read_thread.start()

  def _read(self, file_service):
    """Continuously read (chunk_size)MB chunks from RTMP server"""
    self.is_reading_lock.acquire()
    while self.is_reading:
      self.is_reading_lock.release()
      self.data += self.stream.read(self.chunk_size)
      self.bytes_read = len(self.data)

      if self._is_last_chunk(self.bytes_read, self.previous_read):
        file_service.store_bytes(self.stream_id, self.data[:self.bytes_read], datetime.now())
        self.data = self.data[self.bytes_read:]

      elif self.bytes_read >= self.chunk_size:
        file_service.store_bytes(self.stream_id, self.data[:self.chunk_size], datetime.now())
        self.data = self.data[self.chunk_size:]

      self.previous_read = self.bytes_read
      
      self.is_reading_lock.acquire()

    # Store any leftover data
    if len(self.data) != 0:
      file_service.store_bytes(self.stream_id, self.data, datetime.now())

    self.is_reading_lock.release()

  def stop(self):
    """Stop reading from stream"""
    self.is_reading_lock.acquire()
    self.is_reading = False
    self.is_reading_lock.release()
    self.read_thread.join()

  def _is_last_chunk(self, bytes_read, previous_read):
    """Check if the last chunk is received"""
    return bytes_read == previous_read and bytes_read != 0
