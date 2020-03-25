import {
  SELECT_CAMERAID_STREAMID,
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

