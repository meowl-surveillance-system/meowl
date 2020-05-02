import * as apiGroups from '../../controllers/apiGroups';
import * as apiGroupsServices from '../../services/apiGroups';

describe('apiGroups', () => {
  const testSessionID = 'yes';
  const testUser = 'controllersTestUser';
  const testPassword = 'password';
  const testEmail = 'test@email.com';
  const testUserId = 'controllersTestUserId';
  const testGroupId = 'controllersTestGroupId';
  describe('addUserGroup', () => {
    const mockReq: any = (groupId: string, userId: string) => {
      return {
        body: { userId, groupId },
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
        .spyOn(apiGroupsServices, 'addUserGroup')
        .mockImplementationOnce((userId: string, groupId: string) => Promise.resolve());
      const req = mockReq(testGroupId, testUserId);
      const res = mockRes();
      await apiGroups.addUserGroup(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith('OK');
    });
    it('should return 500 status if add exception', async () => {
      jest
        .spyOn(apiGroupsServices, 'addUserGroup')
        .mockImplementationOnce((userId: string, groupId: string) =>
          Promise.reject('Test exception')
        );
      const req = mockReq(testGroupId, testUserId);
      const res = mockRes();
      await apiGroups.addUserGroup(req, res);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Server error');
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
    const testUserIds = [testUserId, testUserId + '2'];
    it('should return status 200 and userIds', async () => {
      const mockResults = { rows: [] as object[] };
      testUserIds.forEach((key: string, i: number) =>
        mockResults.rows.push({ userId: key })
      );
      jest
        .spyOn(apiGroupsServices, 'retrieveGroupUsers')
        .mockImplementationOnce((groupId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testUserId);
      const res = mockRes();
      await apiGroups.retrieveGroupUsers(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(testUserIds);
    });
    it('should return 400 if undefined result', async () => {
      jest
        .spyOn(apiGroupsServices, 'retrieveGroupUsers')
        .mockImplementationOnce((groupId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testUserId);
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
  describe('retrieveLiveGroupCameraStreamIds', () => {
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
      const req = mockReq(testUserId);
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
      const req = mockReq(testUserId);
      const res = mockRes();
      await apiGroups.retrieveLiveGroupCameraStreamIds(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Unable to retrieve camera streams');
    });
  });
});
