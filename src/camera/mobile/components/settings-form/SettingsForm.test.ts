/**
 * @format
 */

import 'react-native';

import {shallow} from 'enzyme';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import SettingsForm from './SettingsForm';

it('renders correctly', () => {
  const tree = shallow(<SettingsForm />).toJSON();
  expect(tree).toMatchSnapshot();
});
