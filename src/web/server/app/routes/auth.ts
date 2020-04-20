import bcrypt from 'bcrypt';
import express from 'express';

import {
  isLoggedIn,
  isLoggedOut,
  isUsernameCollide,
  isValidCred,
  isAdmin,
} from '../middlewares/authChecks';
import * as authController from '../controllers/auth';

const app = express();

app.get('/isLoggedIn', (req: express.Request, res: express.Response) => {
  authController.isLoggedIn(req, res);
});

/**
 * Register a new pending user to the pending accounts table
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
 * Approve a registration
 */
app.post(
  '/approveRegistration',
  [isLoggedIn, isAdmin],
  (req: express.Request, res: express.Response) => {
    authController.approveRegistration(req, res);
  }
);

/**
 * Reject a registration
 */
app.post(
  '/rejectRegistration',
  [isLoggedIn, isAdmin],
  (req: express.Request, res: express.Response) => {
    authController.rejectRegistration(req, res);
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
 * Authenticate a user for RTMP streaming and start saving
 */
app.post(
  '/rtmpAuthPublishStart',
  async (req: express.Request, res: express.Response) => {
    authController.rtmpAuthPublishStart(req, res);
  }
);

/**
 * Authenticate a user for RTMP streaming and stop saving
 */
app.post(
  '/rtmpAuthPublishStop',
  async (req: express.Request, res: express.Response) => {
    authController.rtmpAuthPublishStop(req, res);
  }
);

/**
 * Authenticate a user for RTMP stream viewing
 */
app.post(
  '/rtmpAuthPlay',
  async (req: express.Request, res: express.Response) => {
    authController.rtmpAuthPlay(req, res);
  }
);

module.exports = app;
