// Query names take the following form: <ACTION>_<TABLE NAME>_<COLUMNS YOU WANT
// TO DO THE ACTION ON>

export const INSERT_USERSID =
  'INSERT INTO users_id (user_id, email, username, password, sid) VALUES (?, ?, ?, ?, ?)';
export const INSERT_USERSNAME =
  'INSERT INTO users_name (user_id, email, username, password, sid) VALUES (?, ?, ?, ?, ?)';
export const SELECT_USERSID_USERID_PASSWORD =
  'SELECT user_id, password FROM users_name WHERE username = ?';
export const UPDATE_USERSID_SID =
  'UPDATE users_id SET sid = ? WHERE user_id = ?';
export const UPDATE_USERSNAME_SID =
  'UPDATE users_name SET sid = ? WHERE username = ?';
export const SELECT_USERSNAME_SID =
  'SELECT sid FROM users_id WHERE user_id = ?';
export const SELECT_SID_SESSION = 'SELECT * FROM sessions WHERE sid = ?';
export const SELECT_USERSNAME_USERID =
  'SELECT user_id FROM users_name WHERE username = ?';
export const SELECT_CAMERAID_USERID =
  'SELECT camera_id FROM user_cameras WHERE user_id = ?';
export const SELECT_USERID_CAMERAID =
  'SELECT user_id FROM camera_users WHERE camera_id = ?';
export const INSERT_CAMERAID_USERID =
  'INSERT INTO user_cameras (user_id, camera_id) VALUES (?, ?)';
export const INSERT_USERID_CAMERAID =
  'INSERT INTO camera_users (user_id, camera_id) VALUES (?, ?)';
export const INSERT_CAMERAID_STREAMID =
  'INSERT INTO camera_streams (camera_id, stream_id, stream_date) VALUES(?, ?, ?)';
export const SELECT_CAMERAID_STREAMID =
  'SELECT stream_id FROM camera_streams WHERE camera_id = ?';
export const SELECT_STREAMID_METADATA =
  'SELECT stream_id FROM metadata WHERE stream_id = ?';
export const SELECT_CAMERAID_STREAMID_SINGLE =
  'SELECT stream_id FROM camera_streams WHERE camera_id = ? LIMIT 1';
export const INSERT_CAMERAID_LIVE =
  'INSERT INTO live_cameras (camera_id, live) VALUES (?, ?)';
export const SELECT_CAMERAID = 'SELECT DISTINCT camera_id FROM camera_streams';
export const SELECT_LIVE_CAMERAID =
  'SELECT live FROM live_cameras WHERE camera_id = ?';
export const SELECT_NOTIFICATIONS = 'SELECT * from notif';
