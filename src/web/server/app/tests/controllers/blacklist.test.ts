import * as blacklist from '../../controllers/blacklist';
import * as blacklistServices from '../../services/blacklist';

jest.mock('../../services/notif');

describe('blacklist', () => {
  let mockReq: any;
  let mockRes: any;
  beforeAll(() => {
    mockReq = () => {
      return {
        body: {
            name: 'joe'
        },
      };
    };
    mockRes = () => {
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
  });

  it('should have status 200 upon adding to blacklist', async () => {
    jest.spyOn(blacklistServices, 'insertBlacklist').mockImplementationOnce(() => {
      return Promise.resolve(undefined!);
    });
    const req = mockReq();
    const res = mockRes();
    await blacklist.insertBlacklist(req, res);

    expect(res.status).toBeCalledWith(200);
  });
});