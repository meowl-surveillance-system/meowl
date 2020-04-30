import * as blacklist from '../../services/blacklist';
import { client } from '../../utils/client';

describe('blacklist', () => {
  beforeAll(() => {
    client.execute = jest.fn();
  });

  it('should call cassandra.execute to retrieve notifications', async () => {
    const result = await blacklist.insertBlacklist('joe');
    expect(client.execute).toHaveBeenCalled();
  });
});