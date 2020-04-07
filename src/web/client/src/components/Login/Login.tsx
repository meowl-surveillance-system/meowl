import React, {
  ComponentState,
  Component,
  ChangeEvent,
  FormEvent,
} from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";

interface Props {
  isLoggedIn: boolean;
  history: any;
  onAuthChange: (authState: boolean) => void;
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
    event.preventDefault();
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const label: string = target.name;
    const value: string = target.value;
    this.setState({ [label]: value } as ComponentState);
  };

  loginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
      };
      const res = await fetch(`/auth/login`, requestOptions);
      const msg = await res.text();
      if (msg === "successfully logged in") {
        this.props.onAuthChange(true);
        this.props.history.push("/streams");
      } else {
        console.log(msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Typography variant="h5" component="h6">
            Login
          </Typography>
          <form noValidate onSubmit={this.loginSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username-input"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              placeholder="Username"
              inputProps={{ "data-testid": "username-test" }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password-input"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              placeholder="Password"
              type="password"
              inputProps={{ "data-testid": "password-test" }}
            />
            <Button fullWidth type="submit" variant="contained" color="primary">
              Login
            </Button>
          </form>
        </Grid>
      </Container>
    );
  }
}
