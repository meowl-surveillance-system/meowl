import React from 'react';
import { Text, TouchableHighlight, Modal, Alert, TextInput, View, Button, StatusBar, StyleSheet, PermissionsAndroid } from 'react-native';
// @ts-ignore
import { NodeCameraView } from 'react-native-nodemediaclient';

class App extends React.Component<any, any> {
  vb: NodeMediaClientRef | undefined;
  static navigationOptions = {
    title: 'Push',
  };

  constructor(props: any) {
    super(props);
    this.state = {
      flashEnable: false,
      publishBtnTitle: "Start Publish",
      isPublish: false,
      cameraId: 1,
      modalVisible: false,
      outputLink: "rtmp://34.71.99.27/show/stream",
      videoBitRate: 8000000,
      audioBitRate: 128000,
      fps: 30,
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

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#333' }}>
        <StatusBar
          barStyle="dark-content"
        />
        <NodeCameraView
          style={{ flex: 1 }}
          ref={(vb: any) => { this.vb = vb }}
          outputUrl={this.state.outputLink}
          camera={{ cameraId: 1, cameraFrontMirror: true }}
          audio={{ bitrate: this.state.audioBitRate, profile: 1, samplerate: 44100 }}
          video={{ preset: 1, bitrate: this.state.videoBitRate, profile: 1, fps: this.state.fps, videoFrontMirror: false }}
          smoothSkinLevel={3}
          autopreview={true}
        />
        <Button
          onPress={() => {
            if (this.state.isPublish) {
              this.setState({ publishBtnTitle: 'Start Publish', isPublish: false });
              this.vb!.stop();
            } else {
              this.setState({ publishBtnTitle: 'Stop Publish', isPublish: true });
              this.vb!.start();
            }
          }}
          title={this.state.publishBtnTitle}
          color="#841584"
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{ marginTop: 22 }}>
            <Button
              onPress={() => {
                this.setState({ modalVisible: false });
              }}
              title="Cancel">
            </Button>
          </View>
        </Modal>

        <Button
          onPress={() => {
            this.setState({ modalVisible: true });
          }}
          title="Settings"
        />
        <Button
          onPress={() => {
            this.vb!.switchCamera();
            this.setState({ flashEnable: false });
          }}
          title="Reverse Camera"
        />
        <Button
          onPress={() => {
            this.vb!.flashEnable(!this.state.flashEnable);
            this.setState({ flashEnable: !this.state.flashEnable })
          }}
          title="Flashlight"
        />
      </View >
    );
  }

  componentWillUnmount() {
    this.vb!.stop();
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default App;