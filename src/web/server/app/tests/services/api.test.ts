import * as api from '../../services/api';

describe('api', () => {
  const testSessionID = 'yes';
  const testUserId = 'servicesTestUserId';
  const testUser = 'servicesTestUser';
  const testPassword = 'password';
  const testEmail = 'test@email.com';
  const testCameraId = 'servicesTestCameraId';
  const testStreamId = 'servicesTestStreamId';
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
      await api.updateCameraLive(testCameraId, false);
      await api.updateCameraLive(testCameraId2, false);
    });
  });
});
