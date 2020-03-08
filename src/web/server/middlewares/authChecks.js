const client = require('../utils/client'); 

function isLoggedIn(req, res, next) {
  console.log(req.session);
  if(req.session.userId) {
    return next();
  }
  else {
    res.status(400).send('Bad request');
  }
}

function isLoggedOut(req, res, next) {
  if(req.session.userId) {
    res.status(400).send('Bad request');
  }
  else {
    return next();
  }
}

function isValidCred(req, res, next) {
  const { username, password } = req.body;
  if(username && password) {
    return next();
  }
  else {
    res.status(400).send('Bad username or password');
  }
}

async function isUsernameCollide(req, res, next) {
  const { username } = req.body;
  const result = await isCollide(username);
  if(!result) return next();
  else res.status(400).send('Bad username');
}

async function isCollide(username) {
  const get_user = 'SELECT user_id FROM users_name WHERE username = ?'
  const result = await client.execute(get_user, [username], { prepare: true });
  return result.rows.length !== 0;
}


module.exports = {
  isLoggedIn,
  isLoggedOut,
  isValidCred,
  isUsernameCollide
}
