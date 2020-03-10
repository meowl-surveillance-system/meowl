// Query names take the following form: <ACTION>_<TABLE NAME>_<COLUMNS YOU WANT
// TO DO THE ACTION ON>

export const queries: {[query: string]: string} = {
  INSERT_USERSID:
      'INSERT INTO users_id (user_id, username, password, sid) VALUES (?, ?, ?, ?)',
  INSERT_USERSNAME:
      'INSERT INTO users_name (user_id, username, password, sid) VALUES (?, ?, ?, ?)',
  SELECT_USERSID_USERID_PASSWORD:
      'SELECT user_id, password FROM users_name WHERE username = ?',
  UPDATE_USERSID_SID: 'UPDATE users_id SET sid = ? WHERE user_id = ?',
  UPDATE_USERSNAME_SID: 'UPDATE users_name SET sid = ? WHERE username = ?',
  SELECT_USERSNAME_SID: 'SELECT sid FROM users_id WHERE user_id = ?',
  SELECT_USERSNAME_USERID: 'SELECT user_id FROM users_name WHERE username = ?'
}
