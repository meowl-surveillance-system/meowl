import React from 'react';
import { Modal, Alert, View, Button, StatusBar, StyleSheet, PermissionsAndroid } from 'react-native';
import { Text, Input, Icon } from 'react-native-elements';
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
      outputLink: "rtmp://192.168.1.100/show/stream",
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
          style={{ flex: 10, zIndex: 0 }}
          ref={(vb: any) => { this.vb = vb }}
          outputUrl={this.state.outputLink}
          camera={{ cameraId: 1, cameraFrontMirror: true }}
          audio={{ bitrate: this.state.audioBitRate, profile: 1, samplerate: 44100 }}
          video={{ preset: 1, bitrate: this.state.videoBitRate, profile: 1, fps: this.state.fps, videoFrontMirror: false }}
          smoothSkinLevel={3}
          autopreview={true}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <Text style={{ fontSize: 22 }}>
            Stream Link:
          </Text>
          <Input
            onChange={(outputLink) => this.setState({ outputLink: outputLink })}
            value={this.state.outputLink}
            placeholder="rtmp://"
          />
          <Button
            onPress={() => {
              this.setState({ modalVisible: false });
            }}
            title="Done"
          />
        </Modal>

        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "navy" }}
        >
          {
            this.state.isPublish
              ? (
                <Icon
                  type="material-community"
                  name="video-off"
                  onPress={() => {
                    this.vb!.stop();
                    this.setState({ publishBtnTitle: 'Start Publish', isPublish: false });
                  }}
                  reverse={true}
                />
              )
              : (
                <Icon
                  type="material-community"
                  name="video"
                  style={{ backgroundColor: "transparent" }}
                  onPress={() => {
                    this.vb!.start();
                    this.setState({ publishBtnTitle: 'Stop Publish', isPublish: true });
                  }}
                  reverse={true}
                />
              )
          }
          < Icon
            type="material-community"
            name="settings"
            onPress={() => {
              this.setState({ modalVisible: true });
            }}
            reverse={true}
          />
          <Icon
            type="material-community"
            name="video-switch"
            onPress={() => {
              this.vb!.switchCamera();
              this.setState({ flashEnable: false });
            }}
            reverse={true}
          />
          {
            this.state.flashEnable
              ? (
                <Icon
                  type="material-community"
                  name="flash-off"
                  onPress={() => {
                    this.vb!.flashEnable(!this.state.flashEnable);
                    this.setState({ flashEnable: !this.state.flashEnable })
                  }}
                  reverse={true}
                  underlayColor="transparent"
                />
              )
              : (
                <Icon
                  type="material-community"
                  name="flash"
                  onPress={() => {
                    this.vb!.flashEnable(!this.state.flashEnable);
                    this.setState({ flashEnable: !this.state.flashEnable })
                  }}
                  reverse={true}
                />
              )
          }
        </View>
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