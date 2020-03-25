import React from 'react';
import { View, PermissionsAndroid } from 'react-native';
// @ts-ignore
import { NodeCameraView } from 'react-native-nodemediaclient';

class CameraPublisher extends React.Component<CameraProps> {
  vb: NodeMediaClientRef | undefined;

  constructor(props: CameraProps) {
    super(props);
  }

  async componentDidMount() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ]);
      if (Object.keys(granted)
        .every((permission) => (granted as any)[permission] === PermissionsAndroid.RESULTS.GRANTED)) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  componentWillUnmount() {
    if (this.vb) {
      this.vb.stop();
    }
  }

  componentDidUpdate(prevProps: CameraProps) {
    if (this.vb) {
      if (this.props.flashEnabled !== prevProps.flashEnabled) {
        this.vb.flashEnable(this.props.flashEnabled);
      }
      if (this.props.isViewingFrontCamera !== prevProps.isViewingFrontCamera) {
        this.vb.switchCamera();
      }
      if (this.props.isPublishing !== prevProps.isPublishing) {
        if (this.props.isPublishing === true) {
          this.vb.start();
        } else {
          this.vb.stop();
        }
      }
    }
  }

  render() {
    return (
      <NodeCameraView
        style={{ flex: 10, zIndex: 0 }}
        ref={(vb: any) => { this.vb = vb }}
        outputUrl={this.props.outputLink}
        camera={{ cameraId: 1, cameraFrontMirror: this.props.isViewingFrontCamera }}
        audio={{ bitrate: this.props.audioBitRate, profile: 1, samplerate: 44100 }}
        video={{ preset: 1, bitrate: this.props.videoBitRate, profile: 1, fps: this.props.fps, videoFrontMirror: false }}
        smoothSkinLevel={3}
        autopreview={true}
      />
    );
  }
}

export default CameraPublisher;