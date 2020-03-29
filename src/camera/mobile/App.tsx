import React from 'react';
import { View, StatusBar } from 'react-native';
import CameraPublisher from './components/camera-publisher/CameraPublisher';
import SettingsForm from './components/settings-form/SettingsForm';
import AppBar from './components/app-bar/AppBar';
import LoginForm from './components/login-form/LoginForm';

interface Props { }

/**
 * The overall application component for Meowl Mobile
 * 
 * TODO(chc5): Create unit tests for App component
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
      outputLink: "rtmp://34.71.199.141:1935",
      sessionId: '',
      userId: '',
      videoBitRate: 8000000,
    };
  }

  /**
   * Updates the state of the App Component
   * @param state - State to be updated
   * 
   * This method is mainly used to pass down as 
   * a property method for child components.
   */
  updateState(state: object) {
    this.setState(state);
  }

  /**
   * Renders the App component that contains several main components
   * 
   * These main components include CameraPublisher, SettingsForm and AppBar
   */
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

            cameraId={this.state.cameraId}
            userId={this.state.userId}
            sessionId={this.state.sessionId}
          />
        </View>
        <SettingsForm
          audioBitRate={this.state.audioBitRate}
          fps={this.state.fps}
          settingsFormVisible={this.state.settingsFormVisible}
          outputLink={this.state.outputLink}
          videoBitRate={this.state.videoBitRate}
          updateProps={(props: any) => this.updateState(props)}
        />
        <LoginForm
          isLoggedIn={this.state.isLoggedIn}
          outputLink={this.state.outputLink}
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
      </View >
    );
  }
}

export default App;