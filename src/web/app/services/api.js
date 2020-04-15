"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queries_1 = require("../utils/queries");
const client_1 = require("../utils/client");
/**
 * Retrieve streamIds from database
 * @param cameraId - The cameraId that spawned the streamIds
 * @returns ResultSet - Contains rows of streamIds belonging to cameraId
 */
exports.retrieveStreamIds = async (cameraId) => {
    return client_1.client.execute(queries_1.SELECT_CAMERAID_STREAMID, [cameraId], {
        prepare: true,
    });
};
/**
 * Retrieve streamId from camera if live from database
 * @param cameraId - The cameraId that may be live
 * @returns ResultSet - Contains row of streamId belonging to cameraId, undefined if camera not live
 */
exports.retrieveLiveStreamId = async (cameraId) => {
    const result = await client_1.client.execute(queries_1.SELECT_LIVE_CAMERAID, [cameraId], {
        prepare: true,
    });
    if (result.rows.length === 0 || result.rows[0]['live'] !== true) {
        return undefined;
    }
    return client_1.client.execute(queries_1.SELECT_CAMERAID_STREAMID_SINGLE, [cameraId], {
        prepare: true,
    });
};
/**
 * Retrieve all streamId from camera if live belonging to user
 * @param userId - userId of user
 * @returns Record<string, string> - Contains mapping of streamId belonging to cameraId, undefined if user does not own cameras
 */
exports.retrieveLiveCameraStreamIds = async (userId) => {
    const camerasResult = await exports.retrieveCameraIds(userId);
    if (camerasResult === undefined || camerasResult.rows.length === 0) {
        return undefined;
    }
    const liveCameras = camerasResult.rows.reduce(async (oldCollection, row) => {
        const collection = await oldCollection;
        const liveStreamIdResult = await exports.retrieveLiveStreamId(row['camera_id']);
        if (liveStreamIdResult !== undefined &&
            liveStreamIdResult.rows.length > 0) {
            collection[row['camera_id']] = liveStreamIdResult.rows[0]['stream_id'];
        }
        return collection;
    }, new Promise((resolve, reject) => resolve({})));
    return liveCameras;
};
/**
 * Store streamId in database
 * @param cameraId - The cameraId of the camera that streamed
 * @param streamId - The streamId
 */
exports.storeStreamId = async (cameraId, streamId) => {
    const params = [cameraId, streamId, Date.now()];
    const result = await client_1.client.execute(queries_1.SELECT_CAMERAID_STREAMID, [cameraId], {
        prepare: true,
    });
    if (!result.rows.some(element => element['stream_id'] === streamId)) {
        await client_1.client.execute(queries_1.INSERT_CAMERAID_STREAMID, params, { prepare: true });
    }
};
/**
 * Update if camera is live in database
 * @param cameraId - The cameraId of the camera that streamed
 * @param live - Whether the camera started or stopped streaming
 */
exports.updateCameraLive = async (cameraId, live) => {
    const params = [cameraId, live];
    await client_1.client.execute(queries_1.INSERT_CAMERAID_LIVE, params, { prepare: true });
};
/**
 * Verify camera belongs to user
 * @param cameraId - The cameraId of the camera
 * @param userId - The user id of the user
 * @returns boolean - True if userId owns cameraId
 */
exports.verifyUserCamera = async (userId, cameraId) => {
    const result = await client_1.client.execute(queries_1.SELECT_USERID_CAMERAID, [cameraId], {
        prepare: true,
    });
    if (result.rows.length === 0) {
        return true;
    }
    else {
        return result.rows[0]['user_id'] === userId;
    }
};
/**
 * Assign camera to user
 * @param cameraId - The cameraId of the camera
 * @param userId - The user id of the user
 */
exports.addUserCamera = async (userId, cameraId) => {
    const params = [userId, cameraId];
    await client_1.client.execute(queries_1.INSERT_USERID_CAMERAID, params, { prepare: true });
    await client_1.client.execute(queries_1.INSERT_CAMERAID_USERID, params, { prepare: true });
};
/**
 * Retrieve cameraIds from database that belong to user
 * @param userId - The user id of the user
 * @returns ResultSet - Contains rows of cameraIds belonging to userId
 */
exports.retrieveCameraIds = async (userId) => {
    return client_1.client.execute(queries_1.SELECT_CAMERAID_USERID, [userId], {
        prepare: true,
    });
};
//# sourceMappingURL=api.js.map