import express from 'express';

const app = express();

app.use('/auth', require('./auth'));
app.use('/api', require('./api'));
app.use('/notif', require('./notif'));
app.use('/blacklist', require('./blacklist'));

export const routes = app;
