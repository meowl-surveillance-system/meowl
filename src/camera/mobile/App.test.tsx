import 'react-native';
import React from 'react';
import App from './App';

import renderer from 'react-test-renderer';

beforeAll(() => {
  jest.mock('@react-native-community/async-storage');
})
it('renders correctly', () => {
  const container = renderer.create(<App />).toJSON();
  expect(container).toMatchSnapshot();
});
