import * as notif from '../../controllers/notif';
import * as notifServices from '../../services/notif';

jest.mock('../../services/notif');

describe('notifications', () => {
  let mockReq: any;
  let mockRes: any;
  beforeAll(() => {
    mockReq = () => {
      return {
        params: {},
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

  it('should have status 400 if no notifications are found', async () => {
    jest.spyOn(notifServices, 'retrieveNotif').mockImplementationOnce(() => {
      return Promise.resolve(undefined!);
    });
    const req = mockReq();
    const res = mockRes();
    await notif.retrieveNotifications(req, res);

    expect(res.status).toBeCalledWith(400);
  });
});
