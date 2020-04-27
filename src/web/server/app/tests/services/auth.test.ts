import * as auth from '../../services/auth';
import {client} from '../../utils/client';

describe('auth', () => {
  const testSessionID = 'yes';
  const testUserId = 'testUserId';
  const testUser = 'servicesTestUser';
  const testPassword = 'password';
  const testEmail = 'test@email.com';
  // For testing retrieveUser
  const testApprovedUserId = 'approvedUserId';
  const testApprovedUsername = 'approvedUsername';
  const testApprovedEmail = 'approved@email.com';
  const testApprovedPassword = 'approvedPassword';
  beforeAll(async () => {
    await auth.addUserToPendingAccounts(
      testUserId,
      testEmail,
      testUser,
      testPassword
    );
    await auth.addUserToPendingAccounts(
      testApprovedUserId,
      testApprovedEmail,
      testApprovedUsername,
      testApprovedPassword
    );
    const result = await auth.retrievePendingAccount(testApprovedUsername);
    const { user_id, email, username, password } = result.rows[0];
    await auth.approveRegistration(user_id, email, username, password);
  });
  describe('storing and retrieving user', () => {
    it('should be able to check user exists', async () => {
      const userExistsResult = await auth.checkUserExists(testUser);
      expect(userExistsResult).toBe(true);
    });
    it('should be able to retrieve user', async () => {
      const userResult = await auth.retrieveUser(testApprovedUsername);
      const userId = userResult.rows[0].user_id;
      expect(userId).toBe(testApprovedUserId);
    });
    it('should be able to retrieve and compare user password', async () => {
      const userResult = await auth.retrieveUser(testApprovedUsername);
      const password = userResult.rows[0].password;
      const compareResult = await auth.compareHash(
        testApprovedPassword,
        password
      );
      expect(compareResult).toBe(true);
    });
  });
  describe('retrieving and updating session', () => {
    it('should be able to update and retrieve sessionID', async () => {
      const newSessionID = 'newSessionID';
      await auth.updateSessionId(newSessionID, testUserId, testUser);
      const result = await auth.retrieveSID(testUserId);
      expect(result.rows.length).toBe(1);
      expect(result.rows[0].sid).toBe(newSessionID);
    });
  });
  describe('retrievePendingAccounts', () => {
    it('should retrieve pending accounts', async () => {
      const mockPendingAccounts: any = {rows: [{username: testUser}]};
      jest.spyOn(client, 'execute').mockImplementationOnce(() => Promise.resolve(mockPendingAccounts as any));
      const result = await auth.retrievePendingAccounts();
      expect(result).toStrictEqual(mockPendingAccounts.rows);
    });
  });
});
