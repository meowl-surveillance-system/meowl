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

/**
 * Register a new user
 */
app.post(
  '/register',
  [isLoggedOut, isValidCred, isUsernameCollide],
  (req: express.Request, res: express.Response) => {
    authController.register(req, res);
  }
);

/**
 * Login a user
 */
app.post(
  '/login',
  [isLoggedOut, isValidCred],
  (req: express.Request, res: express.Response) => {
    authController.login(req, res);
  }
);

/**
 * Logout a user
 */
app.post(
  '/logout',
  isLoggedIn,
  (req: express.Request, res: express.Response) => {
    authController.logout(req, res);
  }
);

/**
 * Extract sessionID and userId from cookie and send it back in the response body
 */
app.post(
  '/rtmpRequest',
  isLoggedIn,
  (req: express.Request, res: express.Response) => {
    authController.rtmpRequest(req, res);
  }
);

/**
 * Authenticate a user for RTMP streaming
 */
app.post(
  '/rtmpAuth',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    authController.rtmpAuth(req, res);
  }
);

module.exports = app;
