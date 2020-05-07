import { SELECT_NOTIFICATIONS, SELECT_FRAME } from '../utils/queries';
import { client } from '../utils/client';

/**
 * Retrieve all notifications from database
 * @returns ResultSet - Contains rows of notifications belonging to owner
 */
export const retrieveNotif = async () => {
  return client.execute(SELECT_NOTIFICATIONS, [], {
    prepare: true,
  });
};

/**
 * Retrieve frame associated with notification from database
 * @returns ResultSet - Contains row of frame blob belonging to notification
 */
export const retrieveFrame = async (frameId: string, streamId: string) => {
  return client.execute(SELECT_FRAME, [frameId, streamId], {
    prepare: true,
  });
};
