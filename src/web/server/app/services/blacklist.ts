import { INSERT_BLACKLIST } from '../utils/queries';
import { client } from '../utils/client';

/**
 * Retrieve all blacklist from database
 * @returns ResultSet - Contains rows of notifications belonging to owner
 */
export const insertBlacklist = async (name: string) => {
  return client.execute(INSERT_BLACKLIST, [name], {
    prepare: true,
  });
};

