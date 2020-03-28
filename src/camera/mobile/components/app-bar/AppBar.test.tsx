import 'react-native';
import React from 'react';
import AppBar from './AppBar';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const container = renderer.create(
    <AppBar
      flashEnabled={false}
      isPublishing={false}
      isViewingFrontCamera={false}
      settingsFormVisible={false}
      updateProps={(obj) => { }}
    />
  ).toJSON();
  expect(container).toMatchSnapshot();
});
