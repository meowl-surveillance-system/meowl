import { Request, Response } from 'express';

import * as apiGroupsServices from '../services/apiGroups';

/**
 * Adds a user to a group
 */
export const addUserGroup = async (req: Request, res: Response) => {
  try {
    await apiGroupsServices.addUserGroup(req.body.userId, req.body.groupId);
    res.status(200).send('OK');
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
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
 * Retrieves userIds in a group
 */
export const retrieveGroupUsers = async (req: Request, res: Response) => {
  const result = await apiGroupsServices.retrieveGroupUsers(req.params.groupId);
  if (result === undefined) {
    res.status(400).send('Can not retrieve group users');
  } else {
    const userIds = result.rows.map(row => {
      const key = Object.keys(row)[0];
      return row[key];
    });
    res.status(200).send(userIds);
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
  const result = await apiGroupsServices.retrieveLiveGroupCameraStreamIds(
    req.session!.userId
  );
  if (result === undefined) {
    res.status(400).send('Unable to retrieve camera streams');
  } else {
    res.status(200).json(result);
  }
};
