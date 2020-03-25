import React from 'react';
import { Modal, Alert, View, Button, StatusBar, StyleSheet, PermissionsAndroid, Settings } from 'react-native';
import { Text, Input, Icon } from 'react-native-elements';
// @ts-ignore
import { NodeCameraView } from 'react-native-nodemediaclient';
import CameraPublisher from './components/camera-publisher/CameraPublisher';
import SettingsForm from './components/settings-form/SettingsForm';
import AppBar from './components/app-bar/AppBar';

interface Props { }

class App extends React.Component<Props, AppState> {
  vb: NodeMediaClientRef | undefined;

  constructor(props: Props) {
    super(props);
    this.state = {
      audioBitRate: 128000,
      flashEnabled: false,
      fps: 30,
      isPublishing: false,
      isViewingFrontCamera: true,
      modalVisible: false,
      outputLink: "rtmp://192.168.1.100/show/stream",
      videoBitRate: 8000000
    };
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

  updateState(state: any) {
    this.setState(state);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#333' }}>
        <StatusBar
          barStyle="dark-content"
        />
        <View style={{ flex: 6 }}>
          <CameraPublisher
            outputLink={this.state.outputLink}
            isViewingFrontCamera={this.state.isViewingFrontCamera}
            audioBitRate={this.state.audioBitRate}
            videoBitRate={this.state.videoBitRate}
            fps={this.state.fps}

            flashEnabled={this.state.flashEnabled}
            isPublishing={this.state.isPublishing}
          />
        </View>
        <SettingsForm
          audioBitRate={this.state.audioBitRate}
          fps={this.state.fps}
          modalVisible={this.state.modalVisible}
          outputLink={this.state.outputLink}
          videoBitRate={this.state.videoBitRate}
          updateProps={(props: any) => this.updateState(props)}
        />
        <View style={{ flex: 1 }}>
          <AppBar
            modalVisible={this.state.modalVisible}
            flashEnabled={this.state.flashEnabled}
            isPublishing={this.state.isPublishing}
            isViewingFrontCamera={this.state.isViewingFrontCamera}
            updateProps={(props: any) => this.updateState(props)}
          />
        </View>
      </View >
    );
  }

  componentWillUnmount() {
    this.vb!.stop();
  }
}

export default App;