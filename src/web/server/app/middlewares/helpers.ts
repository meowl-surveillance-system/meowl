import { client } from '../utils/client';
import { SELECT_USERSNAME_USERID } from '../utils/queries';

export async function isCollideHelper(username: string) {
  const result = await client.execute(SELECT_USERSNAME_USERID, [username], {
    prepare: true,
  });
  return result.rows.length !== 0;
}
