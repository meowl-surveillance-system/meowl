import {spawn} from 'child_process';
import express from 'express';

import {client} from '../utils/client';

const app = express();

app.get('/getVideo/:streamId', async (req, res) => {
  const selectChunkId = 'SELECT chunk_id FROM metadata WHERE stream_id = ?';
  const selectChunk = 'SELECT chunk FROM data WHERE chunk_id = ?';
  const ffProc = spawn('ffmpeg', [
    '-i', 'pipe:0', '-codec', 'copy', '-movflags', 'frag_keyframe+empty_moov',
    '-f', 'mp4', 'pipe:1'
  ]);
  ffProc.stdout.pipe(res);
  ffProc.stdin.on('end', () => console.log('done'));
  ffProc.stdout.on('end', () => console.log('done'));
  ffProc.on('error', (error: Error) => console.log(error));
  const chunkIdResults =
      await client.execute(selectChunkId, [req.params.streamId]);
  for (const chunkId of chunkIdResults.rows.map(row => row.chunk_id)) {
    const chunkResult =
        await client.execute(selectChunk, [chunkId], {prepare: true});
    ffProc.stdin.write(chunkResult.rows[0].chunk);
  }
  ffProc.stdin.end();
});

module.exports = app;
