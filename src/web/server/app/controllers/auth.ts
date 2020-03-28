import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { get as HTTPGet } from 'axios';

import * as authServices from '../services/auth';
import * as apiServices from '../services/api';

export const isLoggedIn = (req: Request, res: Response) => {
  if (req.session!.userId) {
    res.status(200).json(true);
  } else {
    res.status(400).json(false);
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  const sid = req.sessionID;
  const userId = uuidv4();
  authServices.storeUser(userId, email, username, sid, password);
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

export const rtmpAuthPlay = async (req: Request, res: Response) => {
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

const rtmpAuthPublish = async (req: Request, res: Response, start: boolean) => {
  try {
    const result = await authServices.retrieveSID(req.body.userId);
    if (result.rows.length === 0 || result.rows[0].sid !== req.body.sessionID) {
      res.status(400).send('Nice try kid');
    } else {
      await apiServices.storeStreamId(req.body.cameraId, req.body.name);
      const saverUrl =
        'http://localhost:5000/' + (start ? 'store/' : 'stop/') + req.body.name;
      const saverResponse = await HTTPGet(saverUrl);
      if (saverResponse.status === 200) {
        res.status(200).send('OK');
      } else {
        res.status(500).send('Server error');
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send('Server error');
  }
};
export const rtmpAuthPublishStart = async (req: Request, res: Response) => {
  await rtmpAuthPublish(req, res, true);
};

export const rtmpAuthPublishStop = async (req: Request, res: Response) => {
  await rtmpAuthPublish(req, res, false);
};
