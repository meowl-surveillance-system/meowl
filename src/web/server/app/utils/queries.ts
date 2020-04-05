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
export const SELECT_USERSNAME_USERID =
  'SELECT user_id FROM users_name WHERE username = ?';
