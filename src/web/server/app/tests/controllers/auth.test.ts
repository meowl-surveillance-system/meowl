import * as auth from '../../controllers/auth';
import * as authServices from '../../services/auth';
import * as apiServices from '../../services/api';
import * as mailer from '../../utils/mailer';
import * as settings from '../../utils/settings';
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
      username: string,
      password: string,
      email: string,
      userId: string
    ) => {
      return {
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
      const checkReq = mockReq(testUser, testPassword, testEmail, '');
      const checkRes = mockRes();
      await auth.login(checkReq, checkRes);
      if (checkRes.status.mock.calls[0][0] === 200) {
        //mock storing user if already exists
        jest
          .spyOn(authServices, 'addUserToPendingAccounts')
          .mockImplementationOnce(
            (
              userId: string,
              email: string,
              username: string,
              password: string
            ) => Promise.resolve()
          );
      }
      const req = mockReq(testUser, testPassword, testEmail, '');
      const res = mockRes();
      jest
        .spyOn(authServices, 'checkUserExists')
        .mockImplementationOnce((userId: string) => Promise.resolve(false));
      await auth.register(req, res);
      expect(res.status).toBeCalledWith(200);
    });
    it('should return 400 when attempting to register a user that exists', async () => {
      const req = mockReq(testSessionID, testUser, testPassword, testEmail, '');
      const res = mockRes();
      jest
        .spyOn(authServices, 'checkUserExists')
        .mockImplementationOnce((userId: string) => Promise.resolve(true));
      await auth.register(req, res);
      expect(res.status).toBeCalledWith(400);
    });
  });

  describe('approveRegistration', () => {
    const mockReq: any = (username: string) => {
      return {
        body: { username },
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
    beforeEach(() => {
      jest
        .spyOn(authServices, 'approveRegistration')
        .mockImplementationOnce(
          (userId: string, email: string, username: string, password: string) =>
            Promise.resolve()
        );
      jest
        .spyOn(authServices, 'removePendingAccount')
        .mockImplementationOnce((username: string) => Promise.resolve());
    });
    it('should return 200 when a user registration is approved', async () => {
      const req = mockReq(testUser);
      const res = mockRes();
      jest
        .spyOn(authServices, 'retrievePendingAccount')
        .mockImplementationOnce((username: string) =>
          Promise.resolve({ rows: [testUser] } as any)
        );
      await auth.approveRegistration(req, res);
      expect(res.status).toBeCalledWith(200);
    });
    it('should return 400 when pending account does not exist', async () => {
      const req = mockReq(testUser);
      const res = mockRes();
      jest
        .spyOn(authServices, 'retrievePendingAccount')
        .mockImplementationOnce((username: string) =>
          Promise.resolve({ rows: [undefined] } as any)
        );
      await auth.approveRegistration(req, res);
      expect(res.status).toBeCalledWith(400);
    });
  });

  describe('rejectRegistration', () => {
    const mockReq: any = (username: string) => {
      return {
        body: { username },
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
    beforeEach(() => {
      jest
        .spyOn(authServices, 'removePendingAccount')
        .mockImplementationOnce((username: string) => Promise.resolve());
    });
    it('should return 200 when registration is rejected', async () => {
      const req = mockReq(testUser);
      const res = mockRes();
      jest
        .spyOn(authServices, 'retrievePendingAccount')
        .mockImplementationOnce((username: string) =>
          Promise.resolve({ rows: [testUser] } as any)
        );
      await auth.rejectRegistration(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    it('should return 400 when pending account does not exist', async () => {
      const req = mockReq(testUser);
      const res = mockRes();
      jest
        .spyOn(authServices, 'retrievePendingAccount')
        .mockImplementationOnce((username: string) =>
          Promise.resolve({ rows: [undefined] } as any)
        );
      await auth.rejectRegistration(req, res);
      expect(res.status).toBeCalledWith(400);
    });
  });
  describe('beginPasswordReset', () => {
    const mockReq: any = (username: string) => {
      return {
        body: {
          username,
        }
      }
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
    it('should return 200 on successful email and userId retrieval', async () => {
      const req = mockReq(testUser);
      const res = mockRes();
      jest.spyOn(authServices, 'retrieveUserIdAndEmail')
      .mockImplementationOnce((username: string) => Promise.resolve({ rows: [testUser] } as any));
      jest.spyOn(authServices, 'storeResetToken').mockImplementationOnce((token: string, userId: string) => Promise.resolve());
      jest.spyOn(mailer, 'sendEmail').mockImplementationOnce((recipient: string, token: string) => Promise.resolve());
      await auth.beginPasswordReset(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    it('should return 400 on unsuccessful email and userId retrieval', async () => {
      const req = mockReq(testUser);
      const res = mockRes();
      jest.spyOn(authServices, 'retrieveUserIdAndEmail')
      .mockImplementationOnce((username: string) => Promise.resolve({ rows: [] } as any));
      await auth.beginPasswordReset(req, res);
      expect(res.status).toHaveBeenLastCalledWith(400);
    });
  });
  describe('verifyToken', () => {
    const mockReq: any = (resetToken: string) => {
      return {
        body: {
          resetToken,
        }
      }
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
    it('should return 200 if a token is valid', async () => {
      const req = mockReq('good_token');
      const res = mockRes();
      jest.spyOn(authServices, 'verifyToken').mockImplementationOnce((token: string) => Promise.resolve(true));
      await auth.verifyToken(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    it('should return 400 if a token is not valid', async () => {
      const req = mockReq('bad_token');
      const res = mockRes();
      jest.spyOn(authServices, 'verifyToken').mockImplementationOnce((token: string) => Promise.resolve(false));
      await auth.verifyToken(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
  describe("submitPasswordReset", () => {
    const mockReq: any = (password: string, resetToken: string) => {
      return {
        body: {
          password, 
          resetToken
        }
      }
    };
    const mockRes: any = () => {
      const res = {
        status: jest.fn(),
        json: jest.fn()
      };
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    }
    it('should return 400 if password is too short', async () => {
      const req = mockReq('yes', 'anything');
      const res = mockRes();
      await auth.submitPasswordReset(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith('Password is too short');
    });
  });
  describe('getPendingAccounts', () => {
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
      const rows = [{username: 'IT'}, {username: 'WAS'}, {username: 'I'}, {username: 'DIO'}];
      jest.spyOn(authServices, 'retrievePendingAccounts').mockImplementationOnce(() => Promise.resolve(rows as any));
      await auth.getPendingAccounts(req, res);
      expect(res.status).toBeCalledWith(200);
    });
  });
  describe('getUsernames', () => {
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
      const rows = [{username: 'KORE'}, {username: 'GA'}, {username: 'REQUIEM'}, {username: 'DA'}];
      jest.spyOn(authServices, 'retrieveUsernames').mockImplementationOnce(() => Promise.resolve(rows as any));
      await auth.getUsernames(req, res);
      expect(res.status).toBeCalledWith(200);
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
    beforeEach(() => {
      jest
        .spyOn(authServices, 'retrieveUser')
        .mockImplementationOnce((username: string) =>
          Promise.resolve({ rows: [testUser] } as any)
        );
    });
    it('should return 200 on a successful login', async () => {
      const req = mockReq(testSessionID, testUser, testPassword, '');
      const res = mockRes();
      jest
        .spyOn(authServices, 'compareHash')
        .mockImplementationOnce((password: string, hash: string) =>
          Promise.resolve(true)
        );
      jest
        .spyOn(authServices, 'updateSessionId')
        .mockImplementationOnce((sid: any, userId: string, username: string) =>
          Promise.resolve()
        );
      await auth.login(req, res);
      expect(res.status).toBeCalledWith(200);
    });

    it('should return 400 on not successful login', async () => {
      const req = mockReq('no', 'noSuchUser', 'whatever', '');
      const res = mockRes();
      jest
        .spyOn(authServices, 'compareHash')
        .mockImplementationOnce((password: string, hash: string) =>
          Promise.resolve(false)
        );
      await auth.login(req, res);
      expect(res.status).toBeCalledWith(400);
    });
  });
  describe('isAdmin', () => {
    const mockReq: any = (userId: string, admin: boolean) => {
      return {
        session: { userId, admin },
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

    it('should return 200 and true if admin is true', async () => {
      const req = mockReq('ongod', true);
      const res = mockRes();
      await auth.isAdmin(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(true);
    });

    it('should return 400 and false if not admin', async () => {
      const req = mockReq('ongod', false);
      const res = mockRes();
      await auth.isAdmin(req, res);
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith(false);
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
    const rtmpMockReq: any = (sessionID: string, userId: string) => {
      return {
        body: {
          sessionID,
          userId,
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

    it('should return 200 if the body sessionId matches with the retrieved sessionId', async () => {
      const rtmpReq = rtmpMockReq('testSessionId', 'testUserId');
      const rtmpRes = rtmpMockRes();
      jest
        .spyOn(authServices, 'retrieveSID')
        .mockImplementationOnce(
          (userId: string) => ({ rows: [{ sid: 'testSessionId' }] } as any)
        );
      await auth.rtmpAuthPlay(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(200);
    });
    it('should return 400 if user is not found', async () => {
      const rtmpReq = rtmpMockReq('testSessionId', 'testUserId');
      const rtmpRes = rtmpMockRes();
      jest
        .spyOn(authServices, 'retrieveSID')
        .mockImplementationOnce((userId: string) => ({ rows: [] } as any));
      await auth.rtmpAuthPlay(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(400);
    });
    it("should return 400 if the body sessionId doesn't match with the retrieved sessionId", async () => {
      const rtmpReq = rtmpMockReq('testSessionId', 'testUserId');
      const rtmpRes = rtmpMockRes();
      jest
        .spyOn(authServices, 'retrieveSID')
        .mockImplementationOnce(
          (userId: string) => ({ rows: [{ sid: 'fakeSessionId' }] } as any)
        );
      await auth.rtmpAuthPlay(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(400);
    });
  });
  describe('rtmpAuthPublish', () => {
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

    beforeEach(() => {
      jest
        .spyOn(apiServices, 'addUserCamera')
        .mockImplementationOnce((userId: string, cameraId: string) =>
          Promise.resolve()
        );
      jest
        .spyOn(apiServices, 'storeStreamId')
        .mockImplementationOnce((cameraId: string, streamId: string) =>
          Promise.resolve()
        );
      jest
        .spyOn(apiServices, 'updateCameraLive')
        .mockImplementationOnce((cameraId: string, live: boolean) =>
          Promise.resolve()
        );
    });
    it('should return 200 on a successful publish store', async () => {
      mockedAxios.get.mockImplementationOnce(() =>
        Promise.resolve({ status: 200 })
      );
      const mockResults = {
        rows: [{ session: JSON.stringify({ userId: 'wrry' }) }],
      };
      jest
        .spyOn(authServices, 'retrieveSession')
        .mockImplementationOnce((sessionID: string) =>
          Promise.resolve(mockResults as any)
        );
      jest
        .spyOn(apiServices, 'verifyUserCamera')
        .mockImplementation((userId: string, cameraId: string) =>
          Promise.resolve(true)
        );
      const rtmpReq = rtmpMockReq(
        testSessionID,
        'wrry',
        testCameraId,
        testStreamId
      );
      const rtmpRes = rtmpMockRes();
      await auth.rtmpAuthPublishStart(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(200);
      const numGetCalls = mockedAxios.get.mock.calls.length;
      expect(mockedAxios.get).toHaveBeenNthCalledWith(
        numGetCalls-1, settings.CASSANDRA_FLASK_SERVICE_URL + 'store/' + rtmpReq.body.name
      );
      expect(mockedAxios.get).toHaveBeenNthCalledWith(
        numGetCalls, settings.OPENCV_SERVICE_URL + 'apply_detections' + `?camera_id=${rtmpReq.body.cameraId}&stream_id=${rtmpReq.body.name}`
      );
    });
    it('should return 500 on a unsuccessful rtmp saver call', async () => {
      mockedAxios.get.mockImplementationOnce(() =>
        Promise.resolve({ status: 400 })
      );
      const mockResults = {
        rows: [{ session: JSON.stringify({ userId: 'wrry' }) }],
      };
      jest
        .spyOn(authServices, 'retrieveSession')
        .mockImplementationOnce((sessionID: string) =>
          Promise.resolve(mockResults as any)
        );
      jest
        .spyOn(apiServices, 'verifyUserCamera')
        .mockImplementation((userId: string, cameraId: string) =>
          Promise.resolve(true)
        );
      const rtmpReq = rtmpMockReq(
        testSessionID,
        'wrry',
        testCameraId,
        testStreamId
      );
      const rtmpRes = rtmpMockRes();
      await auth.rtmpAuthPublishStart(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(500);
      const numGetCalls = mockedAxios.get.mock.calls.length;
      expect(mockedAxios.get).toHaveBeenNthCalledWith(
        numGetCalls, settings.CASSANDRA_FLASK_SERVICE_URL + 'store/' + rtmpReq.body.name
      );
    });
    it('should return 400 if userId does not own cameraId', async () => {
      const mockResults = {
        rows: [{ session: JSON.stringify({ userId: 'za warudo' }) }],
      };
      jest
        .spyOn(authServices, 'retrieveSession')
        .mockImplementationOnce((sessionID: string) =>
          Promise.resolve(mockResults as any)
        );
      jest
        .spyOn(apiServices, 'verifyUserCamera')
        .mockImplementation((userId: string, cameraId: string) =>
          Promise.resolve(false)
        );
      const rtmpReq = rtmpMockReq(
        testSessionID,
        'za warudo',
        testCameraId,
        testStreamId
      );
      const rtmpRes = rtmpMockRes();
      await auth.rtmpAuthPublishStart(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(400);
    });
    it('should return 400 if userId of session doesnt match userId in body', async () => {
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
        'wwrrryy',
        testCameraId,
        testStreamId
      );
      const rtmpRes = rtmpMockRes();
      await auth.rtmpAuthPublishStart(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(400);
    });
    it('should return 200 on a successful publish stop', async () => {
      mockedAxios.get.mockImplementationOnce(() =>
        Promise.resolve({ status: 200 })
      );
      const mockResults = {
        rows: [{ session: JSON.stringify({ userId: 'wrry' }) }],
      };
      jest
        .spyOn(authServices, 'retrieveSession')
        .mockImplementationOnce((sessionID: string) =>
          Promise.resolve(mockResults as any)
        );
      jest
        .spyOn(apiServices, 'verifyUserCamera')
        .mockImplementation((userId: string, cameraId: string) =>
          Promise.resolve(true)
        );

      const rtmpReq = rtmpMockReq(
        testSessionID,
        'wrry',
        testCameraId,
        testStreamId
      );
      const rtmpRes = rtmpMockRes();
      await auth.rtmpAuthPublishStop(rtmpReq, rtmpRes);
      expect(rtmpRes.status).toBeCalledWith(200);
      const numGetCalls = mockedAxios.get.mock.calls.length;
      expect(mockedAxios.get).toHaveBeenNthCalledWith(
        numGetCalls, settings.CASSANDRA_FLASK_SERVICE_URL + 'stop/' + rtmpReq.body.name
      );
    });
  });
});
