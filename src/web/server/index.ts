// TODO: Set up the application so that cors is only used for development
import cors from 'cors';
import express from 'express';
const cassandra = require('cassandra')


const app = express();
const port = process.env.PORT || 8081;

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'streams'
});

// TODO: Set up the app so that cors is only used for development
app.use(cors());
app.get('/', function(req, res) {
  res.send('Hello World!');
});

// TODO(Akasora39): Fix the buffer stream
app.get('/api/getVideo/:streamId', function(req, res) {
 const selectChunkId = 'SELECT chunk_id FROM metadata WHERE stream_id = ?';
 client.execute(selectChunkId, [ req.params.streamId ])
   .then(result => console.log(result.rows[0]))
})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
});