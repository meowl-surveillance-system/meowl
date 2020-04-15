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
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const authServices = __importStar(require("../services/auth"));
const apiServices = __importStar(require("../services/api"));
/**
 * Sends 200 if session of user contains its userId, 400 otherwise
 */
exports.isLoggedIn = (req, res) => {
    if (req.session.userId) {
        res.status(200).json(true);
    }
    else {
        res.status(400).json(false);
    }
};
/**
 * Stores a user's credentials if username does not exist
 */
exports.register = async (req, res) => {
    const { email, username, password } = req.body;
    const sid = req.sessionID;
    const userId = uuid_1.v4();
    const userExistsResult = await authServices.checkUserExists(username);
    if (userExistsResult === undefined) {
        res.status(500).send('server error');
    }
    else {
        if (userExistsResult.rows.length > 0) {
            res.status(400).send('username already exists');
        }
        else {
            await authServices.storeUser(userId, email, username, sid, password);
            req.session.userId = userId;
            res.status(200).send('successfully registered');
        }
    }
};
/**
 * Checks if username and hashed password from body are valid and updates session to contain userId if so
 */
exports.login = async (req, res) => {
    const { username, password } = req.body;
    const sid = req.sessionID;
    try {
        const result = await authServices.retrieveUser(username);
        const credentials = result.rows[0];
        if (credentials === undefined) {
            res.status(400).send('Invalid username or password');
        }
        else {
            const match = await authServices.compareHash(password, credentials.password);
            if (match) {
                await authServices.updateSessionId(sid, credentials.user_id, username);
                req.session.userId = credentials.user_id;
                res.status(200).send('successfully logged in');
            }
            else {
                res.status(400).send('Invalid username or password');
            }
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};
/**
 * Destroys session
 */
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        else {
            res.status(200).send('logged out');
        }
    });
};
/**
 * Sends sessionID and userID of active session in response
 */
exports.rtmpRequest = (req, res) => {
    res
        .status(200)
        .json({ sessionID: req.sessionID, userId: req.session.userId });
};
/**
 * Sends 200 if userId and sessionID in body of request match and session is still valid, 400 otherwise
 */
exports.rtmpAuthPlay = async (req, res) => {
    try {
        const result = await authServices.retrieveSID(req.body.userId);
        if (result.rows.length === 0 || result.rows[0].sid !== req.body.sessionID) {
            res.status(400).send('Nice try kid');
        }
        else {
            res.status(200).send('OK');
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};
/**
 * Handles authorization of rtmp stream publishing requests
 * Assigns userId to cameraId, stores streamId to cameraId, updates that cameraId is live,
 * and makes api request to rtmp saver to start or stop saving.
 * Only stores if userId and sessionID in body of request match, cameraId is assigned to userId or no one.
 * @param start true to indicate if this request is the start of the stream, false to indicate streaming has stopped
 */
const rtmpAuthPublish = async (req, res, start) => {
    try {
        const result = await authServices.retrieveSession(req.body.sessionID);
        if (result.rows.length === 0 ||
            JSON.parse(result.rows[0].session).userId !== req.body.userId ||
            result.rows[0].expires < Date.now()) {
            res.status(400).send('Nice try kid');
        }
        else {
            const canStream = await apiServices.verifyUserCamera(req.body.userId, req.body.cameraId);
            if (canStream) {
                await apiServices.addUserCamera(req.body.userId, req.body.cameraId);
                await apiServices.storeStreamId(req.body.cameraId, req.body.name);
                await apiServices.updateCameraLive(req.body.cameraId, start);
                const saverUrl = 'http://localhost:5000/' +
                    (start ? 'store/' : 'stop/') +
                    req.body.name;
                const saverResponse = await axios_1.default.get(saverUrl);
                if (saverResponse.status === 200) {
                    res.status(200).send('OK');
                }
                else {
                    res.status(500).send('Server error');
                }
            }
            else {
                res.status(400).send('Nice try dude');
            }
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};
/**
 * Calls rtmpAuthPublish with true when streaming starts
 */
exports.rtmpAuthPublishStart = async (req, res) => {
    await rtmpAuthPublish(req, res, true);
};
/**
 * Calls rtmpAuthPublish with false when streaming stops
 */
exports.rtmpAuthPublishStop = async (req, res) => {
    await rtmpAuthPublish(req, res, false);
};
//# sourceMappingURL=auth.js.map