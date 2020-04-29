import axios from 'axios';
import { Request, Response } from 'express';
import url from 'url';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import * as apiServices from '../services/api';
import * as authServices from '../services/auth';
import { CASSANDRA_FLASK_SERVER_URL } from '../utils/settings';
import { sendEmail } from '../utils/mailer';

/**
 * Sends 200 if session of user contains its userId, 400 otherwise
 */
export const isLoggedIn = (req: Request, res: Response) => {
  if (req.session!.userId) {
    res.status(200).json(true);
  } else {
    res.status(400).json(false);
  }
};

/**
 * Sends 200 if session of user has admin true, 400 otherwise
 */
export const isAdmin = (req: Request, res: Response) => {
  if (req.session!.admin) {
    res.status(200).json(true);
  } else {
    res.status(400).json(false);
  }
};

/**
 * Stores a user's credentials in pending_accounts table if username does not exist
 */
export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  const sid = req.sessionID;
  const userId = uuidv4();
  const userExists = await authServices.checkUserExists(username);
  if (userExists === undefined) {
    res.status(500).send('server error');
  } else {
    if (userExists) {
      res.status(400).send('username already exists');
    } else {
      await authServices.addUserToPendingAccounts(
        userId,
        email,
        username,
        password
      );
      res.status(200).send('successfully added to pending accounts');
    }
  }
};

/**
 * Checks if username and hashed password from body are valid and updates
 * session to contain userId if so
 */
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const sid = req.sessionID;
  try {
    const result = await authServices.retrieveUser(username);
    const credentials = result.rows[0];
    if (credentials === undefined) {
      res.status(400).send('Invalid username or password');
    } else {
      const match = await authServices.compareHash(
        password,
        credentials.password
      );
      if (match) {
        await authServices.updateSessionId(sid, credentials.user_id, username);
        req.session!.userId = credentials.user_id;
        req.session!.admin = credentials.admin;
        res.status(200).send('successfully logged in');
      } else {
        res.status(400).send('Invalid username or password');
      }
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

/**
 * Destroys session
 */
export const logout = (req: Request, res: Response) => {
  req.session!.destroy(err => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send('logged out');
    }
  });
};

/**
 * Approves a registration by transferring the pending account to the users_id and users_name tables
 */
export const approveRegistration = async (req: Request, res: Response) => {
  try {
    const result = await authServices.retrievePendingAccount(req.body.username);
    const credentials = result.rows[0];
    if (credentials === undefined) {
      res.status(400).send('Pending account does not exist');
    } else {
      const { user_id, email, username, password } = credentials;
      await authServices.approveRegistration(
        user_id,
        email,
        username,
        password
      );
      await authServices.removePendingAccount(username);
      res.status(200).send('Successfully registered');
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

/**
 * Rejects a registration by deleting the pending account from the pending_accounts table
 */
export const rejectRegistration = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const result = await authServices.retrievePendingAccount(username);
    const credentials = result.rows[0];
    if (credentials === undefined) {
      res.status(400).send('Pending account does not exist');
    } else {
      await authServices.removePendingAccount(username);
      res.status(200).send('Successfully deleted pending account');
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

/**
 * Retrieve all pending accounts
 */
export const getPendingAccounts = async (req: Request, res: Response) => {
  try {
    const pendingAccounts = await authServices.retrievePendingAccounts();
    const usernames = pendingAccounts.map(row => {
      return row.username;
    });
    res.status(200).json(usernames);
  } catch (e) {
    console.error(e);
    res.status(500).json('Server error');
  }
};

/**
 * Save the reset token along with the userId in table.
 * Then send email to the user along with the token.
 */
export const beginPasswordReset = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const result = await authServices.retrieveUserIdAndEmail(username);
    const credentials = result.rows[0];
    if (credentials === undefined) {
      res.status(400).json('Something went wrong');
    } else {
      const token = uuidv4();
      const { user_id, email } = credentials;
      authServices.storeResetToken(token, user_id);
      sendEmail(email, token);
      res.status(200).json('Successfully sent password reset email');
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

/**
 * Verify that the token exists by looking it up in the table
 */
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const { resetToken } = req.body;
    const tokenExists = await authServices.verifyToken(resetToken);
    if (tokenExists) {
      res.status(200).json('Good token');
    } else {
      res.status(400).json('Bad token');
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

/**
 * Update the password for the user and delete the reset token after use
 */
export const submitPasswordReset = async (req: Request, res: Response) => {
  try {
    const { password, resetToken } = req.body;
    if (!password || password.length < 5) {
      res.status(400).json('Password is too short');
    } else {
      const userId = await authServices.retrieveUserIdFromToken(resetToken);
      const username = await authServices.retrieveUsernameFromUserId(userId);
      const hash = await bcrypt.hash(password, 12);
      await authServices.updatePassword(userId, username, hash);
      await authServices.deleteToken(resetToken);
      res.status(200).json('Successfully updated password');
    }
  } catch (e) {
    console.error(e);
    res.status(500).json('Server error');
  }
};

/**
 * Sends sessionID and userID of active session in response
 */
export const rtmpRequest = (req: Request, res: Response) => {
  console.log('rtmpRequest', {
    sessionID: req.sessionID,
    userId: req.session!.userId,
  });
  res
    .status(200)
    .json({ sessionID: req.sessionID, userId: req.session!.userId });
};

/**
 * Sends 200 if userId and sessionID in body of request match and session is
 * still valid, 400 otherwise
 */
export const rtmpAuthPlay = async (req: Request, res: Response) => {
  try {
    const result = await authServices.retrieveSID(req.body.userId);
    if (result.rows.length === 0 || result.rows[0].sid !== req.body.sessionID) {
      res.status(400).send('Nice try kid');
    } else {
      res.status(200).send('OK');
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

/**
 * Handles authorization of rtmp stream publishing requests
 * Assigns userId to cameraId, stores streamId to cameraId, updates that
 * cameraId is live, and makes api request to rtmp saver to start or stop
 * saving. Only stores if userId and sessionID in body of request match,
 * cameraId is assigned to userId or no one.
 * @param start true to indicate if this request is the start of the stream,
 * false to indicate streaming has stopped
 */
const rtmpAuthPublish = async (req: Request, res: Response, start: boolean) => {
  try {
    const result = await authServices.retrieveSession(req.body.sessionID);
    if (
      result.rows.length === 0 ||
      JSON.parse(result.rows[0].session).userId !== req.body.userId ||
      result.rows[0].expires < Date.now()
    ) {
      res.status(400).send('Nice try kid');
    } else {
      const canStream = await apiServices.verifyUserCamera(
        req.body.userId,
        req.body.cameraId
      );
      if (canStream) {
        await apiServices.addUserCamera(req.body.userId, req.body.cameraId);
        await apiServices.storeStreamId(req.body.cameraId, req.body.name);
        await apiServices.updateCameraLive(req.body.cameraId, start);
        const saverUrl = url.resolve(
          CASSANDRA_FLASK_SERVER_URL,
          (start ? 'store/' : 'stop/') + req.body.name
        );
        const saverResponse = await axios.get(saverUrl);
        if (saverResponse.status === 200) {
          res.status(200).send('OK');
        } else {
          res.status(500).send('Server error');
        }
      } else {
        res.status(400).send('Nice try dude');
      }
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

/**
 * Calls rtmpAuthPublish with true when streaming starts
 */
export const rtmpAuthPublishStart = async (req: Request, res: Response) => {
  await rtmpAuthPublish(req, res, true);
};

/**
 * Calls rtmpAuthPublish with false when streaming stops
 */
export const rtmpAuthPublishStop = async (req: Request, res: Response) => {
  await rtmpAuthPublish(req, res, false);
};
