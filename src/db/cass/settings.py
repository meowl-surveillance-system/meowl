import os

RTMP_IP = "localhost"
RTMP_PORT = 1234
LOGIN_URL = "http://localhost:3000/auth/login"
RTMP_REQUEST_URL = "http://localhost:3000/auth/rtmpRequest"

try:
  CASSANDRA_CLUSTER_IPS = os.environ['CASSANDRA_CLUSTER_IPS'].split(' ')
except KeyError:
  raise KeyError('CASSANDRA_CLUSTER_IPS is not defined in environment variable')

try:
  CASSANDRA_CLUSTER_PORT = int(os.environ['CASSANDRA_CLUSTER_PORT'])
except KeyError:
  raise KeyError('CASSANDRA_CLUSTER_PORT is not defined in environment variable')
