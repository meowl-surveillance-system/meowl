/// <reference types="express-serve-static-core" />
/// <reference types="express-session" />
import express from 'express';
/**
 * Checks if a user is already logged in
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to be sent
 * @param next - The next middleware in the chain
 */
export declare function isLoggedIn(req: Express.Request, res: express.Response, next: express.NextFunction): void;
/**
 * Checks if a user is logged out
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to be sent
 * @param next - The next middleware in the chain
 */
export declare function isLoggedOut(req: Express.Request, res: express.Response, next: express.NextFunction): void;
/**
 * Checks is username or password is empty
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to be sent
 * @param next - The next middleware in the chain
 */
export declare function isValidCred(req: express.Request, res: express.Response, next: express.NextFunction): void;
/**
 * Checks if username already exists in database
 * @param req - The incoming HTTP request
 * @param res - The HTTP response to tbe sent
 * @param next - The next middleware in the chain
 */
export declare function isUsernameCollide(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
