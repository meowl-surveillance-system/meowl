import * as auth from '../../services/auth';
import { client } from '../../utils/client';

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
  describe('Reset token', () => {
    const testResetToken = 'testResetToken';
    it('should be able to store reset token and retrieve the associated user ID from it', async () => {
      await auth.storeResetToken(testResetToken, testUserId);
      const retrievedId = await auth.retrieveUserIdFromToken(testResetToken);
      expect(retrievedId).toBe(testUserId);
    });
    it('should be able to retrieve UserId and Email', async () => {
      const result = await auth.retrieveUserIdAndEmail(testApprovedUsername);
      expect(result.rows[0].user_id).toBe(testApprovedUserId);
      expect(result.rows[0].email).toBe(testApprovedEmail);
    });
    it('should return true if token exists', async () => {
      jest.spyOn(client, 'execute').mockImplementationOnce(() => Promise.resolve({ rows: ['good'] } as any));
      const result = await auth.verifyToken(testResetToken);
      expect(result).toEqual(true);
    });
    it('should return false if token does not exists', async () => {
      jest.spyOn(client, 'execute').mockImplementationOnce(() => Promise.resolve({ rows: [] } as any));
      const result = await auth.verifyToken(testResetToken);
      expect(result).toEqual(false);
    });
    it('should delete the token', async () => {
      await auth.deleteToken(testResetToken);
      const result = await auth.verifyToken(testResetToken);
      expect(result).toEqual(false);
    });
  });
});
