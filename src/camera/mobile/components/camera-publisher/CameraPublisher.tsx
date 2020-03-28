import React from 'react';
import { PermissionsAndroid } from 'react-native';
// @ts-ignore
import { NodeCameraView } from 'react-native-nodemediaclient';

/**
 * A wrapper around react-native-nodemediaclient component
 * TODO(chc5): Create unit tests for CameraPublisher component
 */
class CameraPublisher extends React.Component<CameraProps> {
  // Initalized by nodemediaclient to get controller methods from library
  vb: NodeMediaClientRef | undefined;

  constructor(props: CameraProps) {
    super(props);
  }

  /**
   * Asks the user for camera, audio, storage permissions
   */
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

  /**
   * Stops streaming from camera 
   */
  componentWillUnmount() {
    if (this.vb) {
      this.vb.stop();
    }
  }

  /**
   * Calls methods from react-native-nodemediaclient based on property changes
   * @param prevProps Previous property state
   */
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

  /**
   * Renders NodeCameraView that will serve as a streaming camera
   */
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