const app = require('express')();
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const client = require('../utils/client');
const { isLoggedIn, isLoggedOut, isValidCred, isUsernameCollide } = require('../middlewares/authChecks');
const queries = require('../utils/queries');

app.post('/register', [isLoggedOut, isValidCred, isUsernameCollide], (req, res) => {
  const { username, password } = req.body;
  const sid = req.sessionID;
  const user_id = uuid.v4();

  bcrypt.hash(password, 12, function(err, hash) {
    const params = [user_id, username, hash, sid];
    client.execute(queries.INSERT_USERSID, params, { prepare: true });
    client.execute(queries.INSERT_USERSNAME, params, { prepare: true });
  });
  req.session.userId = user_id;
  res.status(200).send('successfully registered');
});

app.post('/login', [isLoggedOut, isValidCred], (req, res) => {
  const { username, password } = req.body;
  const sid = req.sessionID;

  client.execute(queries.SELECT_USERSID_USERID_PASSWORD, [ username ], { prepare: true }, function(err, result) {
    if(err) {
      console.log(err);
      res.status(400).send('Bad request');
    }

    else {
      const id = result.rows[0].user_id;
      const hash = result.rows[0].password;

      bcrypt.compare(password, hash, function(error, match) {
        if(error) {
	  console.log(error);
	}

	else if(match) {
	  client.execute(queries.UPDATE_USERSID_SID, [ sid, id ], { prepare: true });
	  client.execute(queries.UPDATE_USERSNAME_SID, [ sid, username ], { prepare: true });
	  req.session.userId = id;
	  res.status(200).send('sucessfully logged in');
	}

        else {
	  res.status(400).send('Invalid username or password');
	}
      });
    }
  });
});

app.post('/logout', isLoggedIn, (req, res) => {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    }
    else {
      res.status(200).send('logged out');
    }
  });
});

app.post('/rtmpRequest', isLoggedIn, (req, res) => {
  res.status(200).json({ 
    sessionID: req.sessionID,
    userId: req.session.userId
  });
});

app.get('/rtmpAuth', async (req, res) => {
  const result = await client.execute(queries.SELECT_USERSNAME_SID, [req.body.userId], { prepare: true });
  if(result.rows.length == 0 || result.rows[0].sid !== req.body.sessionID) {
    res.status(400).send('Nice try kid');
  }
  else {
    res.status(200).send('OK');
  }
});

module.exports = app;
