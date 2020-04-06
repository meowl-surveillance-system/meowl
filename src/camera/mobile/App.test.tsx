import 'react-native';
import React from 'react';
import App from './App';

import renderer from 'react-test-renderer';

describe('App Component', () => {
  let appInstance: App;
  beforeEach(() => {
    appInstance = new App({});
  });
  it('renders correctly', () => {
    const container = renderer.create(<App />).toJSON();
    expect(container).toMatchSnapshot();
  });

  it('should have initial states', () => {
    expect(appInstance.state).toBeDefined();
  });

  it('should call setState on updating the states of the App', async () => {
    const setStateSpy = jest.spyOn(appInstance, 'setState');
    await appInstance.updateState({ userId: 'testing123' });
    expect(setStateSpy).toHaveBeenCalled();
  });
});
