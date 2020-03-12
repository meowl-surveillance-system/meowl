import React from 'react';
import { Text, View, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RNFFmpeg } from 'react-native-ffmpeg';
import RnBgTask from 'react-native-bg-thread';

/**
 * A mobile application for streaming live to Meowl
 * TODO(chc5): Separate the Camera component inside App into another file
 * TODO(chc5): Convert the video type to flv for streaming via ffmpeg
 * TODO(chc5): Send the video recordings to Meowl via RTMP
 * Ongoing Bug with Expo Camera: max 
 */
export default class App extends React.Component {
  camera = null;
  thread = null;
  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.back,
    isStreaming: false,
    mute: false,
    quality: "720p",
    maxDuration: 1
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
    const cameraStatus = (await Permissions.askAsync(Permissions.CAMERA)).status;
    const audioStatus = (await Permissions.askAsync(Permissions.AUDIO_RECORDING)).status;
    this.setState({ hasPermission: cameraStatus === 'granted' && audioStatus === 'granted' });
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

  startStreaming = async () => {
    if (!this.camera) {
      alert("Camera does not have the permissions to open");
    }
    await this.setState({ isStreaming: true });
    while (this.camera && this.state.isStreaming) {
      console.log("Streaming....");
      const video = await this.camera.recordAsync({
        quality: this.state.quality,
        mute: this.state.mute,
        maxDuration: this.state.maxDuration
      });
      this.streamVideoOut(video);
      console.log("Next");
    }
  }

  streamVideoOut = async (video) => {
    if (video === null) {
      console.log("Video stream is null");
    } else {
      RnBgTask.runInBackground_withPriority("NORMAL", () => {
        RNFFmpeg.executeWithArguments(['-y',
          '-f', 'mp4',
          '-i', video.uri, '-c:v', 'copy', '-map',
          '0:0', '-f', 'flv',
          'rtmp://35.202.178.94:1935/show/stream']).then(rc => {
            console.log("Finished sending...");
          });
      });
    }
  }

  stopStreaming = () => {
    if (this.camera && this.state.isStreaming) {
      this.camera.stopRecording();
      this.setState({ isStreaming: false });
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
        <SafeAreaView style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }}
            type={this.state.cameraType}
            ref={ref => { this.camera = ref }}
            ratio="16:9"
          >
            <View style={{ flex: 2, flexDirection: "row", justifyContent: "space-between", margin: 30 }}>
              {
                this.state.isStreaming
                  ? (
                    <TouchableOpacity
                      style={{
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                      }}
                      onPress={() => this.stopStreaming()}
                    >
                      <MaterialCommunityIcons
                        name="stop"
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
                      onPress={() => this.startStreaming()}
                    >
                      <MaterialCommunityIcons
                        name="video"
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
                  name="video-switch"
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
