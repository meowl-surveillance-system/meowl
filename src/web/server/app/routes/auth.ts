import bcrypt from 'bcrypt';
import express from 'express';

import {
  isLoggedIn,
  isLoggedOut,
  isUsernameCollide,
  isValidCred,
} from '../middlewares/authChecks';
import * as authController from '../controllers/auth';

const app = express();

app.post(
  '/register',
  [isLoggedOut, isValidCred, isUsernameCollide],
  (req: express.Request, res: express.Response) => {
    authController.register(req, res);
  }
);

app.post(
  '/login',
  [isLoggedOut, isValidCred],
  (req: express.Request, res: express.Response) => {
    authController.login(req, res);
  }
);

app.post(
  '/logout',
  isLoggedIn,
  (req: express.Request, res: express.Response) => {
    authController.logout(req, res);
  }
);

app.post(
  '/rtmpRequest',
  isLoggedIn,
  (req: express.Request, res: express.Response) => {
    authController.rtmpRequest(req, res);
  }
);

app.post(
  '/rtmpAuth',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    authController.rtmpAuth(req, res);
  }
);

module.exports = app;
