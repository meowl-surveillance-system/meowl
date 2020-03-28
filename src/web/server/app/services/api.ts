import {
  SELECT_CAMERAID,
  SELECT_USERID_CAMERAID,
  SELECT_LIVE_CAMERAID,
  SELECT_CAMERAID_STREAMID,
  SELECT_CAMERAID_STREAMID_SINGLE,
  INSERT_CAMERAID_STREAMID,
  INSERT_USERID_CAMERAID,
  INSERT_CAMERAID_USERID,
  INSERT_CAMERAID_LIVE,
} from '../utils/queries';

import { client } from '../utils/client';

/**
 * Retrieve streamIds from database
 * @param cameraId - The cameraId that spawned the streamIds
 */
export const retrieveStreamIds = async (cameraId: string) => {
  return client.execute(SELECT_CAMERAID_STREAMID, [cameraId], {
    prepare: true,
  });
};

/**
 * Retrieve streamId from camera if live from database
 * @param cameraId - The cameraId that may be live
 */
export const retrieveLiveStreamId = async (cameraId: string) => {
  const result = await client.execute(SELECT_LIVE_CAMERAID, [cameraId], {
    prepare: true,
  });
  if (result.rows.length === 0 || result.rows[0]['live'] !== true) {
    return undefined;
  }

  return client.execute(SELECT_CAMERAID_STREAMID_SINGLE, [cameraId], {
    prepare: true,
  });
};

/**
 * Store streamId in database
 * @param cameraId - The cameraId of the camera that streamed
 * @param streamId - The streamId
 */
export const storeStreamId = async (cameraId: string, streamId: string) => {
  const params = [cameraId, streamId, Date.now()];
  await client.execute(INSERT_CAMERAID_STREAMID, params, { prepare: true });
};

/**
 * Update if camera is live in database
 * @param cameraId - The cameraId of the camera that streamed
 * @param live - Whether the camera started or stopped streaming
 */
export const updateCameraLive = async (cameraId: string, live: boolean) => {
  const params = [cameraId, live];
  await client.execute(INSERT_CAMERAID_LIVE, params, { prepare: true });
};

/**
 * Verify camera belongs to user and assign if not belonged to anyone
 * @param cameraId - The cameraId of the camera that streamed
 * @param userId - The user id of the user that started streaming
 */
export const verifyUserCamera = async (userId: string, cameraId: string) => {
  const result = await client.execute(SELECT_USERID_CAMERAID, [cameraId], { prepare: true });
  if (result.rows.length === 0) {
    const params = [userId, cameraId];
    await client.execute(INSERT_USERID_CAMERAID, params, { prepare: true });
    await client.execute(INSERT_CAMERAID_USERID, params, { prepare: true });
    return true;
  } else {
    return result.rows[0]['user_id'] === userId;
  }
};

/**
 * Retrieve cameraIds from database
 */
export const retrieveCameraIds = async () => {
  return client.execute(SELECT_CAMERAID, [], {
    prepare: true,
  });
};
