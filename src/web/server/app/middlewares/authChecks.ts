import express from 'express';

import {client} from '../utils/client';
import {queries} from '../utils/queries';

export function isLoggedIn(
    req: Express.Request, res: express.Response, next: express.NextFunction) {
  if (req.session!.userId) {
    return next();
  } else {
    res.status(400).send('Not logged in');
  }
}

export function isLoggedOut(
    req: Express.Request, res: express.Response, next: express.NextFunction) {
  if (req.session!.userId) {
    res.status(400).send('Not logged out');
  } else {
    return next();
  }
}

export function isValidCred(
    req: express.Request, res: express.Response, next: express.NextFunction) {
  const {username, password} = req.body;
  if (username && password) {
    return next();
  } else {
    res.status(400).send('Bad username or password');
  }
}

export async function isUsernameCollide(
    req: express.Request, res: express.Response, next: express.NextFunction) {
  const {username} = req.body;
  const result = await isCollide(username);
  if (!result) {
    return next();
  } else {
    res.status(400).send('Bad username');
  }
}

export async function isCollide(username: string) {
  const result = await client.execute(
      queries.SELECT_USERSNAME_USERID, [username], {prepare: true});
  return result.rows.length !== 0;
}


// export default = {
//   isLoggedIn,
//   isLoggedOut,
//   isValidCred,
//   isUsernameCollide
// }
