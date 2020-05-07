import { Request, Response } from 'express';

import * as authServices from '../services/auth';
import * as apiGroupsServices from '../services/apiGroups';
import * as apiServices from '../services/api';

/**
 * Adds a user to a group
 */
export const addUserGroup = async (req: Request, res: Response) => {
  try {
    // checks if null/empty
    if (!req.body.username) {
      res.status(400).send('Not valid username');
    } else if (!req.body.groupId) {
      res.status(400).send('Not valid groupId');
    } else {
      const userResult = await authServices.retrieveUser(req.body.username);
      if (userResult === undefined || userResult.rows.length < 1) {
        res.status(400).send('Unable to find user');
      } else {
        await apiGroupsServices.addUserGroup(
          userResult.rows[0].user_id,
          req.body.groupId
        );
        res.status(200).send('Successfully added user to group');
      }
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

/**
 * Sends a list of streamIds for a cameraId if the user owns the camera or is in its group
 */
export const retrieveStreamIdsGroups = async (req: Request, res: Response) => {
  // checks if null/empty
  if (!req.params.cameraId) {
    res.status(400).send('Not valid cameraId');
  } else {
    const isOwner = await apiServices.verifyUserCamera(
      req.session!.userId,
      req.params.cameraId
    );
    const isInGroup = await apiGroupsServices.verifyUserCameraGroup(
      req.session!.userId,
      req.params.cameraId
    );
    if (isOwner || isInGroup || req.session!.admin) {
      const cameraId = req.params.cameraId;
      const result = await apiServices.retrieveStreamIds(cameraId);
      if (result === undefined) {
        res.status(400).json([]);
      } else {
        const streamIds = result.rows.map(row => {
          const key = Object.keys(row)[0];
          return row[key];
        });
        console.log(streamIds);
        res.status(200).json(streamIds);
      }
    } else {
      res.status(400).send('Cant view this camera');
    }
  }
};

/**
 * Retrieve all groups
 */
export const getGroups = async (req: Request, res: Response) => {
  try {
    const groupsResult = await apiGroupsServices.retrieveGroups();
    const groupIds = groupsResult.rows.map(row => {
      return row.group_id;
    });
    res.status(200).json(groupIds);
  } catch (e) {
    console.error(e);
    res.status(500).json('Server error');
  }
};

/**
 * Retrieves groups a user is in
 */
export const retrieveUserGroups = async (req: Request, res: Response) => {
  const result = await apiGroupsServices.retrieveUserGroups(
    req.session!.userId
  );
  if (result === undefined) {
    res.status(400).send('Can not retrieve user groups');
  } else {
    const groupIds = result.rows.map(row => {
      const key = Object.keys(row)[0];
      return row[key];
    });
    res.status(200).send(groupIds);
  }
};

/**
 * Retrieves usernames in a group
 */
export const retrieveGroupUsers = async (req: Request, res: Response) => {
  const result = await apiGroupsServices.retrieveGroupUsers(req.params.groupId);
  if (result === undefined) {
    res.status(400).send('Can not retrieve group users');
  } else {
    const usernames = await Promise.all(
      result.rows.map(async row => {
        const key = Object.keys(row)[0];
        return authServices.retrieveUsernameFromUserId(row[key]);
      })
    );
    res.status(200).send(usernames);
  }
};

/**
 * Retrieves all cameraIds belonging to users in a group
 */
export const retrieveGroupCameras = async (req: Request, res: Response) => {
  const result = await apiGroupsServices.retrieveGroupCameras(
    req.params.groupId
  );
  if (result === undefined) {
    res.status(400).send('Unable to retrieve group cameras');
  } else {
    res.status(200).json(result);
  }
};

/**
 * Sends a dictionary of groupId : cameraId[] for all cameraIds belonging to users in a group
 */
export const retrieveUserGroupCamerasDict = async (
  req: Request,
  res: Response
) => {
  let result;
  if (req.session!.admin) {
    result = await apiGroupsServices.retrieveAllGroupCamerasDict();
  } else {
    result = await apiGroupsServices.retrieveUserGroupCamerasDict(
      req.session!.userId
    );
  }
  if (result === undefined) {
    res.status(400).send('Unable to retrieve users group cameras');
  } else {
    res.status(200).json(result);
  }
};
/**
 * Retrieves all cameraIds in groups a user is in
 */
export const retrieveUserGroupCameras = async (req: Request, res: Response) => {
  const result = await apiGroupsServices.retrieveUserGroupCameras(
    req.session!.userId
  );
  if (result === undefined) {
    res.status(400).send('Unable to retrieve users group cameras');
  } else {
    res.status(200).json(result);
  }
};

/**
 * Sends a dictionary of cameraId : streamId for all cameras in groups the user is in
 */
export const retrieveLiveGroupCameraStreamIds = async (
  req: Request,
  res: Response
) => {
  let groupResult;
  if (req.session!.admin) {
    groupResult = await apiGroupsServices.retrieveAllLiveGroupCameraStreamIds();
  } else {
    groupResult = await apiGroupsServices.retrieveLiveGroupCameraStreamIds(
      req.session!.userId
    );
  }
  const ownResult = await apiServices.retrieveLiveCameraStreamIds(
    req.session!.userId
  );
  if (groupResult === undefined) {
    if (ownResult === undefined) {
      res.status(400).send('Unable to retrieve camera streams');
    } else {
      res.status(200).json(ownResult);
    }
  } else {
    Object.assign(groupResult, ownResult);
    res.status(200).json(groupResult);
  }
};
