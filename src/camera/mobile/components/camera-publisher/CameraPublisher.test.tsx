import 'react-native';
import React from 'react';
import CameraPublisher from './CameraPublisher';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const container = renderer.create(
    <CameraPublisher
      cameraId='abc'
      sessionId='def'
      userId='ghi'
      flashEnabled={false}
      isPublishing={false}
      isViewingFrontCamera={false}
      audioBitRate={1234}
      fps={30}
      rtmpServerUrl=''
      videoBitRate={1234}
    />
  ).toJSON();
  expect(container).toMatchSnapshot();
});
