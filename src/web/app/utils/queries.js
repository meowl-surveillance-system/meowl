"use strict";
// Query names take the following form: <ACTION>_<TABLE NAME>_<COLUMNS YOU WANT
// TO DO THE ACTION ON>
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSERT_USERSID = 'INSERT INTO users_id (user_id, email, username, password, sid) VALUES (?, ?, ?, ?, ?)';
exports.INSERT_USERSNAME = 'INSERT INTO users_name (user_id, email, username, password, sid) VALUES (?, ?, ?, ?, ?)';
exports.SELECT_USERSID_USERID_PASSWORD = 'SELECT user_id, password FROM users_name WHERE username = ?';
exports.UPDATE_USERSID_SID = 'UPDATE users_id SET sid = ? WHERE user_id = ?';
exports.UPDATE_USERSNAME_SID = 'UPDATE users_name SET sid = ? WHERE username = ?';
exports.SELECT_USERSNAME_SID = 'SELECT sid FROM users_id WHERE user_id = ?';
exports.SELECT_SID_SESSION = 'SELECT * FROM sessions WHERE sid = ?';
exports.SELECT_USERSNAME_USERID = 'SELECT user_id FROM users_name WHERE username = ?';
exports.SELECT_CAMERAID_USERID = 'SELECT camera_id FROM user_cameras WHERE user_id = ?';
exports.SELECT_USERID_CAMERAID = 'SELECT user_id FROM camera_users WHERE camera_id = ?';
exports.INSERT_CAMERAID_USERID = 'INSERT INTO user_cameras (user_id, camera_id) VALUES (?, ?)';
exports.INSERT_USERID_CAMERAID = 'INSERT INTO camera_users (user_id, camera_id) VALUES (?, ?)';
exports.INSERT_CAMERAID_STREAMID = 'INSERT INTO camera_streams (camera_id, stream_id, stream_date) VALUES(?, ?, ?)';
exports.SELECT_CAMERAID_STREAMID = 'SELECT stream_id FROM camera_streams WHERE camera_id = ?';
exports.SELECT_STREAMID_METADATA = 'SELECT stream_id FROM metadata WHERE stream_id = ?';
exports.SELECT_CAMERAID_STREAMID_SINGLE = 'SELECT stream_id FROM camera_streams WHERE camera_id = ? LIMIT 1';
exports.INSERT_CAMERAID_LIVE = 'INSERT INTO live_cameras (camera_id, live) VALUES (?, ?)';
exports.SELECT_CAMERAID = 'SELECT DISTINCT camera_id FROM camera_streams';
exports.SELECT_LIVE_CAMERAID = 'SELECT live FROM live_cameras WHERE camera_id = ?';
//# sourceMappingURL=queries.js.map