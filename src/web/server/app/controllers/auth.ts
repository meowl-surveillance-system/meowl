import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import * as authServices from '../services/auth';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const sid = req.sessionID;
  const userId = uuidv4();
  authServices.storeUser(userId, username, sid, password);
  req.session!.userId = userId;
  res.status(200).send('successfully registered');
};

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
        res.status(200).send('successfully logged in');
      } else {
        res.status(400).send('Invalid username or password');
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send('Server error');
  }
};

export const logout = (req: Request, res: Response) => {
  req.session!.destroy(err => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send('logged out');
    }
  });
};

export const rtmpRequest = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ sessionID: req.sessionID, userId: req.session!.userId });
};

export const rtmpAuth = async (req: Request, res: Response) => {
  try {
    const result = await authServices.retrieveSID(req.body.userId);
    if (result.rows.length === 0 || result.rows[0].sid !== req.body.sessionID) {
      res.status(400).send('Nice try kid');
    } else {
      res.status(200).send('OK');
    }
  } catch (e) {
    console.log(e);
    res.status(500).send('Server error');
  }
};
