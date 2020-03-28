import React from 'react';
import { PermissionsAndroid } from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';

/**
 * The overall application component for Meowl Mobile
 * 
 * TODO(chc5): Create unit tests for App component
 * TODO(chc5): Break the application up into multiple components
 */

interface Props { }

interface State { }
class App extends React.Component<Props, State> {
  constructor(props: Props) {
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
   * Renders NodeCameraView that will serve as a streaming camera
   * 
   * TODO(chc5): Make important NodeCameraView properties customizable in settings
   */
  render() {
    return (
      <NodeCameraView
        style={{ flex: 1, zIndex: 0 }}
        outputUrl={"rtmp://192.168.0.10/live/stream"}
        camera={{ cameraId: 1, cameraFrontMirror: true }}
        audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
        video={{ preset: 12, bitrate: 400000, profile: 1, fps: 15, videoFrontMirror: false }}
        autopreview={true}
      />
    );
  }
}

export default App;