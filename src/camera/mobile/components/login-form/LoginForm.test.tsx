import 'react-native';
import { Alert } from 'react-native';
import React from 'react';
import LoginForm from './LoginForm';

import renderer from 'react-test-renderer';
import * as utils from '../../utils/utils';

describe('LoginForm Component', () => {
  let loginFormInstance: LoginForm;
  let updatePropsMock: jest.Mock;

  beforeEach(() => {
    updatePropsMock = jest.fn();
    loginFormInstance = new LoginForm({
      requestServerUrl: '',
      rtmpServerUrl: '',
      isLoggedIn: false,
      updateProps: updatePropsMock,
    });
  });
  it('renders correctly', () => {
    const container = renderer
      .create(
        <LoginForm
          requestServerUrl=""
          rtmpServerUrl=""
          isLoggedIn={true}
          updateProps={(obj: object) => { }}
        />,
      )
      .toJSON();
    expect(container).toMatchSnapshot();
  });

  it('should call handleLogin and retrieveRtmpCredentials in a successful onSubmit', async () => {
    const handleLoginSpy = jest
      .spyOn(loginFormInstance, 'handleLogin')
      .mockResolvedValue(
        new Response(
          {},
          {
            status: 200,
            statusText: 'yes',
            headers: {
              'Content-type': 'application/json',
            },
          },
        ),
      );
    const retrieveRtmpCredentialsSpy = jest.spyOn(
      loginFormInstance,
      'retrieveRtmpCredentials',
    );
    await loginFormInstance.onSubmit();
    expect(handleLoginSpy).toHaveBeenCalled();
    expect(retrieveRtmpCredentialsSpy).toHaveBeenCalled();
  });

  it('should call updateProps on a succesfully login', async () => {
    const handleLoginSpy = jest
      .spyOn(loginFormInstance, 'handleLogin')
      .mockResolvedValue(
        new Response(
          {},
          {
            status: 200,
            statusText: 'yes',
            headers: {
              'Content-type': 'application/json',
            },
          },
        ),
      );
    const retrieveRtmpCredentialsSpy = jest
      .spyOn(loginFormInstance, 'retrieveRtmpCredentials')
      .mockResolvedValue({
        userId: 'hello',
        // TODO(yliu): fix this sessionID to sessionId
        sessionID: 'world',
        isLoggedIn: true,
      });
    await loginFormInstance.onSubmit();
    expect(updatePropsMock).toHaveBeenCalledWith({
      cameraId: '',
      userId: 'hello',
      sessionId: 'world',
      isLoggedIn: true,
    });
  });

  it('should call login method in handleLogin', async () => {
    const loginSpy: jest.SpyInstance = jest.spyOn(utils, 'login');
    await loginFormInstance.handleLogin();
    expect(loginSpy).toHaveBeenCalled();
  });

  it('should alert the user on unsuccessful login', async () => {
    const loginSpy: jest.SpyInstance = jest
      .spyOn(utils, 'login')
      .mockResolvedValue(null);
    const alertSpy: jest.SpyInstance = jest.spyOn(Alert, 'alert');
    await loginFormInstance.handleLogin();
    expect(alertSpy).toHaveBeenCalled();
  });
});
