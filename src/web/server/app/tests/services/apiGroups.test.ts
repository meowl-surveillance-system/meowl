import * as api from '../../services/api';
import * as apiGroups from '../../services/apiGroups';
import { client } from '../../utils/client';

describe('apiGroups', () => {
  const testSessionID = 'yes';
  const testUserId = 'servicesTestUserId';
  const testUser = 'servicesTestUser';
  const testPassword = 'password';
  const testEmail = 'test@email.com';
  const testCameraId = 'servicesTestCameraId';
  const testStreamId = 'servicesTestStreamId';
  const testGroupId = 'servicesTestGroupId';
  describe('user group cameras', () => {
    it('should be able to store and retrieve user groups', async () => {
      await apiGroups.addUserGroup(testUserId, testGroupId);
      const userGroupsResult = await apiGroups.retrieveUserGroups(testUserId);
      expect(userGroupsResult!.rows[0].group_id).toBe(testGroupId);
      const testUserId2 = testUserId + 'GroupTest';
      const testCameraId2 = testCameraId + 'GroupTest';
      await apiGroups.addUserGroup(testUserId2, testGroupId);
      const userGroupsResult2 = await apiGroups.retrieveUserGroups(testUserId2);
      expect(userGroupsResult2!.rows[0].group_id).toBe(testGroupId);
      const groupUsersResult = await apiGroups.retrieveGroupUsers(testGroupId);
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
      await apiGroups.addUserGroup(testUserId, testGroupId);
      const userGroupsResult = await apiGroups.retrieveUserGroups(testUserId);
      expect(userGroupsResult!.rows[0].group_id).toBe(testGroupId);
      const groupUsersResult = await apiGroups.retrieveGroupUsers(testGroupId);
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
      await apiGroups.addUserGroup(testUserId2, testGroupId);
      const userGroupsResult2 = await apiGroups.retrieveUserGroups(testUserId2);
      expect(userGroupsResult2!.rows[0].group_id).toBe(testGroupId);
      const groupCamerasResult = await apiGroups.retrieveGroupCameras(testGroupId);
      expect(groupCamerasResult).toEqual(
        expect.arrayContaining([testCameraId, testCameraId2])
      );
    });
    it('should be able to store and retrieve users group cameras', async () => {
      await apiGroups.addUserGroup(testUserId, testGroupId);
      const userGroupsResult = await apiGroups.retrieveUserGroups(testUserId);
      expect(userGroupsResult!.rows[0].group_id).toBe(testGroupId);
      const groupUsersResult = await apiGroups.retrieveGroupUsers(testGroupId);
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
      await apiGroups.addUserGroup(testUserId2, testGroupId2);
      const userGroupsResult2 = await apiGroups.retrieveUserGroups(testUserId2);
      expect(userGroupsResult2!.rows[0].group_id).toBe(testGroupId2);
      await apiGroups.addUserGroup(testUserId, testGroupId2);
      const bothGroupsResult = await apiGroups.retrieveUserGroups(testUserId);
      // testUserId should be in testGroupId and testGroupId2
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
      // testUserId should be able to view testCameraId from testGroupId
      // and testCameraId2 from testGroupId2
      const allGroupsCamerasResult = await apiGroups.retrieveUserGroupCameras(
        testUserId
      );
      expect(allGroupsCamerasResult).toEqual(
        expect.arrayContaining([testCameraId, testCameraId2])
      );
      const allGroupsCamerasDictResult = await apiGroups.retrieveUserGroupCamerasDict(
        testUserId
      );
      const dictExpected = {} as Record<string, string[]>;
      dictExpected[testGroupId] = expect.arrayContaining([testCameraId]);
      dictExpected[testGroupId2] = expect.arrayContaining([testCameraId2]);
      expect(allGroupsCamerasDictResult).toEqual(
        expect.objectContaining(dictExpected)
      );
      const allGroupsCamerasDictResult2 = await apiGroups.retrieveAllGroupCamerasDict();
      expect(allGroupsCamerasDictResult2).toEqual(
        expect.objectContaining(dictExpected)
      );
      // users should be able to view each other's cameras in same group
      const canViewGroupCamera = await apiGroups.verifyUserCameraGroup(
        testUserId,
        testCameraId2,
      );
      expect(canViewGroupCamera).toBe(true);
      const canViewGroupCamera2 = await apiGroups.verifyUserCameraGroup(
        testUserId2,
        testCameraId,
      );
      expect(canViewGroupCamera2).toBe(true);
    });
    it('should be able to store and retrieve users group live camera stream ids', async () => {
      await apiGroups.addUserGroup(testUserId, testGroupId);
      const userGroupsResult = await apiGroups.retrieveUserGroups(testUserId);
      expect(userGroupsResult!.rows[0].group_id).toBe(testGroupId);
      const groupUsersResult = await apiGroups.retrieveGroupUsers(testGroupId);
      await api.addUserCamera(testUserId, testCameraId);
      const verifyResult = await api.verifyUserCamera(testUserId, testCameraId);
      expect(verifyResult).toBe(true);
      const testUserId2 = testUserId + 'GroupLiveCamerasTest';
      const testCameraId2 = testCameraId + 'GroupLiveCamerasTest';
      const testGroupId2 = testGroupId + 'GroupLiveCamerasTest';
      await api.addUserCamera(testUserId2, testCameraId2);
      const verifyResult2 = await api.verifyUserCamera(
        testUserId2,
        testCameraId2
      );
      expect(verifyResult2).toBe(true);
      await apiGroups.addUserGroup(testUserId2, testGroupId2);
      const userGroupsResult2 = await apiGroups.retrieveUserGroups(testUserId2);
      expect(userGroupsResult2!.rows[0].group_id).toBe(testGroupId2);
      await apiGroups.addUserGroup(testUserId, testGroupId2);
      const bothGroupsResult = await apiGroups.retrieveUserGroups(testUserId);
      // testUserId should be in testGroupId and testGroupId2
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
      // testUserId should be able to view testCameraId from testGroupId
      // and testCameraId2 from testGroupId2
      const allGroupsCamerasResult = await apiGroups.retrieveUserGroupCameras(
        testUserId
      );
      expect(allGroupsCamerasResult).toEqual(
        expect.arrayContaining([testCameraId, testCameraId2])
      );
      const allGroupsCamerasResult2 = await apiGroups.retrieveAllGroupCameras();
      expect(allGroupsCamerasResult2).toEqual(
        expect.arrayContaining([testCameraId, testCameraId2])
      );
      const testStreamId2 = testStreamId + 'GroupLiveCamerasTest';
      await api.updateCameraLive(testCameraId, true);
      await api.updateCameraLive(testCameraId2, false);
      await api.storeStreamId(testCameraId, testStreamId);
      await api.storeStreamId(testCameraId2, testStreamId2);
      const liveGroupCameraStreamIdResults = await apiGroups.retrieveLiveGroupCameraStreamIds(
        testUserId
      );
      const expected = {} as Record<string, string>;
      expected[testCameraId] = testStreamId;
      expect(liveGroupCameraStreamIdResults).toStrictEqual(expected);
      await api.updateCameraLive(testCameraId2, true);
      const liveGroupCameraStreamIdResults2 = await apiGroups.retrieveLiveGroupCameraStreamIds(
        testUserId
      );
      expected[testCameraId2] = testStreamId2;
      const allLiveGroupCameraStreamIdResults = await apiGroups.retrieveAllLiveGroupCameraStreamIds();
      expect(allLiveGroupCameraStreamIdResults).toEqual(expect.objectContaining(expected));
      await api.updateCameraLive(testCameraId, false);
      await api.updateCameraLive(testCameraId2, false);
    });
  });
  describe('retrieveGroups', () => {
    it('should retrieve group ids', async () => {
      const mockGroups: any = {rows: [{group_id: testGroupId}]};
      jest.spyOn(client, 'execute').mockImplementationOnce(() => Promise.resolve(mockGroups as any));
      const result = await apiGroups.retrieveGroups();
      expect(result).toStrictEqual(mockGroups);
    });
  });
});
