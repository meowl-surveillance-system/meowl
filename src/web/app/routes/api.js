"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const express_1 = __importDefault(require("express"));
const authChecks_1 = require("../middlewares/authChecks");
const client_1 = require("../utils/client");
const apiController = __importStar(require("../controllers/api"));
const app = express_1.default();
/**
 * Sends the video specified by streamId to response
 */
app.get('/getVideo/:streamId', async (req, res) => {
    const selectChunkId = 'SELECT chunk_id FROM metadata WHERE stream_id = ?';
    const selectChunk = 'SELECT chunk FROM data WHERE chunk_id = ?';
    const ffProc = child_process_1.spawn('ffmpeg', [
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
    ffProc.on('error', (error) => console.log(error));
    const chunkIdResults = await client_1.client.execute(selectChunkId, [req.params.streamId], { prepare: true });
    for (const chunkId of chunkIdResults.rows.map(row => row.chunk_id)) {
        const chunkResult = await client_1.client.execute(selectChunk, [chunkId], {
            prepare: true,
        });
        ffProc.stdin.write(chunkResult.rows[0].chunk);
    }
    ffProc.stdin.end();
});
/**
 * Sends the streamIds specified by cameraId if logged in user owns cameraId
 */
app.get('/getStreamIds/:cameraId', authChecks_1.isLoggedIn, async (req, res) => {
    apiController.retrieveStreamIds(req, res);
});
/**
 * Sends the streamId of cameraId if logged in user owns cameraId
 */
app.get('/getLiveStreamId/:cameraId', authChecks_1.isLoggedIn, async (req, res) => {
    apiController.retrieveLiveStreamId(req, res);
});
/**
 * Sends a dictionary of cameraId:streamId for all cameras the logged in user owns
 */
app.get('/getLiveCameraStreamIds', authChecks_1.isLoggedIn, async (req, res) => {
    apiController.retrieveLiveCameraStreamIds(req, res);
});
/**
 * Sends a list of cameraIds the logged in user owns
 */
app.get('/getCameraIds', authChecks_1.isLoggedIn, async (req, res) => {
    apiController.retrieveCameraIds(req, res);
});
module.exports = app;
//# sourceMappingURL=api.js.map