import React from 'react';
import { Modal, Button, Alert } from 'react-native';
import { Text, Input } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from '@react-native-community/cookies';
import { login } from './../../utils/utils';

/**
 * A form for logging in and getting rtmp link
 */

interface LoginFormState {
  username: string;
  password: string;
  cameraId: string;
}

/**
 * A form to log into the request server and get credentials for streaming
 */
class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  constructor(props: LoginFormProps) {
    super(props);
    this.state = {
      username: 'wack',
      password: 'boi',
      cameraId: '',
    };
  }

  /**
   * Creates a new camera ID for this app if it doesn't exists
   */
  async componentDidMount() {
    const cameraId: string | null = await AsyncStorage.getItem('meowlCameraId');
    if (cameraId) {
      this.setState({ cameraId });
    } else {
      const newCameraId: string = uuidv4();
      this.setState({ cameraId: newCameraId });
      await AsyncStorage.setItem('meowlCameraId', newCameraId);
    }
    await CookieManager.clearAll();
  }

  /**
   * Handles the login response after the login attempt
   */
  async handleLogin() {
    const loginResponse: Response | null = await login(
      {
        username: this.state.username,
        password: this.state.password,
      },
      this.props.requestServerUrl,
    );
    if (loginResponse) {
      if (loginResponse.ok) {
        return loginResponse;
      } else {
        Alert.alert('Wrong username or password.');
        return null;
      }
    } else {
      Alert.alert('Wrong IP/Port Number. Please specify http:// or https://');
      return null;
    }
  }

  /**
   * Retrieve credentials for RTMP streaming
   */
  async retrieveRtmpCredentials() {
    try {
      const rtmpResponse = await fetch(
        this.props.requestServerUrl + '/auth/rtmpRequest',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            credentials: 'include',
          },
        },
      );
      if (rtmpResponse.ok) {
        const responseBody = await rtmpResponse.json();
        return responseBody;
      } else {
        Alert.alert('Incorrect cookie credentials from logging in.');
        return null;
      }
    } catch (error) {
      Alert.alert('Error:', error.toString());
      return null;
    }
  }

  /**
   * Logins the user into the server and get credentials for streaming
   */
  async onSubmit() {
    const loginResponse: Response | null = await this.handleLogin();
    if (loginResponse) {
      const rtmpCredentials = await this.retrieveRtmpCredentials();
      if (rtmpCredentials) {
        this.updateProps({
          isLoggedIn: true,
          userId: rtmpCredentials['userId'],
          // TODO(yliu): Change this to sessionId after server changes this minor inconsistency
          sessionId: rtmpCredentials['sessionID'],
          cameraId: this.state.cameraId,
        });
        this.setState({
          username: '',
          password: '',
        });
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Updates the main state of outer components
   * @param props - Property to be updated
   */
  updateProps(props: object) {
    this.props.updateProps(props);
  }

  /**
   * Clears all privacy information from this form
   */
  componentWillUnmount() {
    this.setState({
      username: '',
      password: '',
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
        visible={!this.props.isLoggedIn}>
        <Text style={{ fontSize: 22 }}>Request Server IP & Port Number:</Text>
        <Input
          onChangeText={requestServerUrl =>
            this.updateProps({ requestServerUrl })
          }
          value={this.props.requestServerUrl}
        />
        <Text style={{ fontSize: 22 }}>Username:</Text>
        <Input
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
        />
        <Text style={{ fontSize: 22 }}>Password:</Text>
        <Input
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button onPress={() => this.onSubmit()} title="Submit" />
      </Modal>
    );
  }
}

export default LoginForm;
