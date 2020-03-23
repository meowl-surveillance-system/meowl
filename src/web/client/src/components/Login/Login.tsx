import React, { ComponentState, Component, ChangeEvent } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, FormControl, TextField, Button, Typography } from '@material-ui/core';

interface Props {
  isLoggedIn: boolean
}

interface State {
  username: string;
  password: string;
}

export default class Login extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let target: HTMLInputElement = (event.target as HTMLInputElement);
    let label: string = target.name;
    let value: string = target.value;
    this.setState({ [label]: value } as ComponentState);
  };

  loginSubmit = (): void => {
    const requestOptions = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username:this.state.username, password:this.state.password})
    };
    fetch(`/auth/login`, requestOptions).then(res => {
      this.setState({username:"" + res.status});
    });
  }
  logoutSubmit = (): void => {
    const requestOptions = {
      method: "POST",
    };
    fetch(`/auth/logout`, requestOptions).then(res => {
      this.setState({username:"" + res.status});
    });
  }

  render() {
    if(this.props.isLoggedIn) {
      return <Redirect to="/" />
    }
    return (
      <Container>
        <Typography variant="h5" component="h6">Login</Typography>
        <FormControl data-testid="form">
          <TextField
            id="username-input"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
            placeholder="Username"
            inputProps={{ "data-testid": "username-test" }}
          />
          <TextField
            id="password-input"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="Password"
	    type="password"
            inputProps={{ "data-testid": "password-test" }}
          />
          <Button
            onClick={() => this.loginSubmit()}
          >
            Login
          </Button>
          <Button
            onClick={() => this.logoutSubmit()}
          >
            Logout
          </Button>
        </FormControl>
      </Container >
    );
  }
}
