import bcrypt from 'bcrypt';

import {
  INSERT_USERSID,
  INSERT_USERSNAME,
  SELECT_USERSID_USERID_PASSWORD,
  UPDATE_USERSID_SID,
  UPDATE_USERSNAME_SID,
  SELECT_USERSNAME_SID,
  SELECT_USERSNAME_USERID,
  SELECT_SID_SESSION,
} from '../utils/queries';

import { client } from '../utils/client';

/**
 * Store user information in database
 * @param userId - The userId of the user
 * @param username - The username of the user
 * @param sid - The sessionID of the user
 * @param password - The password of the user
 */
export const storeUser = (
  userId: string,
  email: string,
  username: string,
  sid: any,
  password: string
) => {
  bcrypt.hash(password, 12, (err, hash) => {
    const params = [userId, email, username, hash, sid];
    client.execute(INSERT_USERSID, params, { prepare: true });
    client.execute(INSERT_USERSNAME, params, { prepare: true });
  });
};
/**
 * Check if user exists
 * @param username - The username of the user
 */
export const checkUserExists = (
  username: string,
) => {
  return client.execute(SELECT_USERSNAME_USERID, [username], { prepare: true });
};
/**
 * Retrieve user information from database
 * @param username - The username used to lookup the user
 */
export const retrieveUser = async (username: string) => {
  return client.execute(SELECT_USERSID_USERID_PASSWORD, [username], {
    prepare: true,
  });
};

/**
 * Check if the password matches with the hash
 * @param password - The value that needs to be validated
 * @param hash - The value that is used to validate the password
 */
export const compareHash = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

/**
 * Update the sessionID of the user
 * @param sid - The sessionID
 * @param userId - The userId of the user
 * @param username - The username of the user
 */
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

/**
 * Retrieve the SessionID using the userId
 * @param userId - The value used to lookup the sessionID
 */
export const retrieveSID = async (userId: string) => {
  return client.execute(SELECT_USERSNAME_SID, [userId], { prepare: true });
};

/**
 * Retrieve the session using the sessionID
 * @param userId - The value used to lookup the sessionID
 */
export const retrieveSession = async (sessionID: string) => {
  return client.execute(SELECT_SID_SESSION, [sessionID], { prepare: true });
};
