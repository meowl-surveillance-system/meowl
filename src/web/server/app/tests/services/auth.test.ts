import * as auth from '../../services/auth';

describe('auth', () => {
  const testSessionID = 'yes';
  const testUserId = 'testUserId';
  const testUser = 'servicesTestUser';
  const testPassword = 'password';
  const testEmail = 'test@email.com';
  beforeAll(async () => {
    await auth.storeUser(
      testUserId,
      testEmail,
      testUser,
      testSessionID,
      testPassword
    );
  });
  describe('storing and retrieving user', () => {
    it('should be able to check user exists', async () => {
      const userExistsResult = await auth.checkUserExists(testUser);
      expect(userExistsResult.rows.length).toBe(1);
    });
    it('should be able to retrieve user', async () => {
      const userResult = await auth.retrieveUser(testUser);
      const userId = userResult.rows[0].user_id;
      expect(userId).toBe(testUserId);
    });
    it('should be able to retrieve and compare user password', async () => {
      const userResult = await auth.retrieveUser(testUser);
      const password = userResult.rows[0].password;
      const compareResult = await auth.compareHash(testPassword, password);
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
});
