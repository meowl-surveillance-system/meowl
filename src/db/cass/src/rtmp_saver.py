import json
import librtmp
import requests
import threading
import urllib
from datetime import datetime
import sys


class RtmpSaver:
  """Create a RTMP connection"""

  def __init__(self, ip, port, stream_id, auth_options, chunk_size=2097152):
    """Create a rtmp url using parameters, then connect to rtmp url"""
    self.stream_id = stream_id
    # Create a rtmp url using ip, port, and stream_id
    connection_string = "rtmp://{0}:{1}/view/{2}".format(ip, port, stream_id)
    # Add authorization parameters to connection string
    self.connection_string = self._auth_RTMP(
      connection_string,
      auth_options["loginUrl"],
      auth_options["rtmpRequestUrl"],
      auth_options["username"],
      auth_options["password"])
    # Create a stream connection to rtmp url
    self.connection = librtmp.RTMP(self.connection_string, live=True)
    self.connection.connect()
    self.stream = self.connection.create_stream()
    self.chunk_size = chunk_size
    self.bytes_read = 0
    self.previous_read = 0
    self.data = b''
    self.is_reading = True

  def start(self, file_service):
    """Create a thread and start reading the stream"""
    self.is_reading_lock = threading.Lock()
    self.read_thread = threading.Thread(
      target=self._read, args=(file_service,))
    self.read_thread.start()

  def _read(self, file_service):
    """Continuously read (chunk_size)MB chunks from RTMP server"""
    self.is_reading_lock.acquire()
    while self.is_reading:
      self.is_reading_lock.release()
      self.data += self.stream.read(self.chunk_size)
      self.bytes_read = len(self.data)

      if self._is_last_chunk(self.bytes_read, self.previous_read):
        file_service.store_bytes(
          self.stream_id, self.data[:self.bytes_read], datetime.now())
        self.data = self.data[self.bytes_read:]

      elif self.bytes_read >= self.chunk_size:
        file_service.store_bytes(
          self.stream_id, self.data[:self.chunk_size], datetime.now())
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

  def _auth_RTMP(
    self,
    rtmpUrl,
    loginUrl,
    rtmpRequestUrl,
    username,
    password):
    """Authenticate to loginUrl, append authorization parameters to rtmpUrl"""

    body = {"username": username, "password": password}
    loginResponse = requests.post(loginUrl, data=body)
    if not loginResponse.ok:
      raise Exception(f"Auth server response not ok : {loginResponse.text}")
    connectsidCookie = {
      "connect.sid": loginResponse.cookies["connect.sid"]}
    rtmpRequestResponse = requests.post(
      rtmpRequestUrl, cookies=connectsidCookie)
    if not rtmpRequestResponse.ok:
      raise Exception(f"Auth server response not ok : {rtmpRequestResponse.text}")
    rtmpCreds = json.loads(rtmpRequestResponse.text)
    return rtmpUrl + "?" + urllib.parse.urlencode(rtmpCreds)
