import * as api from '../../controllers/api';
import * as apiServices from '../../services/api';

describe('api', () => {
  const testSessionID = 'yes';
  const testUser = 'controllersTestUser';
  const testPassword = 'password';
  const testEmail = 'test@email.com';
  const testUserId = 'controllersTestUserId';
  describe('retrieveStreamIds', () => {
    const mockReq: any = (cameraId: string, userId: string) => {
      return {
        params: {
          cameraId,
        },
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
    const testCameraId = 'randomCameraId';
    const testStreamIds = ['randomStreamId1', 'randomStreamId2'];
    it('should return testStreamIds list', async () => {
      jest
        .spyOn(apiServices, 'verifyUserCamera')
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
      const req = mockReq(testCameraId, testUserId);
      const res = mockRes();
      await api.retrieveStreamIds(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(testStreamIds);
    });
    it('should return 400 status if user can not view', async () => {
      jest
        .spyOn(apiServices, 'verifyUserCamera')
        .mockImplementationOnce((userId: string, cameraId: string) =>
          Promise.resolve(false)
        );
      const req = mockReq(testCameraId, testUserId);
      const res = mockRes();
      await api.retrieveStreamIds(req, res);
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
        .spyOn(apiServices, 'retrieveStreamIds')
        .mockImplementationOnce((cameraId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testCameraId, testUserId);
      const res = mockRes();
      await api.retrieveStreamIds(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Invalid cameraId');
    });
  });
  describe('retrieveLiveStreamId', () => {
    const mockReq: any = (cameraId: string) => {
      return {
        params: {
          cameraId,
        },
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
    const testStreamId = 'randomStreamId';
    it('should return testStreamIds list', async () => {
      const mockResults = { rows: [{ streamId: testStreamId }] };
      jest
        .spyOn(apiServices, 'retrieveLiveStreamId')
        .mockImplementationOnce((cameraId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testCameraId);
      const res = mockRes();
      await api.retrieveLiveStreamId(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(testStreamId);
    });
    it('should return 400 status if user can not view', async () => {
      jest
        .spyOn(apiServices, 'retrieveLiveStreamId')
        .mockImplementationOnce((cameraId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testCameraId);
      const res = mockRes();
      await api.retrieveLiveStreamId(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Invalid cameraId');
    });
  });
  describe('retrieveLiveCameraStreamIds', () => {
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
      const mockResults = {} as any;
      testCameraIds.forEach(
        (key: string, i: number) => (mockResults[key] = testStreamIds[i])
      );
      jest
        .spyOn(apiServices, 'retrieveLiveCameraStreamIds')
        .mockImplementationOnce((cameraId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testUserId);
      const res = mockRes();
      await api.retrieveLiveCameraStreamIds(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(mockResults);
    });
    it('should return 400 status if retrieve undefined', async () => {
      jest
        .spyOn(apiServices, 'retrieveLiveCameraStreamIds')
        .mockImplementationOnce((cameraId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testUserId);
      const res = mockRes();
      await api.retrieveLiveCameraStreamIds(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Unable to retrieve camera streams');
    });
  });
  describe('storeStreamId', () => {
    const mockReq: any = (cameraId: string, streamId: string) => {
      return {
        body: { cameraId, streamId },
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
    const testCameraId = 'randomCameraId';
    const testStreamId = 'randomStreamId';
    it('should return status 200 on successful store', async () => {
      jest
        .spyOn(apiServices, 'storeStreamId')
        .mockImplementationOnce((cameraId: string) => Promise.resolve());
      const req = mockReq(testCameraId, testStreamId);
      const res = mockRes();
      await api.storeStreamId(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith('OK');
    });
    it('should return 500 status if store exception', async () => {
      jest
        .spyOn(apiServices, 'storeStreamId')
        .mockImplementationOnce((cameraId: string) =>
          Promise.reject('Test exception')
        );
      const req = mockReq(testCameraId, testStreamId);
      const res = mockRes();
      await api.storeStreamId(req, res);
      expect(res.status).toBeCalledWith(500);
      expect(res.send).toBeCalledWith('Server error');
    });
  });
  describe('retrieveCameraIds', () => {
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
    const testCameraIds = ['randomCameraId1', 'randomCameraId2'];
    it('should return status 200 and cameraIds', async () => {
      const mockResults = { rows: [] as object[] };
      testCameraIds.forEach((key: string, i: number) =>
        mockResults.rows.push({ cameraId: key })
      );
      jest
        .spyOn(apiServices, 'retrieveCameraIds')
        .mockImplementationOnce((cameraId: string) =>
          Promise.resolve(mockResults as any)
        );
      const req = mockReq(testUserId);
      const res = mockRes();
      await api.retrieveCameraIds(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.send).toBeCalledWith(testCameraIds);
    });
    it('should return 400 if undefined result', async () => {
      jest
        .spyOn(apiServices, 'retrieveCameraIds')
        .mockImplementationOnce((cameraId: string) =>
          Promise.resolve(undefined as any)
        );
      const req = mockReq(testUserId);
      const res = mockRes();
      await api.retrieveCameraIds(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.send).toBeCalledWith('Can not retrieve cameras');
    });
  });
});
