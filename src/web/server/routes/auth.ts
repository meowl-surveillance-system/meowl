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
      const query = 'INSERT INTO users (user_id, username, password, sid) VALUES (?, ?, ?, ?)';
      const params = [uuid.v4(), username, hash, sid];
      client.execute(query, params, { prepare: true });
    });
  }
  res.send('sucessfully registered');
});

app.post('/login', (req, res) => {});

app.post('/logout', (req, res) => {});

module.exports = app;
