import { Request, Response } from 'express';
/**
 * Sends a list of streamIds for a cameraId if the user owns the camera
 */
export declare const retrieveStreamIds: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
/**
 * Sends the streamId of a camera if it is live
 */
export declare const retrieveLiveStreamId: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
/**
 * Sends a dictionary of cameraId : streamId for all cameras the user owns that are live
 */
export declare const retrieveLiveCameraStreamIds: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
/**
 * Stores a streamId to respective cameraId from body of request
 */
export declare const storeStreamId: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
/**
 * Sends a list of cameraIds the user owns
 */
export declare const retrieveCameraIds: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<void>;
