import React, {
  ComponentState,
  Component,
  ChangeEvent,
  FormEvent,
} from "react";
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
  onAuthChange: (authState: boolean, adminState: boolean) => void;
}
interface State {
  username: string;
  password: string;
}

/**
 * A Login form for users to login
 */
export default class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  /**
   * Sets the appropriate state when a keyboard event is triggered
   * @params event - An event that records changes happening to an input field
   */
  handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const label: string = target.name;
    const value: string = target.value;
    this.setState({ [label]: value } as ComponentState);
  };

  /**
   * Submits the user credentials to the auth server
   * @params event - An event that records submission of a form element
   *
   * Changes the root level isLoggedIn state to True and redirects to the
   * "/streams" route if login submission is successful.
   * Otherwise, alert the user that login is not successful.
   */
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
        const adminRes = await fetch(`/auth/isAdmin`);
        const isAdmin = await adminRes.json();
        this.props.onAuthChange(true, isAdmin);
        this.props.history.push("/streams");
      } else {
        console.log(msg);
        alert(msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Renders a Login form for users to input their credentials
   */
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
