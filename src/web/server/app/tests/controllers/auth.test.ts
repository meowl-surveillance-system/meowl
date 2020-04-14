import * as auth from '../../controllers/auth';
import * as authServices from '../../services/auth';
import axios from 'axios';

jest.mock('axios');

describe('auth', () => {
  const testSessionID = 'yes';
  const testUser = 'controllersTestUser';
  const testPassword = 'password';
  const testEmail = 'test@email.com';
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  describe('rtmpRequest', () => {
    const mockReq: any = () => {
      return {
        sessionID: 'hoh',
        session: { userId: 'hoh' },
      };
    };

    const mockRes: any = () => {
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    it('should return sessionID and userID', async () => {
      const req = mockReq();
      const res = mockRes();
      await auth.rtmpRequest(req, res);
      expect(res.json).toBeCalledWith({
        sessionID: req.sessionID,
        userId: req.session!.userId,
      });
    });

    it('should return 200', async () => {
      const req = mockReq();
      const res = mockRes();
      await auth.rtmpRequest(req, res);
      expect(res.status).toBeCalledWith(200);
    });
  });
  describe('register', () => {
    const mockReq: any = (
      sid: string,
      username: string,
      password: string,
      email: string,
      userId: string
    ) => {
      return {
        sessionID: sid,
        body: {
          username,
          password,
          email,
        },
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

    it('should return 200 when registering a new user', async () => {
      const req = mockReq(testSessionID, testUser, testPassword, testEmail, '');
      const res = mockRes();
      jest
        .spyOn(authServices, 'checkUserExists')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve({rows:[]} as any)
        );
      await auth.register(req, res);
      expect(res.status).toBeCalledWith(200);
    });
    it('should return 400 when attempting to register a user that exists', async () => {
      const req = mockReq(testSessionID, testUser, testPassword, testEmail, '');
      const res = mockRes();
      jest
        .spyOn(authServices, 'checkUserExists')
        .mockImplementationOnce((userId: string) =>
          Promise.resolve({rows:[userId]} as any)
        );
      await auth.register(req, res);
      expect(res.status).toBeCalledWith(400);
    });
  });

  describe('login', () => {
    const mockReq: any = (
      sid: string,
      username: string,
      password: string,
      userId: string
    ) => {
      return {
        sessionID: sid,
        body: {
          username,
          password,
        },
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

    it('should return 200 on a successful login', async () => {
      const req = mockReq(testSessionID, testUser, testPassword, '');
      const res = mockRes();
      await auth.login(req, res);
      expect(res.status).toBeCalledWith(200);
    });

    it('should return 400 on not successful login', async () => {
      const req = mockReq('no', 'noSuchUser', 'whatever', '');
      const res = mockRes();
      await auth.login(req, res);
      expect(res.status).toBeCalledWith(400);
    });
  });
  describe('isLoggedIn', () => {
    const mockReq: any = (userId: string) => {
      return {
        session: { userId },
      };
    };
    const mockRes: any = () => {
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    it('should return 200 and true if logged in', async () => {
      const req = mockReq('endme');
      const res = mockRes();
      await auth.isLoggedIn(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(true);
    });

    it('should return 400 and false if not logged in', async () => {
      const req = mockReq('');
      const res = mockRes();
      await auth.isLoggedIn(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith(false);
    });
  });
  describe('logout', () => {
    const mockReq: any = () => {
      return {
        session: {
          destroy: jest.fn(f => {
            f();
          }),
        },
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

    it('should return 200 on a successful logout', async () => {
      const req = mockReq();
      const res = mockRes();
      await auth.logout(req, res);
      expect(res.status).toBeCalledWith(200);
    });
  });
  describe('rtmpAuthPlay', () => {
    const mockReq: any = (
      sid: string,
      username: string,
      password: string,
      userId: string
    ) => {
      return {
        sessionID: sid,
        body: {
          username,
          password,
        },
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
    const rtmpMockReq: any = (sessionID: string, userId: string) => {
      return {
        body: {
          userId,
          sessionID,
        },
      };
    };
    const rtmpMockRes: any = () => {
      const res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res;
    };

    it('should return 200 if logged in', async () => {
      const req = mockReq(testSessionID, testUser, testPassword, '');
      const res = mockRes();
      await auth.login(req, res);
      expect(res.status).toBeCalledWith(200);
      const rtmpReq = rtmpMockReq(testSessionID, req.session.userId);
      const rtmpRes = rtmpMockRes();
      await auth.rtmpAuthPlay(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(200);
    });
    it('should return 400 if not logged in', async () => {
      const rtmpReq = rtmpMockReq(testSessionID, 'test');
      const rtmpRes = rtmpMockRes();
      await auth.rtmpAuthPlay(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(400);
    });
  });
  describe('rtmpAuthPublish', () => {
    const mockReq: any = (
      sid: string,
      username: string,
      password: string,
      userId: string
    ) => {
      return {
        sessionID: sid,
        body: {
          username,
          password,
        },
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
    const rtmpMockReq: any = (
      sessionID: string,
      userId: string,
      cameraId: string,
      name: string
    ) => {
      return {
        body: {
          userId,
          sessionID,
          cameraId,
          name,
        },
      };
    };
    const rtmpMockRes: any = () => {
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
    it('should return 200 on a successful publish start', async () => {
      const req = mockReq(testSessionID, testUser, testPassword, '');
      const res = mockRes();
      await auth.login(req, res);
      expect(res.status).toBeCalledWith(200);
      mockedAxios.get.mockImplementationOnce(() =>
        Promise.resolve({ status: 200 })
      );
      const mockResults = {
        rows: [{ session: JSON.stringify({ userId: req.session.userId }) }],
      };
      jest
        .spyOn(authServices, 'retrieveSession')
        .mockImplementationOnce((sessionID: string) =>
          Promise.resolve(mockResults as any)
        );
      const rtmpReq = rtmpMockReq(
        testSessionID,
        req.session.userId,
        testCameraId,
        testStreamId
      );
      const rtmpRes = rtmpMockRes();
      await auth.rtmpAuthPublishStart(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(200);
      expect(mockedAxios.get).toHaveBeenLastCalledWith(
        'http://localhost:5000/store/' + rtmpReq.body.name
      );
    });
    it('should return 500 on a unsuccessful rtmp saver call', async () => {
      const req = mockReq(testSessionID, testUser, testPassword, '');
      const res = mockRes();
      await auth.login(req, res);
      expect(res.status).toBeCalledWith(200);
      mockedAxios.get.mockImplementationOnce(() =>
        Promise.resolve({ status: 400 })
      );
      const mockResults = {
        rows: [{ session: JSON.stringify({ userId: req.session.userId }) }],
      };
      jest
        .spyOn(authServices, 'retrieveSession')
        .mockImplementationOnce((sessionID: string) =>
          Promise.resolve(mockResults as any)
        );
      const rtmpReq = rtmpMockReq(
        testSessionID,
        req.session.userId,
        testCameraId,
        testStreamId
      );
      const rtmpRes = rtmpMockRes();
      await auth.rtmpAuthPublishStart(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(500);
      expect(mockedAxios.get).toHaveBeenLastCalledWith(
        'http://localhost:5000/store/' + rtmpReq.body.name
      );
    });
    it('should return 400 if userId does not own cameraId', async () => {
      const req = mockReq(testSessionID, testUser, testPassword, '');
      const res = mockRes();
      await auth.login(req, res);
      expect(res.status).toBeCalledWith(200);
      mockedAxios.get.mockImplementationOnce(() =>
        Promise.resolve({ status: 200 })
      );
      const mockResults = {
        rows: [{ session: JSON.stringify({ userId: req.session.userId }) }],
      };
      jest
        .spyOn(authServices, 'retrieveSession')
        .mockImplementationOnce((sessionID: string) =>
          Promise.resolve(mockResults as any)
        );
      const rtmpReq = rtmpMockReq(
        testSessionID,
        req.session.userId,
        testCameraId,
        testStreamId
      );
      const rtmpRes = rtmpMockRes();
      await auth.rtmpAuthPublishStart(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(200);

      //Submit another publish start to same cameraId but different userId
      const userId = 'randomUserId';
      mockedAxios.get.mockImplementationOnce(() =>
        Promise.resolve({ status: 200 })
      );
      const mockResults2 = { rows: [{ session: JSON.stringify({ userId }) }] };
      jest
        .spyOn(authServices, 'retrieveSession')
        .mockImplementationOnce((sessionID: string) =>
          Promise.resolve(mockResults2 as any)
        );
      const rtmpReq2 = rtmpMockReq(
        testSessionID,
        userId,
        testCameraId,
        testStreamId
      );
      const rtmpRes2 = rtmpMockRes();
      await auth.rtmpAuthPublishStart(rtmpReq2, rtmpRes2);
      expect(rtmpRes2.status).toBeCalledWith(400);
    });
    it('should return 400 if userId of session doesnt match userId in body', async () => {
      const req = mockReq(testSessionID, testUser, testPassword, '');
      const res = mockRes();
      await auth.login(req, res);
      expect(res.status).toBeCalledWith(200);
      mockedAxios.get.mockImplementationOnce(() =>
        Promise.resolve({ status: 200 })
      );
      const mockResults = {
        rows: [{ session: JSON.stringify({ userId: 'wackafboi' }) }],
      };
      jest
        .spyOn(authServices, 'retrieveSession')
        .mockImplementationOnce((sessionID: string) =>
          Promise.resolve(mockResults as any)
        );
      const rtmpReq = rtmpMockReq(
        testSessionID,
        req.session.userId,
        testCameraId,
        testStreamId
      );
      const rtmpRes = rtmpMockRes();
      await auth.rtmpAuthPublishStart(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(400);
    });
    it('should return 200 on a successful publish stop', async () => {
      const req = mockReq(testSessionID, testUser, testPassword, '');
      const res = mockRes();
      await auth.login(req, res);
      expect(res.status).toBeCalledWith(200);
      mockedAxios.get.mockImplementationOnce(() =>
        Promise.resolve({ status: 200 })
      );
      const mockResults = {
        rows: [{ session: JSON.stringify({ userId: req.session.userId }) }],
      };
      jest
        .spyOn(authServices, 'retrieveSession')
        .mockImplementationOnce((sessionID: string) =>
          Promise.resolve(mockResults as any)
        );
      const rtmpReq = rtmpMockReq(
        testSessionID,
        req.session.userId,
        testCameraId,
        testStreamId
      );
      const rtmpRes = rtmpMockRes();
      await auth.rtmpAuthPublishStop(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(200);
      expect(mockedAxios.get).toHaveBeenLastCalledWith(
        'http://localhost:5000/stop/' + rtmpReq.body.name
      );
    });
  });
});
