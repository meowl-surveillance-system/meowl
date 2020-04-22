import {
  SELECT_CAMERAID,
  SELECT_USERID_CAMERAID,
  SELECT_CAMERAID_USERID,
  SELECT_LIVE_CAMERAID,
  SELECT_STREAMID_METADATA,
  SELECT_CAMERAID_STREAMID,
  SELECT_CAMERAID_STREAMID_SINGLE,
  SELECT_GROUPID_USERID,
  SELECT_USERID_GROUPID,
  INSERT_USERID_GROUPID,
  INSERT_GROUPID_USERID,
  INSERT_CAMERAID_STREAMID,
  INSERT_USERID_CAMERAID,
  INSERT_CAMERAID_USERID,
  INSERT_CAMERAID_LIVE,
} from '../utils/queries';

import { client } from '../utils/client';

/**
 * Retrieve streamIds from database
 * @param cameraId - The cameraId that spawned the streamIds
 * @returns ResultSet - Contains rows of streamIds belonging to cameraId
 */
export const retrieveStreamIds = async (cameraId: string) => {
  return client.execute(SELECT_CAMERAID_STREAMID, [cameraId], {
    prepare: true,
  });
};

/**
 * Retrieve streamId from camera if live from database
 * @param cameraId - The cameraId that may be live
 * @returns ResultSet - Contains row of streamId belonging to cameraId, undefined if camera not live
 */
export const retrieveLiveStreamId = async (cameraId: string) => {
  const result = await client.execute(SELECT_LIVE_CAMERAID, [cameraId], {
    prepare: true,
  });
  if (result.rows.length === 0 || result.rows[0]['live'] !== true) {
    return undefined;
  }

  return client.execute(SELECT_CAMERAID_STREAMID_SINGLE, [cameraId], {
    prepare: true,
  });
};

/**
 * Retrieve all streamId from camera if live belonging to user
 * @param userId - userId of user
 * @returns Record<string, string> - Contains mapping of streamId belonging to cameraId, undefined if user does not own cameras
 */
export const retrieveLiveCameraStreamIds = async (userId: string) => {
  const camerasResult = await retrieveCameraIds(userId);
  if (camerasResult === undefined || camerasResult.rows.length === 0) {
    return undefined;
  }
  const liveCameras = camerasResult.rows.reduce(
    async (oldCollection: Promise<Record<string, string>>, row: any) => {
      const collection = await oldCollection;
      const liveStreamIdResult = await retrieveLiveStreamId(row['camera_id']);
      if (
        liveStreamIdResult !== undefined &&
        liveStreamIdResult.rows.length > 0
      ) {
        collection[row['camera_id']] = liveStreamIdResult.rows[0]['stream_id'];
      }
      return collection;
    },
    new Promise((resolve, reject) => resolve({}))
  );
  return liveCameras;
};

/**
 * Store streamId in database
 * @param cameraId - The cameraId of the camera that streamed
 * @param streamId - The streamId
 */
export const storeStreamId = async (cameraId: string, streamId: string) => {
  const params = [cameraId, streamId, Date.now()];
  const result = await client.execute(SELECT_CAMERAID_STREAMID, [cameraId], {
    prepare: true,
  });
  if (!result.rows.some(element => element['stream_id'] === streamId)) {
    await client.execute(INSERT_CAMERAID_STREAMID, params, { prepare: true });
  }
};

/**
 * Update if camera is live in database
 * @param cameraId - The cameraId of the camera that streamed
 * @param live - Whether the camera started or stopped streaming
 */
export const updateCameraLive = async (cameraId: string, live: boolean) => {
  const params = [cameraId, live];
  await client.execute(INSERT_CAMERAID_LIVE, params, { prepare: true });
};

/**
 * Verify camera belongs to user
 * @param cameraId - The cameraId of the camera
 * @param userId - The user id of the user
 * @returns boolean - True if userId owns cameraId
 */
export const verifyUserCamera = async (userId: string, cameraId: string) => {
  const result = await client.execute(SELECT_USERID_CAMERAID, [cameraId], {
    prepare: true,
  });
  if (result.rows.length === 0) {
    return true;
  } else {
    return result.rows[0]['user_id'] === userId;
  }
};

/**
 * Assign camera to user
 * @param cameraId - The cameraId of the camera
 * @param userId - The user id of the user
 */
export const addUserCamera = async (userId: string, cameraId: string) => {
  const params = [userId, cameraId];
  await client.execute(INSERT_USERID_CAMERAID, params, { prepare: true });
  await client.execute(INSERT_CAMERAID_USERID, params, { prepare: true });
};

/**
 * Retrieve cameraIds from database that belong to user
 * @param userId - The user id of the user
 * @returns ResultSet - Contains rows of cameraIds belonging to userId
 */
export const retrieveCameraIds = async (userId: string) => {
  return client.execute(SELECT_CAMERAID_USERID, [userId], {
    prepare: true,
  });
};

/**
 * Assign user to group
 * @param userId - The userId of the user
 * @param groupId - The groupId of the group
 */
export const addUserGroup = async (userId: string, groupId: string) => {
  const params = [userId, groupId];
  await client.execute(INSERT_USERID_GROUPID, params, { prepare: true });
  await client.execute(INSERT_GROUPID_USERID, params, { prepare: true });
};

/**
 * Retrieve groupIds from database that user belongs to
 * @param userId - The user id of the user
 * @returns ResultSet - Contains rows of groupIds belonging to userId
 */
export const retrieveUserGroups = async (userId: string) => {
  return client.execute(SELECT_GROUPID_USERID, [userId], {
    prepare: true,
  });
};

/**
 * Retrieve userIds from database that belong in groupId
 * @param groupId - The group id of the group
 * @returns ResultSet - Contains rows of userIds belonging to groupId
 */
export const retrieveGroupUsers = async (groupId: string) => {
  return client.execute(SELECT_USERID_GROUPID, [groupId], {
    prepare: true,
  });
};

/**
 * Retrieve cameraIds from users in database that belong in groupId
 * @param groupId - The group id of the group
 * @returns Array<string> - Contains cameraIds of users belonging to groupId
 */
export const retrieveGroupCameras = async (groupId: string) => {
  const groupUsers = await retrieveGroupUsers(groupId);
  if (groupUsers === undefined || groupUsers.rows.length === 0) {
    return undefined;
  }
  const groupCameras = groupUsers.rows.reduce(
    async (oldCollection: Promise<string[]>, row: any) => {
      const collection = await oldCollection;
      const userCameras = await retrieveCameraIds(row['user_id']);
      if (userCameras !== undefined && userCameras.rows.length > 0) {
        collection.push(
          ...userCameras.rows.map((row: any) => {
            return row['camera_id'];
          })
        );
      }
      return collection;
    },
    new Promise((resolve, reject) => resolve([]))
  );
  return groupCameras;
};

/**
 * Retrieve cameraIds from database that userId can view in all groups
 * @param userId - The user id of the user
 * @returns Array<string> - Contains cameraIds of users belonging to groups userId belongs to
 */
export const retrieveUserGroupCameras = async (userId: string) => {
  const userGroups = await retrieveUserGroups(userId);
  if (userGroups === undefined || userGroups.rows.length === 0) {
    return undefined;
  }
  const userCameras = userGroups.rows.reduce(
    async (oldCollection: Promise<string[]>, row: any) => {
      const collection = await oldCollection;
      const groupCameras = await retrieveGroupCameras(row['group_id']);
      if (groupCameras !== undefined) {
        collection.push(...groupCameras);
      }
      return collection;
    },
    new Promise((resolve, reject) => resolve([]))
  );
  return userCameras;
};

/**
 * Retrieve all streamId from camera if live belonging to users groups
 * @param userId - userId of user
 * @returns Record<string, string> - Contains mapping of streamId belonging to cameraId, undefined if user has no cameras or no cameras in group
 */
export const retrieveLiveGroupCameraStreamIds = async (userId: string) => {
  const camerasResult = await retrieveUserGroupCameras(userId);
  if (camerasResult === undefined || camerasResult.length === 0) {
    return undefined;
  }
  const liveCameras = camerasResult.reduce(
    async (
      oldCollection: Promise<Record<string, string>>,
      cameraId: string
    ) => {
      const collection = await oldCollection;
      const liveStreamIdResult = await retrieveLiveStreamId(cameraId);
      if (
        liveStreamIdResult !== undefined &&
        liveStreamIdResult.rows.length > 0
      ) {
        collection[cameraId] = liveStreamIdResult.rows[0]['stream_id'];
      }
      return collection;
    },
    new Promise((resolve, reject) => resolve({}))
  );
  return liveCameras;
};
