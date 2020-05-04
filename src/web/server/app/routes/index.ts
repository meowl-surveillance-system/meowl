import express from 'express';

const app = express();

app.use('/auth', require('./auth'));
app.use('/api', require('./api'), require('./apiGroups'));
app.use('/cv', require('./cv'));
app.use('/notif', require('./notif'));
app.use('/blacklist', require('./blacklist'));

export const routes = app;
