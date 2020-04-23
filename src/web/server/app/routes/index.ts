import express from 'express';

const app = express();

app.use('/auth', require('./auth'));
app.use('/api', require('./api'));
app.use('/notif', require('./notif'));

export const routes = app;
