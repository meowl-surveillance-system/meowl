import React from 'react';
import { Modal, Button, Alert } from 'react-native';
import { Text, Input } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';

/**
 * A form for logging in and getting rtmp link
 * TODO(chc5): Create unit tests for Login component
 */

interface LoginFormState {
  username: string;
  password: string;
  serverLink: string;
  cameraId: string;
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  constructor(props: LoginFormProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      serverLink: '',
      cameraId: ''
    }
  }

  async componentDidMount() {
    const cameraId: string | null = await AsyncStorage.getItem('meowlCameraId');
    if (cameraId) {
      this.setState({ cameraId });
    } else {
      const newCameraId: string = uuidv4();
      this.setState({ cameraId: newCameraId });
      await AsyncStorage.setItem('meowlCameraId', newCameraId);
    }
  }

  async onSubmit() {
    const loginResponse = await fetch(this.state.serverLink + '/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        credentials: 'include',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    });
    if (loginResponse.ok) {
      const rtmpResponse = await fetch(this.state.serverLink + '/auth/rtmpRequest', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          credentials: 'include',
        }
      });
      if (rtmpResponse.ok) {
        const responseBody = await rtmpResponse.json();
        this.updateProps({
          isLoggedIn: true,
          userId: responseBody['userId'],
          sessionId: responseBody['sessionId'],
          cameraId: this.state.cameraId
        });
      } else {
        Alert.alert('RTMP Server failed to provide session and user credentials');
      }
    } else {
      Alert.alert('Wrong username/password/IP');
    }
  }

  /**
   * Updates the main state of outer components
   * @param props - Property to be updated
   */
  updateProps(props: object) {
    this.props.updateProps(props);
  }

  componentWillUnmount() {
    this.setState({
      username: '',
      password: '',
      serverLink: ''
    });
  }

  /**
   * Renders SettingsForm component with inputs that updates the overall App state
   */
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={!this.props.isLoggedIn}
      >
        <Text style={{ fontSize: 22 }}>
          Request Server IP & Port Number:
        </Text>
        <Input
          onChangeText={(serverLink) => this.setState({ serverLink })}
          value={this.state.serverLink}
        />
        <Text style={{ fontSize: 22 }}>
          Username:
        </Text>
        <Input
          onChangeText={(username) => this.setState({ username })}
          value={this.state.username}
        />
        <Text style={{ fontSize: 22 }}>
          Password:
        </Text>
        <Input
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
        />
        <Button
          onPress={() => this.onSubmit}
          title="Submit"
        />
      </Modal>
    );
  }
}

export default LoginForm;