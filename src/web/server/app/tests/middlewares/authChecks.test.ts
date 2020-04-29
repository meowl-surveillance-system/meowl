import * as authChecks from '../../middlewares/authChecks';
import * as helpers from '../../middlewares/helpers';
import * as authServices from '../../services/auth';

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

describe('middlewares', () => {
  describe('isLoggedIn', () => {
    it('should call next if a userId is provided', async () => {
      const req = mockReq('yes');
      const res = mockRes();
      const next = jest.fn();
      await authChecks.isLoggedIn(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('should have undefined userId if no userId is provided', async () => {
      const req = mockReq();
      const res = mockRes();
      const next = jest.fn();
      await authChecks.isLoggedIn(req, res, next);
      expect(req.session.userId).toBeUndefined();
    });
    it('should not call next if no userId is provided', async () => {
      const req = mockReq();
      const res = mockRes();
      const next = jest.fn();
      await authChecks.isLoggedIn(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });
    it('should return 400 if no userId is provided', async () => {
      const req = mockReq();
      const res = mockRes();
      const next = jest.fn();
      await authChecks.isLoggedIn(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('isLoggedOut', () => {
    it('should call next if userId is undefined', async () => {
      const next = jest.fn();
      await authChecks.isLoggedOut(mockReq(), mockRes(), next);
      expect(next).toHaveBeenCalled();
    });
    it('should return 400 if userId is provided', async () => {
      const res = mockRes();
      await authChecks.isLoggedOut(mockReq('yes'), res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('isValidCred', () => {
    it('should call next if credentials are not empty', async () => {
      const req: any = {
        body: {
          username: 'hello',
          password: 'world',
        },
      };
      const res = mockRes();
      const next = jest.fn();
      await authChecks.isValidCred(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('should return 400 if username field is empty', async () => {
      const req: any = {
        body: {
          username: '',
          password: 'world',
        },
      };
      const res = mockRes();
      const next = jest.fn();
      await authChecks.isValidCred(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
    it('should return 400 if password field is empty', async () => {
      const req: any = {
        body: {
          username: 'hello',
          password: '',
        },
      };
      const res = mockRes();
      const next = jest.fn();
      await authChecks.isValidCred(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('isUsernameCollide', () => {
    const req: any = {
      body: { username: 'whatever' },
    };

    it("should call next if username doesn't collide", async () => {
      const next = jest.fn();
      const isCollideMock = jest
        .spyOn(helpers, 'isCollideHelper')
        .mockImplementation(async () => false);
      await authChecks.isUsernameCollide(req, mockRes(), next);
      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if username collides', async () => {
      const res = mockRes();
      const next = jest.fn();
      const isCollideMock = jest
        .spyOn(helpers, 'isCollideHelper')
        .mockImplementation(async () => true);
      await authChecks.isUsernameCollide(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('isAdmin', () => {
    const req: any = (admin: boolean) => {
      return {
        session: { admin },
      };
    };
    it('should call next if the request is made by an admin', async () => {
      const isAdminReq = req(true);
      const res = mockRes();
      const next = jest.fn();
      await authChecks.isAdmin(isAdminReq, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('should return 403 if the request is not made by an admin', async () => {
      const isAdminReq = req(false);
      const res = mockRes();
      const next = jest.fn();
      await authChecks.isAdmin(isAdminReq, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('isValidToken', () => {
    const req: any = (resetToken: string) => {
      return {
        body: {
          resetToken,
        }
      }  
    };
    it('should return 400 if token is not valid', async () => {
      const isValidTokenReq = req('bad_token');
      const isValidTokenRes = mockRes();
      const next = jest.fn();
      jest.spyOn(authServices, 'verifyToken').mockImplementationOnce((token: string) => Promise.resolve(false));
      await authChecks.isValidToken(isValidTokenReq, isValidTokenRes, next);
      expect(isValidTokenRes.status).toHaveBeenCalledWith(400);
    });
    it('should call next if the token is valid', async () => {
      const isValidTokenReq = req('good_token');
      const isValidTokenRes = mockRes();
      const next = jest.fn();
      jest.spyOn(authServices, 'verifyToken').mockImplementationOnce((token: string) => Promise.resolve(true));
      await authChecks.isValidToken(isValidTokenReq, isValidTokenRes, next);
      expect(next).toHaveBeenCalled();
    });
  })
});
