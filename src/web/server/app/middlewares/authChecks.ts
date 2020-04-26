import express from 'express';

import { isCollideHelper } from './helpers';

/**
 * Checks if a user is already logged in
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to be sent
 * @param next - The next middleware in the chain
 */
export function isLoggedIn(
  req: Express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.session!.userId) {
    return next();
  } else {
    res.status(400).send('Not logged in');
  }
}

/**
 * Checks if a user is logged out
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to be sent
 * @param next - The next middleware in the chain
 */
export function isLoggedOut(
  req: Express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.session!.userId) {
    res.status(400).send('Not logged out');
  } else {
    return next();
  }
}

/**
 * Checks is username or password is empty
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to be sent
 * @param next - The next middleware in the chain
 */
export function isValidCred(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { username, password } = req.body;
  if (username && password) {
    return next();
  } else {
    res.status(400).send('Bad username or password');
  }
}

/**
 * Checks if username already exists in database
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to tbe sent
 * @param next - The next middleware in the chain
 */
export async function isUsernameCollide(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { username } = req.body;
  const result = await isCollideHelper(username);
  if (!result) {
    return next();
  } else {
    res.status(400).send('Bad username');
  }
}

/**
 * Checks if the user making the request is an admin
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to be sent
 * @param next - The next middleware in the chain
 */
export async function isAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.session!.admin) {
    return next();
  } else {
    res.status(403).send('Not an admin');
  }
}
