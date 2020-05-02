import express from 'express';

import { isLoggedIn, isAdmin } from '../middlewares/authChecks';

import { client } from '../utils/client';
import * as apiGroupsController from '../controllers/apiGroups';

const app = express();

/**
 * Add a user to group, admin locked
 */
app.post(
  '/addUserGroup',
  [isLoggedIn, isAdmin],
  (req: express.Request, res: express.Response) => {
    apiGroupsController.addUserGroup(req, res);
  }
);

/**
 * Sends a list of groupIds the logged in user is in
 */
app.get(
  '/getUserGroups',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    apiGroupsController.retrieveUserGroups(req, res);
  }
);

/**
 * Sends a list of userIds in a group
 */
app.get(
  '/getGroupUsers/:groupId',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    apiGroupsController.retrieveGroupUsers(req, res);
  }
);

/**
 * Sends a list of cameraIds in a group, admin locked
 */
app.get(
  '/getGroupCameras/:groupId',
  [isLoggedIn, isAdmin],
  async (req: express.Request, res: express.Response) => {
    apiGroupsController.retrieveGroupCameras(req, res);
  }
);

/**
 * Sends a list of cameraIds in groups the user is in
 */
app.get(
  '/getUserGroupCameras',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    apiGroupsController.retrieveUserGroupCameras(req, res);
  }
);

/**
 * Sends a dictionary of cameraId:streamId for all cameras in groups the user is in
 */
app.get(
  '/getLiveGroupCameraStreamIds',
  isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    apiGroupsController.retrieveLiveGroupCameraStreamIds(req, res);
  }
);

module.exports = app;
