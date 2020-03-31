import 'react-native';
import React from 'react';
import CameraPublisher from './CameraPublisher';
import { PermissionsAndroid } from 'react-native';

import renderer from 'react-test-renderer';

class NodeMediaClientRefMock {
  start = jest.fn();
  stop = jest.fn();
  switchCamera = jest.fn();
  flashEnable = jest.fn();
}

describe('CameraPublisher Component', () => {
  let cameraPublisherInstance: CameraPublisher;
  let props: CameraProps;
  let oldProps: CameraProps;

  beforeEach(() => {
    props = {
      cameraId: 'abc',
      sessionId: 'def',
      userId: 'ghi',
      flashEnabled: false,
      isPublishing: false,
      isViewingFrontCamera: false,
      audioBitRate: 1234,
      fps: 30,
      rtmpServerUrl: '',
      videoBitRate: 1234,
    };
    oldProps = Object.assign({}, props);
    cameraPublisherInstance = new CameraPublisher(props);
  });

  it('renders correctly', () => {
    const container = renderer.create(
      <CameraPublisher
        cameraId='abc'
        sessionId='def'
        userId='ghi'
        flashEnabled={false}
        isPublishing={false}
        isViewingFrontCamera={false}
        audioBitRate={1234}
        fps={30}
        rtmpServerUrl=''
        videoBitRate={1234}
      />
    ).toJSON();
    expect(container).toMatchSnapshot();
  });

  it('should ask for permission onMount', async () => {
    const permissionSpy: jest.SpyInstance = jest.spyOn(PermissionsAndroid, 'requestMultiple');
    await cameraPublisherInstance.componentDidMount();
    expect(permissionSpy).toHaveBeenCalledWith([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ]);
  });

  it('should call flashEnable on props change', async () => {
    oldProps.flashEnabled = true;
    cameraPublisherInstance.vb = new NodeMediaClientRefMock();
    const vbFlashEnableSpy: jest.SpyInstance = jest.spyOn(cameraPublisherInstance.vb, 'flashEnable');
    await cameraPublisherInstance.componentDidUpdate(oldProps);
    expect(vbFlashEnableSpy).toHaveBeenCalledWith(false);
  });


  it('should call stop on props change', async () => {
    oldProps.isPublishing = true;
    cameraPublisherInstance.vb = new NodeMediaClientRefMock();
    const vbStopSpy: jest.SpyInstance = jest.spyOn(cameraPublisherInstance.vb, 'stop');
    await cameraPublisherInstance.componentDidUpdate(oldProps);
    expect(vbStopSpy).toHaveBeenCalled();
  });

  it('should call switchCamera on props change', async () => {
    oldProps.isViewingFrontCamera = true;
    cameraPublisherInstance.vb = new NodeMediaClientRefMock();
    const vbSwitchCameraSpy: jest.SpyInstance = jest.spyOn(cameraPublisherInstance.vb, 'switchCamera');
    await cameraPublisherInstance.componentDidUpdate(oldProps);
    expect(vbSwitchCameraSpy).toHaveBeenCalled();
  });

  it('should create full url from url parts', async () => {
    props.userId = '123';
    props.sessionId = '456';
    props.cameraId = '890';
    props.rtmpServerUrl = 'rtmp://123.123.123:9000';
    const fullUrl = await cameraPublisherInstance.setNewRtmpStreamLink();
    expect(fullUrl).toEqual('rtmp://123.123.123:9000/show/1234?cameraId=890&sessionID=456&userId=123');
  });
})