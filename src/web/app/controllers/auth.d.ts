import { Request, Response } from 'express';
/**
 * Sends 200 if session of user contains its userId, 400 otherwise
 */
export declare const isLoggedIn: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => void;
/**
 * Stores a user's credentials if username does not exist
 */
export declare const register: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
/**
 * Checks if username and hashed password from body are valid and updates session to contain userId if so
 */
export declare const login: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
/**
 * Destroys session
 */
export declare const logout: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => void;
/**
 * Sends sessionID and userID of active session in response
 */
export declare const rtmpRequest: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => void;
/**
 * Sends 200 if userId and sessionID in body of request match and session is still valid, 400 otherwise
 */
export declare const rtmpAuthPlay: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
/**
 * Calls rtmpAuthPublish with true when streaming starts
 */
export declare const rtmpAuthPublishStart: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
/**
 * Calls rtmpAuthPublish with false when streaming stops
 */
export declare const rtmpAuthPublishStop: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
