from cassandra.cluster import Cluster
from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def index():
	return "Hello World"

@app.route('/playback', methods=['GET'])
def playback():
	timestamp_start = request.args.get('timestamp_start')
	timestamp_end = request.args.get('timestamp_end')
	stream_id = request.args.get('stream_id')
	
	session = Cluster().connect()
	prepared = session.prepare("sql what")
	result = session.execute(prepared, ('local',))
	
	# Convert the result to hls
	return result	


