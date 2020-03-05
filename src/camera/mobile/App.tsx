import React from 'react';
import { Text, View, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * A mobile application for streaming live to Meowl
 * TODO(chc5): Separate the Camera component inside App into another file
 * TODO(chc5): Convert the video type to flv for streaming via ffmpeg
 * TODO(chc5): Send the video recordings to Meowl via RTMP
 */
export default class App extends React.Component {
  camera = null;

  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.back,
    isRecording: false,
    mute: false,
    quality: "720p",
  }

  async componentDidMount() {
    await this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    // Camera roll Permission 
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });
  }

  handleCameraType = () => {
    const { cameraType } = this.state

    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    })
  }

  startRecording = async () => {
    if (this.camera && !this.state.isRecording) {
      const video = await this.camera.recordAsync({ quality: this.state.quality, mute: this.state.mute });
      this.setState({ isRecording: true, video: video });
    } else {
      alert("Camera does not have the permissions to open");
    }
  }

  stopRecording() {
    if (this.camera && this.state.isRecording) {
      this.camera.stopRecording();
      this.setState({ isRecording: false });
    }
  }

  render() {
    const { hasPermission } = this.state
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <SafeAreaView style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
          <Camera style={{ flex: 1 }}
            type={this.state.cameraType}
            ref={ref => { this.camera = ref }}
            ratio="16:9"
          >
            <View style={{ flex: 2, flexDirection: "row", justifyContent: "space-between", margin: 30 }}>
              {
                this.state.isRecording
                  ? (
                    <TouchableOpacity
                      style={{
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                      }}
                      onPress={() => this.stopRecording()}
                    >
                      <FontAwesome
                        name="camera"
                        style={{ color: "#fff", fontSize: 40 }}
                      />
                    </TouchableOpacity>
                  )
                  : (
                    <TouchableOpacity
                      style={{
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                      }}
                      onPress={() => this.startRecording()}
                    >
                      <FontAwesome
                        name="camera"
                        style={{ color: "#fff", fontSize: 40 }}
                      />
                    </TouchableOpacity>
                  )
              }
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress={() => this.handleCameraType()}
              >
                <MaterialCommunityIcons
                  name="camera-switch"
                  style={{ color: "#fff", fontSize: 40 }}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </SafeAreaView>
      );
    }
  }

}
