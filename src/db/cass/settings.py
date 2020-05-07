import os
from getpass import getpass
from urllib.parse import urljoin

try:
  RTMP_IP = os.environ['STUNNEL_IP']
  RTMP_PORT = int(os.environ['STUNNEL_PORT'])
except KeyError:
  raise KeyError('STUNNEL_IP or STUNNEL_PORT is not defined in the environment')

try:
  LOGIN_URL = os.environ['AUTH_SERVER_URL'] + '/auth/login'
  RTMP_REQUEST_URL = os.environ['AUTH_SERVER_URL'] + '/auth/rtmpRequest'
  print(LOGIN_URL, RTMP_REQUEST_URL)
except KeyError:
  raise KeyError('AUTH_SERVER_URL is not defined in the environment')

USERNAME = os.environ.get("ADMIN_USERNAME")
if USERNAME is None :
    USERNAME = input("Username: ")
PASSWORD = os.environ.get("ADMIN_PASSWORD")
if PASSWORD is None :
    PASSWORD = getpass()
EMAIL = os.environ.get("ADMIN_EMAIL")
if EMAIL is None:
  EMAIL = input("Enter admin email: ")

try:
  CASSANDRA_CLUSTER_IPS = os.environ['CASSANDRA_CLUSTER_IPS'].split(' ')
except KeyError:
  raise KeyError('CASSANDRA_CLUSTER_IPS is not defined in the environment')

try:
  CASSANDRA_CLUSTER_PORT = int(os.environ['CASSANDRA_CLUSTER_PORT'])
except KeyError:
  raise KeyError('CASSANDRA_CLUSTER_PORT is not defined in the environment')
