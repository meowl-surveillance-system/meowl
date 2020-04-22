import * as api from '../../services/api';

describe('api', () => {
  const testSessionID = 'yes';
  const testUserId = 'servicesTestUserId';
  const testUser = 'servicesTestUser';
  const testPassword = 'password';
  const testEmail = 'test@email.com';
  const testCameraId = 'servicesTestCameraId';
  const testStreamId = 'servicesTestStreamId';
  const testGroupId = 'servicesTestGroupId';
  describe('storing and retrieving stream ids and camera ids', () => {
    it('should be able to store and retrieve stream ids', async () => {
      await api.storeStreamId(testCameraId, testStreamId);
      const result = await api.retrieveStreamIds(testCameraId);
      expect(result.rows.length).toBe(1);
      expect(result.rows[0].stream_id).toBe(testStreamId);
    });
    it('should be able to add a user as an owner of camera id and verify and retrieve', async () => {
      await api.addUserCamera(testUserId, testCameraId);
      const verifyResult = await api.verifyUserCamera(testUserId, testCameraId);
      expect(verifyResult).toBe(true);
      const retrieveResult = await api.retrieveCameraIds(testUserId);
      expect(retrieveResult.rows.length).toBeGreaterThan(0);
      expect(retrieveResult.rows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            camera_id: testCameraId,
          }),
        ])
      );
    });
  });
  describe('live camera streams', () => {
    it('should be able to store and retrieve stream id of a live camera', async () => {
      await api.addUserCamera(testUserId, testCameraId);
      const verifyResult = await api.verifyUserCamera(testUserId, testCameraId);
      expect(verifyResult).toBe(true);
      await api.updateCameraLive(testCameraId, true);
      await api.storeStreamId(testCameraId, testStreamId);
      const liveStreamIdResults = await api.retrieveLiveStreamId(testCameraId);
      expect(liveStreamIdResults!.rows[0].stream_id).toBe(testStreamId);
      await api.updateCameraLive(testCameraId, false);
      const liveStreamIdResults2 = await api.retrieveLiveStreamId(testCameraId);
      expect(liveStreamIdResults2).toBe(undefined);
    });
    it('should be able to store and retrieve all live camera and stream ids of a user', async () => {
      const testCameraId2 = testCameraId + '2';
      const testStreamId2 = testStreamId + '2';
      await api.addUserCamera(testUserId, testCameraId);
      const verifyResult = await api.verifyUserCamera(testUserId, testCameraId);
      expect(verifyResult).toBe(true);
      await api.addUserCamera(testUserId, testCameraId2);
      const verifyResult2 = await api.verifyUserCamera(
        testUserId,
        testCameraId
      );
      expect(verifyResult2).toBe(true);
      await api.updateCameraLive(testCameraId, true);
      await api.updateCameraLive(testCameraId2, false);
      await api.storeStreamId(testCameraId, testStreamId);
      await api.storeStreamId(testCameraId2, testStreamId2);
      const liveCameraStreamIdResults = await api.retrieveLiveCameraStreamIds(
        testUserId
      );
      const expected = {} as Record<string, string>;
      expected[testCameraId] = testStreamId;
      expect(liveCameraStreamIdResults).toStrictEqual(expected);
      await api.updateCameraLive(testCameraId2, true);
      const liveCameraStreamIdResults2 = await api.retrieveLiveCameraStreamIds(
        testUserId
      );
      expected[testCameraId2] = testStreamId2;
      expect(liveCameraStreamIdResults2).toStrictEqual(expected);
    });
  });
  describe('user group cameras', () => {
    it('should be able to store and retrieve user groups', async () => {
      await api.addUserGroup(testUserId, testGroupId);
      const userGroupsResult = await api.retrieveUserGroups(testUserId);
      expect(userGroupsResult!.rows[0].group_id).toBe(testGroupId);
      const testUserId2 = testUserId + 'GroupTest';
      const testCameraId2 = testCameraId + 'GroupTest';
      await api.addUserGroup(testUserId2, testGroupId);
      const userGroupsResult2 = await api.retrieveUserGroups(testUserId2);
      expect(userGroupsResult2!.rows[0].group_id).toBe(testGroupId);
      const groupUsersResult = await api.retrieveGroupUsers(testGroupId);
      expect(groupUsersResult.rows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user_id: testUserId,
          }),
          expect.objectContaining({
            user_id: testUserId2,
          }),
        ])
      );
    });
    it('should be able to store and retrieve group cameras', async () => {
      await api.addUserGroup(testUserId, testGroupId);
      const userGroupsResult = await api.retrieveUserGroups(testUserId);
      expect(userGroupsResult!.rows[0].group_id).toBe(testGroupId);
      const groupUsersResult = await api.retrieveGroupUsers(testGroupId);
      await api.addUserCamera(testUserId, testCameraId);
      const verifyResult = await api.verifyUserCamera(testUserId, testCameraId);
      expect(verifyResult).toBe(true);
      const testUserId2 = testUserId + 'GroupCamerasTest';
      const testCameraId2 = testCameraId + 'GroupCamerasTest';
      await api.addUserCamera(testUserId2, testCameraId2);
      const verifyResult2 = await api.verifyUserCamera(
        testUserId2,
        testCameraId2
      );
      expect(verifyResult2).toBe(true);
      await api.addUserGroup(testUserId2, testGroupId);
      const userGroupsResult2 = await api.retrieveUserGroups(testUserId2);
      expect(userGroupsResult2!.rows[0].group_id).toBe(testGroupId);
      const groupCamerasResult = await api.retrieveGroupCameras(testGroupId);
      expect(groupCamerasResult).toEqual(
        expect.arrayContaining([testCameraId, testCameraId2])
      );
    });
    it('should be able to store and retrieve users group cameras', async () => {
      await api.addUserGroup(testUserId, testGroupId);
      const userGroupsResult = await api.retrieveUserGroups(testUserId);
      expect(userGroupsResult!.rows[0].group_id).toBe(testGroupId);
      const groupUsersResult = await api.retrieveGroupUsers(testGroupId);
      await api.addUserCamera(testUserId, testCameraId);
      const verifyResult = await api.verifyUserCamera(testUserId, testCameraId);
      expect(verifyResult).toBe(true);
      const testUserId2 = testUserId + 'UserGroupCamerasTest';
      const testCameraId2 = testCameraId + 'UserGroupCamerasTest';
      const testGroupId2 = testGroupId + 'UserGroupCamerasTest';
      await api.addUserCamera(testUserId2, testCameraId2);
      const verifyResult2 = await api.verifyUserCamera(
        testUserId2,
        testCameraId2
      );
      expect(verifyResult2).toBe(true);
      await api.addUserGroup(testUserId2, testGroupId2);
      const userGroupsResult2 = await api.retrieveUserGroups(testUserId2);
      expect(userGroupsResult2!.rows[0].group_id).toBe(testGroupId2);
      await api.addUserGroup(testUserId, testGroupId2);
      const bothGroupsResult = await api.retrieveUserGroups(testUserId);
      expect(bothGroupsResult.rows).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            group_id: testGroupId,
          }),
          expect.objectContaining({
            group_id: testGroupId2,
          }),
        ])
      );
      const allGroupsCamerasResult = await api.retrieveUserGroupCameras(
        testUserId
      );
      expect(allGroupsCamerasResult).toEqual(
        expect.arrayContaining([testCameraId, testCameraId2])
      );
    });
  });
});
