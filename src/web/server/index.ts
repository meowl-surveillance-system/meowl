// TODO: Set up the application so that cors is only used for development
import cors from 'cors';
import express from 'express';
const cassandra = require('cassandra-driver');


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
app.get('/api/getVideo/:streamId', async function(req, res) {
 const selectChunkId = 'SELECT chunk_id FROM metadata WHERE stream_id = ?';
 const selectChunk = "SELECT chunk FROM data WHERE chunk_id = ?";
 const chunkIdResults = await client.execute(selectChunkId, [ req.params.streamId ]);
 for(let chunkId of chunkIdResults.rows.map(row => row.chunk_id)){
  const chunkResult = await client.execute(selectChunk, [chunkId], { prepare: true });
  res.write(chunkResult.rows[0].chunk);
 }
 res.end();
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
});