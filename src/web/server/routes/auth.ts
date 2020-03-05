const app = require('express')();
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const client = require('../utils/client');

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  const sid = req.sessionID;
  console.log(sid);
  if(username && password) {
    bcrypt.hash(password, 12, function(err, hash) {
      const query_ID = 'INSERT INTO users_id (user_id, username, password, sid) VALUES (?, ?, ?, ?)';
      const query_name = 'INSERT INTO users_name (user_id, username, password, sid) VALUES (?, ?, ?, ?)';
      const user_id = uuid.v4();
      const params = [user_id, username, hash, sid];
      client.execute(query_ID, params, { prepare: true });
      client.execute(query_name, params, { prepare: true });
    });
  }
  res.send('sucessfully registered');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sid = req.sessionID;
  if(username && password) {
    const query = 'SELECT user_id, password FROM users_name WHERE username = ?;'
    client.execute(query, [ username ], function(err, result) {
      if(err) {
        console.log(err);
      }
      else {
    
        const id = result.rows[0].user_id;
        const hash = result.rows[0].password;

        bcrypt.compare(password, hash, function(error, same) {
          if(error) {
	    console.log(error);
	  }
	  else if(same) {
	    const update_sid_ID = 'UPDATE users_id SET sid = ? WHERE user_id = ?'
	    const update_sid_name = 'UPDATE users_name SET sid = ? WHERE username = ?';
	    client.execute(update_sid_ID, [ sid, id ], { prepare: true });
	    client.execute(update_sid_name, [ sid, username ], { prepare: true });
	    res.send(sid);
	  }
          else {
	    res.send('no match');
	  }
        });
      }
    });
  }
  else {
    res.send('bad username or password');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log(req.sessionID);
      res.send('logged out');
    }
  });
});

module.exports = app;
