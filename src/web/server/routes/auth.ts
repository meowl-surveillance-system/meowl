const app = require('express')();
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const client = require('../utils/client');
const authChecks = require('../middlewares/authChecks');

app.post('/register', authChecks.isLoggedOut, (req, res) => {
  const { username, password } = req.body;
  const sid = req.sessionID;
 
  if(username && password) {
    bcrypt.hash(password, 12, function(err, hash) {
      const query_ID = 'INSERT INTO users_id (user_id, username, password, sid) VALUES (?, ?, ?, ?)';
      const query_name = 'INSERT INTO users_name (user_id, username, password, sid) VALUES (?, ?, ?, ?)';
      const user_id = uuid.v4();
      const params = [user_id, username, hash, sid];
      client.execute(query_ID, params, { prepare: true });
      client.execute(query_name, params, { prepare: true });
      req.session.userId = user_id;
    });
    res.status(200).send('successfully registered');
  }

  else {
    res.status(400).send('bad username or password');
  }
});

app.post('/login', authChecks.isLoggedOut, (req, res) => {
  const { username, password } = req.body;
  const sid = req.sessionID;

  if(username && password) {
    const query = 'SELECT user_id, password FROM users_name WHERE username = ?;'
    client.execute(query, [ username ], { prepare: true }, function(err, result) {
      if(err) {
        console.log(err);
      }

      else {
        const id = result.rows[0].user_id;
        const hash = result.rows[0].password;

        bcrypt.compare(password, hash, function(error, match) {
          if(error) {
	    console.log(error);
	  }

	  else if(match) {
	    const update_sid_ID = 'UPDATE users_id SET sid = ? WHERE user_id = ?'
	    const update_sid_name = 'UPDATE users_name SET sid = ? WHERE username = ?';
	    client.execute(update_sid_ID, [ sid, id ], { prepare: true });
	    client.execute(update_sid_name, [ sid, username ], { prepare: true });
	    req.session.userId = id;
	    res.status(200).send('sucessfully logged in');
	  }

          else {
	    res.status(400).send('Invalid username or password');
	  }
        });
      }
    });
  }

  else {
    res.status(400).send('bad username or password');
  }
});

app.post('/logout', authChecks.isLoggedIn, (req, res) => {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    }
    else {
      res.status(200).send('logged out');
    }
  });
});

module.exports = app;
