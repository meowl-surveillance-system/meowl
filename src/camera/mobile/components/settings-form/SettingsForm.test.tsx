import 'react-native';
import React from 'react';
import SettingsForm from './SettingsForm';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const container = renderer.create(
    <SettingsForm
      audioBitRate={1234}
      fps={1234}
      requestServerUrl=''
      rtmpServerUrl=''
      settingsFormVisible={false}
      updateProps={(obj) => { }}
      videoBitRate={1234}
    />
  ).toJSON();
  expect(container).toMatchSnapshot();
});
