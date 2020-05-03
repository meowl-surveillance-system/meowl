import {
  SELECT_GROUPID_USERID,
  SELECT_USERID_GROUPID,
  INSERT_USERID_GROUPID,
  INSERT_GROUPID_USERID,
  SELECT_GROUPUSERS_GROUPID,
} from '../utils/queries';

import { client } from '../utils/client';
import * as apiServices from './api';

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
 * Retrieve all group ids
 * @returns ResultSet - Contains rows of groupIds
 */
export const retrieveGroups = async () => {
  return client.execute(SELECT_GROUPUSERS_GROUPID, [], {
    prepare: true,
  });
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
      const userCameras = await apiServices.retrieveCameraIds(row['user_id']);
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
      const liveStreamIdResult = await apiServices.retrieveLiveStreamId(
        cameraId
      );
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
