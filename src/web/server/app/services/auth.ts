import bcrypt from 'bcrypt';

import {
  INSERT_USERSID,
  INSERT_USERSNAME,
  SELECT_USERSID_USERID_PASSWORD,
  UPDATE_USERSID_SID,
  UPDATE_USERSNAME_SID,
  SELECT_USERSNAME_SID,
} from '../utils/queries';

import { client } from '../utils/client';

export const storeUser = (
  userId: string,
  username: string,
  sid: any,
  password: string
) => {
  bcrypt.hash(password, 12, (err, hash) => {
    const params = [userId, username, hash, sid];
    client.execute(INSERT_USERSID, params, { prepare: true });
    client.execute(INSERT_USERSNAME, params, { prepare: true });
  });
};

export const retrieveUser = async (username: string) => {
  return client.execute(SELECT_USERSID_USERID_PASSWORD, [username], {
    prepare: true,
  });
};

export const compareHash = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const updateSessionId = async (
  sid: any,
  userId: string,
  username: string
) => {
  await client.execute(UPDATE_USERSID_SID, [sid, userId], { prepare: true });
  await client.execute(UPDATE_USERSNAME_SID, [sid, username], {
    prepare: true,
  });
};

export const retrieveSID = async (userId: string) => {
  return client.execute(SELECT_USERSNAME_SID, [userId], { prepare: true });
};
