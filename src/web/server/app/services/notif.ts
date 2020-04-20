import { SELECT_NOTIFICATIONS } from '../utils/queries';
import { client } from '../utils/client';

/**
 * Retrieve all notifications from database
 * @returns ResultSet - Contains rows of notifications belonging to owner
 */
export const retrieveNotif = async () => {
    return client.execute(SELECT_NOTIFICATIONS, {
      prepare: true,
    });
  };