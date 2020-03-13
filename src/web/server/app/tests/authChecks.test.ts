import {
  isLoggedIn,
  isLoggedOut,
  isUsernameCollide,
  isValidCred,
} from '../middlewares/authChecks';

const mockReq: any = (userId: string) => {
  return {
  	session: { userId }
  }
}

const mockRes: any = () => {
  const res = {
    status: jest.fn(),
    send: jest.fn()
  }
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe('check isLoggedIn', () => {
	it('should call next if a userId is provided', async () => {
		const req = mockReq('yes');
		const res = mockRes();
		const next = jest.fn();
		await isLoggedIn(req, res, next);
		expect(next).toHaveBeenCalled();
	});
	it('should have undefined userId if no userId is provided', async () => {
		const req = mockReq();
		const res = mockRes();
		const next = jest.fn();
		await isLoggedIn(req, res, next);
		expect(req.session.userId).toBeUndefined();
	});
	it('should not call next if no userId is provided', async () => {
		const req = mockReq();
		const res = mockRes();
		const next = jest.fn();
		await isLoggedIn(req, res, next);
		expect(next).not.toHaveBeenCalled();
	});
	it('should return 400 if no userId is provided', async () => {
		const req = mockReq();
		const res = mockRes();
		const next = jest.fn();
		await isLoggedIn(req, res, next);
		expect(res.status).toHaveBeenCalledWith(400);
	})
});

describe('check isLoggedOut', () => {
	it('should call next if userId is undefined', async () => {
		const next = jest.fn();
		await isLoggedOut(mockReq(), mockRes(), next);
		expect(next).toHaveBeenCalled();
	});
	it('should return 400 if userId is provided', async () => {
		const res = mockRes();
		await isLoggedOut(mockReq('yes'), res, jest.fn());
		expect(res.status).toHaveBeenCalledWith(400);
	});
});

describe('check isValidCred', () => {
	it('should call next if credentials are not empty', async () => {
    	const req: any = {
    		body: {
    			username: 'hello',
    			password: 'world',
    		}
    	};
    	const res = mockRes();
    	const next = jest.fn();
    	await isValidCred(req, res, next);
    	expect(next).toHaveBeenCalled();
	});
	it('should return 400 if username field is empty', async () => {
    	const req: any = {
    		body: {
    			username: '',
    			password: 'world'
    		}
    	};
    	const res = mockRes();
    	const next = jest.fn();
    	await isValidCred(req, res, next);
    	expect(res.status).toHaveBeenCalledWith(400);
	});
	it('should return 400 if password field is empty', async () => {
    	const req: any = {
    		body: {
    			username: 'hello',
    			password: ''
    		}
    	};
    	const res = mockRes();
    	const next = jest.fn();
    	await isValidCred(req, res, next);
    	expect(res.status).toHaveBeenCalledWith(400);
	});
});