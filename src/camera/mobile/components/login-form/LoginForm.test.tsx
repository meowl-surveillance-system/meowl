import 'react-native';
import React from 'react';
import LoginForm from './LoginForm';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const container = renderer.create(
    <LoginForm
      outputLink=''
      isLoggedIn={true}
      updateProps={(obj) => { }}
    />
  ).toJSON();
  expect(container).toMatchSnapshot();
});
