import 'react-native';
import React from 'react';
import CameraPublisher from './CameraPublisher';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const container = renderer.create(
    <CameraPublisher
      flashEnabled={false}
      isPublishing={false}
      isViewingFrontCamera={false}
      audioBitRate={1234}
      fps={1234}
      outputLink=''
      videoBitRate={1234}
    />
  ).toJSON();
  expect(container).toMatchSnapshot();
});
