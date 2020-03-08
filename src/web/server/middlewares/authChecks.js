const client = require('../utils/client'); 

function isLoggedIn(req, res, next) {
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

module.exports = {
  isLoggedIn,
  isLoggedOut
}
