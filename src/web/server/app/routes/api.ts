import { spawn } from 'child_process';
import express from 'express';

import { isLoggedIn } from '../middlewares/authChecks';

import { client } from '../utils/client';
import * as apiController from '../controllers/api';

const app = express();

/**
 * Sends the video specified by streamId to response
 */
app.get(
  '/getVideo/:streamId',
  async (req: express.Request, res: express.Response) => {
    const selectChunkId = 'SELECT chunk_id FROM metadata WHERE stream_id = ?';
    const selectChunk = 'SELECT chunk FROM data WHERE chunk_id = ?';
    const ffProc = spawn('ffmpeg', [
      '-i',
      'pipe:0',
      '-codec',
      'copy',
      '-movflags',
      'frag_keyframe+empty_moov',
      '-f',
      'mp4',
      'pipe:1',
    ]);
    ffProc.stdout.pipe(res);
    ffProc.stdin.on('end', () => console.log('done'));
    ffProc.stdout.on('end', () => console.log('done'));
    ffProc.on('error', (error: Error) => console.log(error));
    const chunkIdResults = await client.execute(
      selectChunkId,
      [req.params.streamId],
      { prepare: true }
    );
    for (const chunkId of chunkIdResults.rows.map(row => row.chunk_id)) {
      const chunkResult = await client.execute(selectChunk, [chunkId], {
        prepare: true,
      });
      ffProc.stdin.write(chunkResult.rows[0].chunk);
    }
    ffProc.stdin.end();
  }
);

/**
 * Sends the streamIds specified by cameraId if logged in user owns cameraId
 */
app.get(
  '/getStreamIds/:cameraId',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    apiController.retrieveStreamIds(req, res);
  }
);

/**
 * Sends the streamId of cameraId if logged in user owns cameraId
 */
app.get(
  '/getLiveStreamId/:cameraId',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    apiController.retrieveLiveStreamId(req, res);
  }
);

/**
 * Sends a dictionary of cameraId:streamId for all cameras the logged in user owns
 */
app.get(
  '/getLiveCameraStreamIds',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    apiController.retrieveLiveCameraStreamIds(req, res);
  }
);

/**
 * Sends a list of cameraIds the logged in user owns
 */
app.get(
  '/getCameraIds',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    apiController.retrieveCameraIds(req, res);
  }
);

module.exports = app;
