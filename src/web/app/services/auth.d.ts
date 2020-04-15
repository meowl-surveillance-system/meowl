/**
 * Store user information in database
 * @param userId - The userId of the user
 * @param username - The username of the user
 * @param sid - The sessionID of the user
 * @param password - The password of the user
 */
export declare const storeUser: (userId: string, email: string, username: string, sid: any, password: string) => Promise<void>;
/**
 * Check if user exists
 * @param username - The username of the user
 * @returns ResultSet - Contains row of user_id
 */
export declare const checkUserExists: (username: string) => Promise<import("cassandra-driver").types.ResultSet>;
/**
 * Retrieve user information from database
 * @param username - The username used to lookup the user
 * @returns ResultSet - Contains row of user_id and password
 */
export declare const retrieveUser: (username: string) => Promise<import("cassandra-driver").types.ResultSet>;
/**
 * Check if the password matches with the hash
 * @param password - The value that needs to be validated
 * @param hash - The value that is used to validate the password
 * @returns boolean - True if hash of password mashes input hash
 */
export declare const compareHash: (password: string, hash: string) => Promise<boolean>;
/**
 * Update the sessionID of the user
 * @param sid - The sessionID
 * @param userId - The userId of the user
 * @param username - The username of the user
 */
export declare const updateSessionId: (sid: any, userId: string, username: string) => Promise<void>;
/**
 * Retrieve the SessionID using the userId
 * @param userId - The value used to lookup the sessionID
 * @returns ResultSet - Contains row of sid belonging to userId
 */
export declare const retrieveSID: (userId: string) => Promise<import("cassandra-driver").types.ResultSet>;
/**
 * Retrieve the session using the sessionID
 * @param userId - The value used to lookup the sessionID
 * @returns ResultSet - Contains row of session belonging to sessionID
 */
export declare const retrieveSession: (sessionID: string) => Promise<import("cassandra-driver").types.ResultSet>;
