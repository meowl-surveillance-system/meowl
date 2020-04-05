import React from 'react';
import { PermissionsAndroid, Alert } from 'react-native';
// @ts-ignore
import { NodeCameraView } from 'react-native-nodemediaclient';
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';

/**
 * A wrapper around react-native-nodemediaclient component
 */
class CameraPublisher extends React.Component<CameraProps, CameraState> {
  // Initalized by nodemediaclient to get controller methods from library
  client: NodeMediaClientRef | undefined;

  constructor(props: CameraProps) {
    super(props);
    this.state = {
      rtmpStreamLink: '',
    };
  }

  /**
   * Asks the user for camera, audio, storage permissions
   */
  async componentDidMount() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      if (
        !Object.keys(granted).every(
          permission =>
            (granted as any)[permission] === PermissionsAndroid.RESULTS.GRANTED,
        )
      ) {
        Alert.alert('Camera Permission Denied...');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  /**
   * Stops streaming from camera
   */
  componentWillUnmount() {
    if (this.client) {
      this.client.stop();
    }
  }

  /**
   * Calls methods from react-native-nodemediaclient based on property changes
   * @param prevProps Previous property state
   */
  async componentDidUpdate(prevProps: CameraProps) {
    if (this.client) {
      if (this.props.flashEnabled !== prevProps.flashEnabled) {
        this.client.flashEnable(this.props.flashEnabled);
      }
      if (this.props.isViewingFrontCamera !== prevProps.isViewingFrontCamera) {
        this.client.switchCamera();
      }
      if (this.props.isPublishing !== prevProps.isPublishing) {
        if (this.props.isPublishing === true) {
          await this.setNewRtmpStreamLink();
          this.client.start();
        } else {
          this.client.stop();
        }
      }
    }
  }

  /**
   * Creates a new RTMP Stream Link with a new Stream ID
   */
  async setNewRtmpStreamLink() {
    const streamId: string = uuidv4();
    const baseUrl: string = this.props.rtmpServerUrl + '/show/' + streamId;
    const fullUrl: string = queryString.stringifyUrl({
      url: baseUrl,
      query: {
        cameraId: this.props.cameraId,
        userId: this.props.userId,
        sessionID: this.props.sessionId,
      },
    });
    await this.setState({ rtmpStreamLink: fullUrl });
    return fullUrl;
  }

  /**
   * Alerts the user about the status of the streaming app
   * @param statusCode 2000 - Loading
   *                   2001 - Started Streaming
   *                   2002 - Error
   *                   2004 - Closing
   */
  onStatus(statusCode: NodeMediaClientStatusCode) {
    switch (statusCode) {
      case 2000:
        break;
      case 2001:
        Alert.alert('Meowl Mobile App is now streaming!');
        break;
      case 2002:
        Alert.alert(
          'The RTMP Stream Server or Port either does not exist or does not accept your credentials!',
        );
        break;
      case 2004:
        break;
      default:
        Alert.alert('Unknown status code:', statusCode);
    }
  }

  /**
   * Renders NodeCameraView that will serve as a streaming camera
   */
  render() {
    console.log(this.state.rtmpStreamLink);
    return (
      <NodeCameraView
        style={{ flex: 10, zIndex: 0 }}
        ref={(client: NodeMediaClientRef) => {
          this.client = client;
        }}
        outputUrl={this.state.rtmpStreamLink}
        camera={{
          cameraId: 1,
          cameraFrontMirror: this.props.isViewingFrontCamera,
        }}
        audio={{
          bitrate: this.props.audioBitRate,
          profile: 1,
          samplerate: 44100,
        }}
        video={{
          preset: 1,
          bitrate: this.props.videoBitRate,
          profile: 1,
          fps: this.props.fps,
          videoFrontMirror: false,
        }}
        smoothSkinLevel={3}
        autopreview={true}
        onStatus={(statusCode: NodeMediaClientStatusCode) => {
          this.onStatus(statusCode);
        }}
      />
    );
  }
}

export default CameraPublisher;
