const app = require('express')();

app.use('/auth', require('./auth'));
app.use('/api', require('./api'));

module.exports = app;
