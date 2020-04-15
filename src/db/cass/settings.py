import os
from getpass import getpass

RTMP_IP = "localhost"
RTMP_PORT = 1234
LOGIN_URL = "http://localhost:3000/auth/login"
RTMP_REQUEST_URL = "http://localhost:3000/auth/rtmpRequest"
USERNAME = os.environ.get("MEOWL_USERNAME")
if USERNAME is None :
    USERNAME = input("Username: ")
PASSWORD = os.environ.get("MEOWL_PASSWORD")
if PASSWORD is None :
    PASSWORD = getpass()
