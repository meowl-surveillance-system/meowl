import * as apiGroups from '../../controllers/apiGroups';
import * as apiServices from '../../services/api';
import * as apiGroupsServices from '../../services/apiGroups';
import * as authServices from '../../services/auth';

describe('apiGroups', () => {
  const testSessionID = 'yes';
  const testUser = 'controllersTestUser';
  const testPassword = 'password';
  const testEmail = 'test@email.com';
  const testUserId = 'controllersTestUserId';
  const testGroupId = 'controllersTestGroupId';
  describe('addUserGroup', () => {
    const mockReq: any = (groupId: string, username: string) => {
      return {
        body: { username, groupId },
      };
    };
    const mockRes: any = () => {
      const res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res;
    };
    it('should return status 200 on successful add', async () => {
      jest
        .spyOn(authServices, 'retrieveUser')
        .mockImplementationOnce((username: string) => Promise.resolve({rows:[{user_id:testUserId}]} as any));
      jest
        .spyOn(apiGroupsServices, 'addUserGroup')
        .mockImplementationOnce((userId: string, groupId: string) => Promise.resolve());
      const req = mockReq(testGroupId, testUser);
      const res = mockRes();
      await apiGroups.addUserGroup(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith('Successfully added user to group');
    });
    it('should return 500 status if add exception', async () => {
      jest
        .spyOn(authServices, 'retrieveUser')
        .mockImplementationOnce((username: string) => Promise.resolve({rows:[{user_id:testUserId}]} as any));
      jest
        .spyOn(apiGroupsServices, 'addUserGroup')
        .mockImplementationOnce((userId: string, groupId: string) =>
          Promise.reject('Test exception')
        );
      const req = mockReq(testGroupId, testUser);
      const res = mockRes();
      await apiGroups.addUserGroup(req, res);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Server error');
    });
    it('should return 400 status if unable to find user', async () => {
      jest
        .spyOn(authServices, 'retrieveUser')
        .mockImplementationOnce((username: string) => Promise.resolve({rows:[]} as any));
      const req = mockReq(testGroupId, testUser);
      const res = mockRes();
      await apiGroups.addUserGroup(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Unable to find user');
    });
    it('should return 400 status if invalid user', async () => {
      const req = mockReq(testGroupId, '');
      const res = mockRes();
      await apiGroups.addUserGroup(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Not valid username');
    });
  });
  describe('retrieveStreamIdsGroup', () => {
    const mockReq: any = (cameraId: string, userId: string, admin: boolean) => {
      return {
        params: {
          cameraId,
        },
        session: { userId, admin },
      };
    };
    const mockRes: any = () => {
      const res = {
        status: jest.fn(),
        send: jest.fn(),
        json: jest.fn(),
      };
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
    const testCameraId = 'randomCameraId';
    const testStreamIds = ['randomStreamId1', 'randomStreamId2'];
    it('should return testStreamIds list if owns', async () => {
      jest
        .spyOn(apiServices, 'verifyUserCamera')
        .mockImplementationOnce((userId: string, cameraId: string) =>
          Promise.resolve(true)
        );
      jest
        .spyOn(apiGroupsServices, 'verifyUserCameraGroup')
        .mockImplementationOnce((userId: string, cameraId: string) =>
          Promise.resolve(true)
        );
      const mockResults = {
        rows: [{ streamId: testStreamIds[0] }, { streamId: testStreamIds[1] }],
      };
      jest
        .spyOn(apiServices, 'retrieveStreamIds')
        .mockImplementationOnce((cameraId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testCameraId, testUserId, false);
      const res = mockRes();
      await apiGroups.retrieveStreamIdsGroups(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(testStreamIds);
    });
    it('should return testStreamIds list if in same group', async () => {
      jest
        .spyOn(apiServices, 'verifyUserCamera')
        .mockImplementationOnce((userId: string, cameraId: string) =>
          Promise.resolve(false)
        );
      jest
        .spyOn(apiGroupsServices, 'verifyUserCameraGroup')
        .mockImplementationOnce((userId: string, cameraId: string) =>
          Promise.resolve(true)
        );
      const mockResults = {
        rows: [{ streamId: testStreamIds[0] }, { streamId: testStreamIds[1] }],
      };
      jest
        .spyOn(apiServices, 'retrieveStreamIds')
        .mockImplementationOnce((cameraId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testCameraId, testUserId, false);
      const res = mockRes();
      await apiGroups.retrieveStreamIdsGroups(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(testStreamIds);
    });
    it('should return testStreamIds list if admin', async () => {
      jest
        .spyOn(apiServices, 'verifyUserCamera')
        .mockImplementationOnce((userId: string, cameraId: string) =>
          Promise.resolve(false)
        );
      jest
        .spyOn(apiGroupsServices, 'verifyUserCameraGroup')
        .mockImplementationOnce((userId: string, cameraId: string) =>
          Promise.resolve(false)
        );
      const mockResults = {
        rows: [{ streamId: testStreamIds[0] }, { streamId: testStreamIds[1] }],
      };
      jest
        .spyOn(apiServices, 'retrieveStreamIds')
        .mockImplementationOnce((cameraId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testCameraId, testUserId, true);
      const res = mockRes();
      await apiGroups.retrieveStreamIdsGroups(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(testStreamIds);
    });
    it('should return 400 status if invalid cameraId', async () => {
      const req = mockReq('', testUserId, false);
      const res = mockRes();
      await apiGroups.retrieveStreamIdsGroups(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Not valid cameraId');
    });
    it('should return 400 status if user can not view', async () => {
      jest
        .spyOn(apiServices, 'verifyUserCamera')
        .mockImplementationOnce((userId: string, cameraId: string) =>
          Promise.resolve(false)
        );
      const req = mockReq(testCameraId, testUserId, false);
      const res = mockRes();
      await apiGroups.retrieveStreamIdsGroups(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Cant view this camera');
    });
    it('should return 400 status if retrieveStreamIds service call returns undefined', async () => {
      jest
        .spyOn(apiServices, 'verifyUserCamera')
        .mockImplementationOnce((userId: string, cameraId: string) =>
          Promise.resolve(true)
        );
      jest
        .spyOn(apiGroupsServices, 'verifyUserCameraGroup')
        .mockImplementationOnce((userId: string, cameraId: string) =>
          Promise.resolve(true)
        );
      jest
        .spyOn(apiServices, 'retrieveStreamIds')
        .mockImplementationOnce((cameraId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testCameraId, testUserId, false);
      const res = mockRes();
      await apiGroups.retrieveStreamIdsGroups(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith([]);
    });
  });
  describe('getGroups', () => {
    const mockReq: any = () => {}
    const mockRes: any = () => {
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
    it('should return 200 on successful retrieval', async () => {
      const req = mockReq();
      const res = mockRes();
      const mockResults = { rows: [{group_id: 'HIT'}, {group_id: 'ME'}, {group_id: 'ON'}, {group_id: 'GROUND'}]};
      jest.spyOn(apiGroupsServices, 'retrieveGroups').mockImplementationOnce(() => Promise.resolve(mockResults as any));
      await apiGroups.getGroups(req, res);
      expect(res.status).toBeCalledWith(200);
    });
  });
  describe('retrieveUserGroups', () => {
    const mockReq: any = (userId: string) => {
      return {
        session: { userId },
      };
    };
    const mockRes: any = () => {
      const res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res;
    };
    const testGroupIds = [testGroupId, testGroupId + '2'];
    it('should return status 200 and groupIds', async () => {
      const mockResults = { rows: [] as object[] };
      testGroupIds.forEach((key: string, i: number) =>
        mockResults.rows.push({ groupId: key })
      );
      jest
        .spyOn(apiGroupsServices, 'retrieveUserGroups')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testUserId);
      const res = mockRes();
      await apiGroups.retrieveUserGroups(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(testGroupIds);
    });
    it('should return 400 if undefined result', async () => {
      jest
        .spyOn(apiGroupsServices, 'retrieveUserGroups')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testUserId);
      const res = mockRes();
      await apiGroups.retrieveUserGroups(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Can not retrieve user groups');
    });
  });
  describe('retrieveGroupUsers', () => {
    const mockReq: any = (groupId: string) => {
      return {
        params: { groupId },
      };
    };
    const mockRes: any = () => {
      const res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res;
    };
    const testUserIds = [testUserId, testUserId];
    const testUsers = [testUser, testUser];
    beforeAll(() => {
      jest
        .spyOn(authServices, 'retrieveUsernameFromUserId')
        .mockImplementation((userId: string) =>
          Promise.resolve(testUser)
        );
    });
    afterAll(() => {
      jest
        .spyOn(authServices, 'retrieveUsernameFromUserId')
        .mockRestore();
    });
    it('should return status 200 and usernames', async () => {
      const mockResults = { rows: [] as object[] };
      testUserIds.forEach((key: string, i: number) =>
        mockResults.rows.push({ userId: key })
      );
      jest
        .spyOn(apiGroupsServices, 'retrieveGroupUsers')
        .mockImplementationOnce((groupId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testGroupId);
      const res = mockRes();
      await apiGroups.retrieveGroupUsers(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(testUsers);
    });
    it('should return 400 if undefined result', async () => {
      jest
        .spyOn(apiGroupsServices, 'retrieveGroupUsers')
        .mockImplementationOnce((groupId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testGroupId);
      const res = mockRes();
      await apiGroups.retrieveGroupUsers(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Can not retrieve group users');
    });
  });
  describe('retrieveGroupCameras', () => {
    const mockReq: any = (groupId: string) => {
      return {
        params: { groupId },
      };
    };
    const mockRes: any = () => {
      const res = {
        status: jest.fn(),
        send: jest.fn(),
        json: jest.fn(),
      };
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
    const testCameraIds = ['randomCameraId1', 'randomCameraId2'];
    it('should return status 200 and cameraIds', async () => {
      const mockResults = { rows: [] as object[] };
      jest
        .spyOn(apiGroupsServices, 'retrieveGroupCameras')
        .mockImplementationOnce((groupId: string) =>
          Promise.resolve(testCameraIds as any)
        );
      const req = mockReq(testGroupId);
      const res = mockRes();
      await apiGroups.retrieveGroupCameras(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(testCameraIds);
    });
    it('should return 400 if undefined result', async () => {
      jest
        .spyOn(apiGroupsServices, 'retrieveGroupCameras')
        .mockImplementationOnce((groupId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testGroupId);
      const res = mockRes();
      await apiGroups.retrieveGroupCameras(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Unable to retrieve group cameras');
    });
  });
  describe('retrieveUserGroupCameras', () => {
    const mockReq: any = (userId: string) => {
      return {
        session: { userId },
      };
    };
    const mockRes: any = () => {
      const res = {
        status: jest.fn(),
        send: jest.fn(),
        json: jest.fn(),
      };
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
    const testCameraIds = ['randomCameraId1', 'randomCameraId2'];
    it('should return status 200 and cameraIds', async () => {
      jest
        .spyOn(apiGroupsServices, 'retrieveUserGroupCameras')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(testCameraIds as any)
        );
      const req = mockReq(testUserId);
      const res = mockRes();
      await apiGroups.retrieveUserGroupCameras(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(testCameraIds);
    });
    it('should return 400 if undefined result', async () => {
      jest
        .spyOn(apiGroupsServices, 'retrieveUserGroupCameras')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testUserId);
      const res = mockRes();
      await apiGroups.retrieveUserGroupCameras(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Unable to retrieve users group cameras');
    });
  });
  describe('retrieveUserGroupCamerasDict', () => {
    const mockReq: any = (userId: string, admin: boolean) => {
      return {
        session: { userId, admin },
      };
    };
    const mockRes: any = () => {
      const res = {
        status: jest.fn(),
        send: jest.fn(),
        json: jest.fn(),
      };
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
    const testCameraIds = ['randomCameraId1', 'randomCameraId2'];
    const testGroupIds = ['randomGroupId1', 'randomGroupId2'];
    it('should return status 200 and cameraIds', async () => {
      const mockResults = {} as Record<string, string[]>;
      testGroupIds.forEach(
        (key: string, i: number) => (mockResults[key] = testCameraIds)
      );
      jest
        .spyOn(apiGroupsServices, 'retrieveUserGroupCamerasDict')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testUserId, false);
      const res = mockRes();
      await apiGroups.retrieveUserGroupCamerasDict(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(mockResults);
    });
    it('should return 400 if undefined result', async () => {
      jest
        .spyOn(apiGroupsServices, 'retrieveUserGroupCamerasDict')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testUserId, false);
      const res = mockRes();
      await apiGroups.retrieveUserGroupCamerasDict(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Unable to retrieve users group cameras');
    });
    it('should return 200 and call retrieveAllGroupCamerasDict if admin', async () => {
      const mockResults = {} as Record<string, string[]>;
      testGroupIds.forEach(
        (key: string, i: number) => (mockResults[key] = testCameraIds)
      );
      jest
        .spyOn(apiGroupsServices, 'retrieveAllGroupCamerasDict')
        .mockImplementationOnce(() =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testUserId, true);
      const res = mockRes();
      await apiGroups.retrieveUserGroupCamerasDict(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(mockResults);
    });
  });
  describe('retrieveLiveGroupCameraStreamIds', () => {
    const mockReq: any = (userId: string, admin: boolean) => {
      return {
        session: { userId, admin },
      };
    };
    const mockRes: any = () => {
      const res = {
        status: jest.fn(),
        send: jest.fn(),
        json: jest.fn(),
      };
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
    const testCameraIds = ['randomCameraId1', 'randomCameraId2'];
    const testStreamIds = ['randomStreamId1', 'randomStreamId2'];
    it('should return a dictionary of cameraIds to streamIds', async () => {
      const mockResults = {} as Record<string, string>;
      testCameraIds.forEach(
        (key: string, i: number) => (mockResults[key] = testStreamIds[i])
      );
      jest
        .spyOn(apiGroupsServices, 'retrieveLiveGroupCameraStreamIds')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(mockResults as any)
        );
      jest
        .spyOn(apiServices, 'retrieveLiveCameraStreamIds')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testUserId, false);
      const res = mockRes();
      await apiGroups.retrieveLiveGroupCameraStreamIds(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(mockResults);
    });
    it('should return a dictionary of all cameraIds to streamIds if admin', async () => {
      const mockResults = {} as Record<string, string>;
      testCameraIds.forEach(
        (key: string, i: number) => (mockResults[key] = testStreamIds[i])
      );
      jest
        .spyOn(apiGroupsServices, 'retrieveAllLiveGroupCameraStreamIds')
        .mockImplementationOnce(() =>
          Promise.resolve(mockResults as any)
        );
      jest
        .spyOn(apiServices, 'retrieveLiveCameraStreamIds')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testUserId, true);
      const res = mockRes();
      await apiGroups.retrieveLiveGroupCameraStreamIds(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(mockResults);
    });
    it('should return a dictionary of cameraIds to streamIds when groupResult is undefined', async () => {
      const mockResults = {} as Record<string, string>;
      testCameraIds.forEach(
        (key: string, i: number) => (mockResults[key] = testStreamIds[i])
      );
      jest
        .spyOn(apiGroupsServices, 'retrieveLiveGroupCameraStreamIds')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(undefined as any)
        );
      jest
        .spyOn(apiServices, 'retrieveLiveCameraStreamIds')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testUserId, false);
      const res = mockRes();
      await apiGroups.retrieveLiveGroupCameraStreamIds(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(mockResults);
    });
    it('should return a dictionary of cameraIds to streamIds when ownResult is undefined', async () => {
      const mockResults = {} as Record<string, string>;
      testCameraIds.forEach(
        (key: string, i: number) => (mockResults[key] = testStreamIds[i])
      );
      jest
        .spyOn(apiGroupsServices, 'retrieveLiveGroupCameraStreamIds')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(mockResults as any)
        );
      jest
        .spyOn(apiServices, 'retrieveLiveCameraStreamIds')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testUserId, false);
      const res = mockRes();
      await apiGroups.retrieveLiveGroupCameraStreamIds(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(mockResults);
    });
    it('should return 400 status if retrieve undefined', async () => {
      jest
        .spyOn(apiGroupsServices, 'retrieveLiveGroupCameraStreamIds')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(undefined as any)
        );
      jest
        .spyOn(apiServices, 'retrieveLiveCameraStreamIds')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testUserId, false);
      const res = mockRes();
      await apiGroups.retrieveLiveGroupCameraStreamIds(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Unable to retrieve camera streams');
    });
  });
});
