import React from 'react';
import { Text, TextInput, View, Button, StatusBar, StyleSheet, PermissionsAndroid } from 'react-native';
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
      'flashenable': false,
      publishBtnTitle: "Publisherrr"
    };
  }

  async componentDidMount() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ]);
      console.log(granted);
      if (Object.keys(granted)
        .every((permission) => permission === PermissionsAndroid.RESULTS.GRANTED)) {
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
          outputUrl={"rtmp://34.71.99.27/show/stream"}
          camera={{ cameraId: 1, cameraFrontMirror: true }}
          audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
          video={{ preset: 1, bitrate: 500000, profile: 1, fps: 15, videoFrontMirror: false }}
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