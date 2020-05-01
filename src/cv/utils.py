import json
import requests
import urllib

def get_auth_RTMP_url(
  rtmpUrl,
  loginUrl,
  rtmpRequestUrl,
  username,
  password):
  """Authenticate to loginUrl, append authorization parameters to rtmpUrl"""
  print(username, password)
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