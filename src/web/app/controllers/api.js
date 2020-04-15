"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiServices = __importStar(require("../services/api"));
/**
 * Sends a list of streamIds for a cameraId if the user owns the camera
 */
exports.retrieveStreamIds = async (req, res) => {
    const canView = await apiServices.verifyUserCamera(req.session.userId, req.params.cameraId);
    if (canView) {
        const cameraId = req.params.cameraId;
        const result = await apiServices.retrieveStreamIds(cameraId);
        if (result === undefined) {
            res.status(400).send('Invalid cameraId');
        }
        else {
            const streamIds = result.rows.map(row => {
                const key = Object.keys(row)[0];
                return row[key];
            });
            console.log(streamIds);
            res.status(200).json(streamIds);
        }
    }
    else {
        res.status(400).send('Cant view this camera');
    }
};
/**
 * Sends the streamId of a camera if it is live
 */
exports.retrieveLiveStreamId = async (req, res) => {
    const cameraId = req.params.cameraId;
    const result = await apiServices.retrieveLiveStreamId(cameraId);
    if (result === undefined) {
        res.status(400).send('Invalid cameraId');
    }
    else {
        const key = Object.keys(result.rows[0])[0];
        const streamId = result.rows[0][key];
        res.status(200).json(streamId);
    }
};
/**
 * Sends a dictionary of cameraId : streamId for all cameras the user owns that are live
 */
exports.retrieveLiveCameraStreamIds = async (req, res) => {
    const result = await apiServices.retrieveLiveCameraStreamIds(req.session.userId);
    if (result === undefined) {
        res.status(400).send('Unable to retrieve camera streams');
    }
    else {
        res.status(200).json(result);
    }
};
/**
 * Stores a streamId to respective cameraId from body of request
 */
exports.storeStreamId = async (req, res) => {
    const { cameraId, streamId } = req.body;
    try {
        await apiServices.storeStreamId(cameraId, streamId);
        res.status(200).send('OK');
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};
/**
 * Sends a list of cameraIds the user owns
 */
exports.retrieveCameraIds = async (req, res) => {
    const result = await apiServices.retrieveCameraIds(req.session.userId);
    if (result === undefined) {
        res.status(400).send('Can not retrieve cameras');
    }
    else {
        const cameraIds = result.rows.map(row => {
            const key = Object.keys(row)[0];
            return row[key];
        });
        console.log(cameraIds);
        res.status(200).send(cameraIds);
    }
};
//# sourceMappingURL=api.js.map