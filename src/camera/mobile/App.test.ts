import 'react-native';

import {shallow} from 'enzyme';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import App from './App';

it('renders correctly', () => {
  const tree = shallow(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
