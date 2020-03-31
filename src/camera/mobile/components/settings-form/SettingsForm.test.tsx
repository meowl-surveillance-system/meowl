import 'react-native';
import React from 'react';
import SettingsForm from './SettingsForm';
import * as utils from '../../utils/utils';

import renderer from 'react-test-renderer';

describe('SettingsForm Component', () => {
  let settingsFormInstance: SettingsForm;
  let updatePropsMock: jest.Mock;

  beforeEach(() => {
    updatePropsMock = jest.fn();
    settingsFormInstance = new SettingsForm({
      audioBitRate: 1234,
      fps: 1234,
      requestServerUrl: '',
      rtmpServerUrl: '',
      settingsFormVisible: false,
      updateProps: updatePropsMock,
      videoBitRate: 1234,
    });
  });

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

  it('should set isLoggedIn to false on logout', async () => {
    const logOutSpy: jest.SpyInstance = jest.spyOn(utils, 'logout');
    await settingsFormInstance.handleLogout();
    expect(logOutSpy).toHaveBeenCalled();
    expect(updatePropsMock).toHaveBeenCalledWith({ isLoggedIn: false });
  });

  it('should call props.updateProps on updates', async () => {
    settingsFormInstance.updateProps({ rtmpServerUrl: 'testing1234567' });
    expect(updatePropsMock).toHaveBeenLastCalledWith({ rtmpServerUrl: 'testing1234567' });
  });

});