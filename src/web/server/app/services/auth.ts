import bcrypt from 'bcrypt';

import {
  INSERT_USERSID,
  INSERT_USERSNAME,
  INSERT_PENDINGACCOUNTS,
  INSERT_PASSWORDRESETTOKENS,
  SELECT_PASSWORDRESETTOKENS,
  SELECT_USERSID_USERID_PASSWORD_ADMIN,
  SELECT_USERSNAME_USERID_EMAIL,
  UPDATE_USERSID_SID,
  UPDATE_USERSNAME_SID,
  SELECT_USERSNAME_SID,
  SELECT_USERSNAME_USERID,
  SELECT_PENDINGACCOUNTS_USERID,
  SELECT_SID_SESSION,
  SELECT_PENDINGACCOUNTS_ALL,
  DELETE_PENDINGACCOUNTS_ALL,
  SELECT_PENDINGACCOUNTS,
  SELECT_PASSWORDRESETTOKENS_USERID,
  UPDATE_USERSID_PASSWORD,
  UPDATE_USERSNAME_PASSWORD,
  DELETE_PASSWORDRESETTOKENS,
  SELECT_USERSID_USERNAME,
  SELECT_USERSNAME_USERNAME,
} from '../utils/queries';

import { client } from '../utils/client';

/**
 * Store user information in database
 * @param userId - The userId of the user
 * @param username - The username of the user
 * @param sid - The sessionID of the user
 * @param password - The password of the user
 */
export const addUserToPendingAccounts = async (
  userId: string,
  email: string,
  username: string,
  password: string
) => {
  const hash = await bcrypt.hash(password, 12);
  const params = [userId, email, username, hash];
  await client.execute(INSERT_PENDINGACCOUNTS, params, { prepare: true });
};
/**
 * Check if user exists in both pending accounts and approved accounts
 * @param username - The username of the user
 * @returns ResultSet - Contains row of user_id
 */
export const checkUserExists = async (username: string) => {
  const pendingAccountResult = await client.execute(
    SELECT_PENDINGACCOUNTS_USERID,
    [username],
    { prepare: true }
  );
  const approvedAccountResult = await client.execute(
    SELECT_USERSNAME_USERID,
    [username],
    { prepare: true }
  );
  if (
    pendingAccountResult === undefined ||
    approvedAccountResult === undefined
  ) {
    return undefined;
  }
  return (
    pendingAccountResult.rows.length > 0 ||
    approvedAccountResult.rows.length > 0
  );
};
/**
 * Retrieve user information from database
 * @param username - The username used to lookup the user
 * @returns ResultSet - Contains row of user_id and password
 */
export const retrieveUser = async (username: string) => {
  return client.execute(SELECT_USERSID_USERID_PASSWORD_ADMIN, [username], {
    prepare: true,
  });
};

/**
 * Check if the password matches with the hash
 * @param password - The value that needs to be validated
 * @param hash - The value that is used to validate the password
 * @returns boolean - True if hash of password mashes input hash
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
 * @returns ResultSet - Contains row of sid belonging to userId
 */
export const retrieveSID = async (userId: string) => {
  return client.execute(SELECT_USERSNAME_SID, [userId], { prepare: true });
};

/**
 * Retrieve the session using the sessionID
 * @param userId - The value used to lookup the sessionID
 * @returns ResultSet - Contains row of session belonging to sessionID
 */
export const retrieveSession = async (sessionID: string) => {
  return client.execute(SELECT_SID_SESSION, [sessionID], { prepare: true });
};

/**
 * Retrieve the pending account using the username
 * @param username - The value used to lookup the pending account
 * @returns ResultSet - Contains all the fields of the pending account
 */
export const retrievePendingAccount = (username: string) => {
  return client.execute(SELECT_PENDINGACCOUNTS_ALL, [username], {
    prepare: true,
  });
};

/**
 * Store user information into users_id and users_name tables
 * @param userId - The userId of the user
 * @param email - The email of the user
 * @param username - The username of the user
 * @param password - The password of the user
 */
export const approveRegistration = async (
  userId: string,
  email: string,
  username: string,
  password: string
) => {
  const params = [userId, email, username, password, false];
  await client.execute(INSERT_USERSID, params, { prepare: true });
  await client.execute(INSERT_USERSNAME, params, { prepare: true });
};

/**
 * Remove pending account from the pending_accounts table
 * @param username - The username used to lookup the to-be-deleted account
 */
export const removePendingAccount = async (username: string) => {
  await client.execute(DELETE_PENDINGACCOUNTS_ALL, [username], {
    prepare: true,
  });
};

/**
 * Retrieve all pending accounts
 * @returns Array - A list of all the pending accounts
 */
export const retrievePendingAccounts = async () => {
  const result = await client.execute(SELECT_PENDINGACCOUNTS, [], {
    prepare: true,
  });
  return result.rows;
};

/**
 * Retrieve all approved usernames
 * @returns Array - A list of all the approved usernames
 */
export const retrieveUsernames = async () => {
  const result = await client.execute(SELECT_USERSNAME_USERNAME, [], {
    prepare: true,
  });
  return result.rows;
};

/**
 * Store the token and userId into password_reset_tokens table
 * @params token - The password reset token
 * @params userId - The user ID associated with the token
 */
export const storeResetToken = async (token: string, userId: string) => {
  await client.execute(INSERT_PASSWORDRESETTOKENS, [token, userId], {
    prepare: true,
  });
};

/**
 * Retrieve the userId and email using username as lookup
 * @params username - The username of the user
 * @returns ResultSet - Contains the user_id and email field of the user
 */
export const retrieveUserIdAndEmail = async (username: string) => {
  return client.execute(SELECT_USERSNAME_USERID_EMAIL, [username], {
    prepare: true,
  });
};

/**
 * Verify the reset token exists in the table
 * @params token - The token to be verified
 * @returns boolean - True if token is valid, false otherwise
 */
export const verifyToken = async (token: string) => {
  const result = await client.execute(SELECT_PASSWORDRESETTOKENS, [token], {
    prepare: true,
  });
  return result.rows.length === 1;
};

/**
 * Retrieve the associated user ID using the reset token
 * @params token - The password reset token
 * @returns string - The id of the retrieved user
 */
export const retrieveUserIdFromToken = async (token: string) => {
  const result = await client.execute(
    SELECT_PASSWORDRESETTOKENS_USERID,
    [token],
    { prepare: true }
  );
  return result.rows[0].user_id;
};

/**
 * Update the password field in users_id and users_name table to the provided password
 * @params userId - The ID of the user
 * @params username - The username of the user
 * @params password - The updated password
 */
export const updatePassword = async (
  userId: string,
  username: string,
  password: string
) => {
  await client.execute(UPDATE_USERSID_PASSWORD, [password, userId], {
    prepare: true,
  });
  await client.execute(UPDATE_USERSNAME_PASSWORD, [password, username], {
    prepare: true,
  });
};

/**
 * Delete the password reset token from the password_reset_tokens table
 * @params token - The token to be deleted
 */
export const deleteToken = async (token: string) => {
  await client.execute(DELETE_PASSWORDRESETTOKENS, [token], { prepare: true });
};

/**
 * Retrieve the username using the userId as lookup
 * @params userId - The ID of the user
 * @returns string - The username of the user
 */
export const retrieveUsernameFromUserId = async (userId: string) => {
  const result = await client.execute(SELECT_USERSID_USERNAME, [userId], {
    prepare: true,
  });
  return result.rows[0].username;
};
