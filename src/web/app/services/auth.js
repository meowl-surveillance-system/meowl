"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const queries_1 = require("../utils/queries");
const client_1 = require("../utils/client");
/**
 * Store user information in database
 * @param userId - The userId of the user
 * @param username - The username of the user
 * @param sid - The sessionID of the user
 * @param password - The password of the user
 */
exports.storeUser = async (userId, email, username, sid, password) => {
    const hash = await bcrypt_1.default.hash(password, 12);
    const params = [userId, email, username, hash, sid];
    await client_1.client.execute(queries_1.INSERT_USERSID, params, { prepare: true });
    await client_1.client.execute(queries_1.INSERT_USERSNAME, params, { prepare: true });
};
/**
 * Check if user exists
 * @param username - The username of the user
 * @returns ResultSet - Contains row of user_id
 */
exports.checkUserExists = (username) => {
    return client_1.client.execute(queries_1.SELECT_USERSNAME_USERID, [username], { prepare: true });
};
/**
 * Retrieve user information from database
 * @param username - The username used to lookup the user
 * @returns ResultSet - Contains row of user_id and password
 */
exports.retrieveUser = async (username) => {
    return client_1.client.execute(queries_1.SELECT_USERSID_USERID_PASSWORD, [username], {
        prepare: true,
    });
};
/**
 * Check if the password matches with the hash
 * @param password - The value that needs to be validated
 * @param hash - The value that is used to validate the password
 * @returns boolean - True if hash of password mashes input hash
 */
exports.compareHash = async (password, hash) => {
    return bcrypt_1.default.compare(password, hash);
};
/**
 * Update the sessionID of the user
 * @param sid - The sessionID
 * @param userId - The userId of the user
 * @param username - The username of the user
 */
exports.updateSessionId = async (sid, userId, username) => {
    await client_1.client.execute(queries_1.UPDATE_USERSID_SID, [sid, userId], { prepare: true });
    await client_1.client.execute(queries_1.UPDATE_USERSNAME_SID, [sid, username], {
        prepare: true,
    });
};
/**
 * Retrieve the SessionID using the userId
 * @param userId - The value used to lookup the sessionID
 * @returns ResultSet - Contains row of sid belonging to userId
 */
exports.retrieveSID = async (userId) => {
    return client_1.client.execute(queries_1.SELECT_USERSNAME_SID, [userId], { prepare: true });
};
/**
 * Retrieve the session using the sessionID
 * @param userId - The value used to lookup the sessionID
 * @returns ResultSet - Contains row of session belonging to sessionID
 */
exports.retrieveSession = async (sessionID) => {
    return client_1.client.execute(queries_1.SELECT_SID_SESSION, [sessionID], { prepare: true });
};
//# sourceMappingURL=auth.js.map