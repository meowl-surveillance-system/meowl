import {
  SELECT_CAMERAID,
  SELECT_CAMERAID_STREAMID,
  INSERT_CAMERAID_STREAMID,
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
 * Store streamId in database
 * @param cameraId - The cameraId of the camera that streamed
 * @param streamId - The streamId
 */
export const storeStreamId = async (cameraId: string, streamId: string) => {
  const params = [cameraId, streamId, Date.now()];
  await client.execute(INSERT_CAMERAID_STREAMID, params, { prepare: true });
};

/**
 * Retrieve cameraIds from database
 */
export const retrieveCameraIds = async () => {
  return client.execute(SELECT_CAMERAID, [], {
    prepare: true,
  });
};
