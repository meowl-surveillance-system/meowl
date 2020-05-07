import React from 'react';
import { View, StatusBar } from 'react-native';
import CameraPublisher from './components/camera-publisher/CameraPublisher';
import SettingsForm from './components/settings-form/SettingsForm';
import AppBar from './components/app-bar/AppBar';
import LoginForm from './components/login-form/LoginForm';
import AsyncStorage from '@react-native-community/async-storage';
import { getItemFromStore } from './utils/utils';

interface Props { }

/**
 * The overall application component for Meowl Mobile
 */
class App extends React.Component<Props, AppState> {
  /**
   * Sets default state of the App Component
   * @param props
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      audioBitRate: 128000,
      cameraId: '',
      flashEnabled: false,
      fps: 30,
      isLoggedIn: false,
      isPublishing: false,
      isViewingFrontCamera: true,
      settingsFormVisible: false,
      requestServerUrl: 'http://192.168.1.0:8081',
      rtmpServerUrl: 'rtmp://127.0.0.1:1234',
      sessionId: '',
      userId: '',
      videoBitRate: 8000000,
    };
  }

  /**
   * Retrieve items from AsyncStorage to set App State
   */
  async componentDidMount() {
    const requestServerUrl: string =
      await getItemFromStore('meowlRequestServerUrl', this.state.requestServerUrl);
    const rtmpServerUrl: string =
      await getItemFromStore('meowlRtmpServerUrl', this.state.rtmpServerUrl);
    this.setState({ requestServerUrl, rtmpServerUrl });
  }

  /**
   * Updates the state of the App Component
   * @param state - State to be updated
   *
   * This method is mainly used to pass down as
   * a property method for child components.
   */
  updateState(state: object) {
    return this.setState(state);
  }

  /**
   * Store states into AsyncStorage for future reference
   * @param prevProps - Previous property state of app
   * @param prevState - Previous state of app
   */
  componentDidUpdate(prevProps: Props, prevState: AppState) {
    if (this.state.requestServerUrl !== prevState.requestServerUrl) {
      AsyncStorage.setItem('meowlRequestServerUrl', this.state.requestServerUrl);
    }
    if (this.state.rtmpServerUrl !== prevState.rtmpServerUrl) {
      AsyncStorage.setItem('meowlRtmpServerUrl', this.state.rtmpServerUrl);
    }
  }

  /**
   * Renders the App component that contains several main components
   *
   * These main components include CameraPublisher, SettingsForm and AppBar
   */
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#333' }}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 6 }}>
          <CameraPublisher
            rtmpServerUrl={this.state.rtmpServerUrl}
            isViewingFrontCamera={this.state.isViewingFrontCamera}
            audioBitRate={this.state.audioBitRate}
            videoBitRate={this.state.videoBitRate}
            fps={this.state.fps}
            flashEnabled={this.state.flashEnabled}
            isPublishing={this.state.isPublishing}
            cameraId={this.state.cameraId}
            userId={this.state.userId}
            sessionId={this.state.sessionId}
          />
        </View>
        <SettingsForm
          audioBitRate={this.state.audioBitRate}
          fps={this.state.fps}
          settingsFormVisible={this.state.settingsFormVisible}
          requestServerUrl={this.state.requestServerUrl}
          rtmpServerUrl={this.state.rtmpServerUrl}
          videoBitRate={this.state.videoBitRate}
          updateProps={(props: any) => this.updateState(props)}
        />
        <LoginForm
          isLoggedIn={this.state.isLoggedIn}
          requestServerUrl={this.state.requestServerUrl}
          rtmpServerUrl={this.state.rtmpServerUrl}
          updateProps={(props: any) => this.updateState(props)}
        />
        <View style={{ flex: 1 }}>
          <AppBar
            settingsFormVisible={this.state.settingsFormVisible}
            flashEnabled={this.state.flashEnabled}
            isPublishing={this.state.isPublishing}
            isViewingFrontCamera={this.state.isViewingFrontCamera}
            updateProps={(props: any) => this.updateState(props)}
          />
        </View>
      </View>
    );
  }
}

export default App;
