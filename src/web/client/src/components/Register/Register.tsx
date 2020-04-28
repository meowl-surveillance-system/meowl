import React, {
  ChangeEvent,
  Component,
  ComponentState,
  FormEvent,
} from "react";
import { Redirect, Link as RouterLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

interface Props {
  isLoggedIn: boolean;
}
interface State {
  email: string;
  username: string;
  password: string;
  registeredBadMessage: string;
  registeredGoodMessage: string;
}

/**
 * A register form for users to register an account
 */
export default class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      registeredBadMessage: "",
      registeredGoodMessage: "",
    };
  }

  /**
   * Sets the appropriate state when a keyboard event is triggered
   * @params event - An event that records changes happening to an input field
   */
  onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    } as ComponentState);
  };

  /**
   * Submits the user credentials to the auth server
   * @params event - An event that records submission of a form element
   *
   * Changes the root level isLoggedIn state to True and redirects to the
   * "/streams" route if register submission is successful.
   * Otherwise, alert the user that register is not successful.
   */
  onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.email,
          username: this.state.username,
          password: this.state.password,
        }),
      });
      const msg = await res.text();
      if(msg === 'successfully added to pending accounts') {
        this.setState({ registeredGoodMessage: msg, registeredBadMessage: "" });
      }
      else {
        this.setState({ registeredBadMessage: msg, registeredGoodMessage: "" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Redirect user to "/" if user is already logged in
   * Otherwise, render the register form
   */
  render() {
    if (this.props.isLoggedIn) {
      return <Redirect to="/" />;
    }
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
          {this.state.registeredBadMessage && <Typography style={{color: "red"}}>{this.state.registeredBadMessage}</Typography>}
          {this.state.registeredGoodMessage && <Typography style={{color: "green"}}>{this.state.registeredGoodMessage}</Typography>}
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form noValidate onSubmit={this.onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="E-mail"
              name="email"
              onChange={this.onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              onChange={this.onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              onChange={this.onChange}
            />
            <Button fullWidth type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <Grid container>
              <Grid item>
                <RouterLink to="/login">
                  {"Already have an account? Sign In"}
                </RouterLink>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Container>
    );
  }
}
