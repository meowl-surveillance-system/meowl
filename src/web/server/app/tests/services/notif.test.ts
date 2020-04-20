import * as notif from '../../services/notif';
import { client } from '../../utils/client';

describe('notifications', () => {
    beforeAll(() => {
        client.execute = jest.fn();
    })

    it('should call cassandra.execute to retrieve notifications', async () => {
        const result = await notif.retrieveNotif();
        expect(client.execute).toHaveBeenCalled();
    })
});