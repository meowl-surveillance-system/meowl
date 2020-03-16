import * as auth from '../controllers/auth';

import { client } from '../utils/client';

describe('auth', () => {
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

    it('should return sessionID and userID', () => {
      const req = mockReq();
      const res = mockRes();
      auth.rtmpRequest(req, res);
      expect(res.json).toBeCalledWith({
        sessionID: req.sessionID,
        userId: req.session!.userId,
      });
    });

    it('should return 200', () => {
      const req = mockReq();
      const res = mockRes();
      auth.rtmpRequest(req, res);
      expect(res.status).toBeCalledWith(200);
    });
  });
  describe('register', () => {
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

    it('should return 200 on a successful register', async () => {
      const req = mockReq('yes', 'testUser', 'password', '');
      const res = mockRes();
      await auth.register(req, res);
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

    it('should return 200 on a successful login', async () => {
      const req = mockReq('yes', 'testUser', 'password', '');
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
});
