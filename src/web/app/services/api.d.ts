/**
 * Retrieve streamIds from database
 * @param cameraId - The cameraId that spawned the streamIds
 * @returns ResultSet - Contains rows of streamIds belonging to cameraId
 */
export declare const retrieveStreamIds: (cameraId: string) => Promise<import("cassandra-driver").types.ResultSet>;
/**
 * Retrieve streamId from camera if live from database
 * @param cameraId - The cameraId that may be live
 * @returns ResultSet - Contains row of streamId belonging to cameraId, undefined if camera not live
 */
export declare const retrieveLiveStreamId: (cameraId: string) => Promise<import("cassandra-driver").types.ResultSet | undefined>;
/**
 * Retrieve all streamId from camera if live belonging to user
 * @param userId - userId of user
 * @returns Record<string, string> - Contains mapping of streamId belonging to cameraId, undefined if user does not own cameras
 */
export declare const retrieveLiveCameraStreamIds: (userId: string) => Promise<Record<string, string> | undefined>;
/**
 * Store streamId in database
 * @param cameraId - The cameraId of the camera that streamed
 * @param streamId - The streamId
 */
export declare const storeStreamId: (cameraId: string, streamId: string) => Promise<void>;
/**
 * Update if camera is live in database
 * @param cameraId - The cameraId of the camera that streamed
 * @param live - Whether the camera started or stopped streaming
 */
export declare const updateCameraLive: (cameraId: string, live: boolean) => Promise<void>;
/**
 * Verify camera belongs to user
 * @param cameraId - The cameraId of the camera
 * @param userId - The user id of the user
 * @returns boolean - True if userId owns cameraId
 */
export declare const verifyUserCamera: (userId: string, cameraId: string) => Promise<boolean>;
/**
 * Assign camera to user
 * @param cameraId - The cameraId of the camera
 * @param userId - The user id of the user
 */
export declare const addUserCamera: (userId: string, cameraId: string) => Promise<void>;
/**
 * Retrieve cameraIds from database that belong to user
 * @param userId - The user id of the user
 * @returns ResultSet - Contains rows of cameraIds belonging to userId
 */
export declare const retrieveCameraIds: (userId: string) => Promise<import("cassandra-driver").types.ResultSet>;
