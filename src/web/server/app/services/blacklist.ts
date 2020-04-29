import { SELECT_BLACKLIST } from '../utils/queries';
import { client } from '../utils/client';

/**
 * Retrieve all blacklist from database
 * @returns ResultSet - Contains rows of notifications belonging to owner
 */
export const retrieveBlacklist = async () => {
  return client.execute(SELECT_BLACKLIST, {
    prepare: true,
  });
};

