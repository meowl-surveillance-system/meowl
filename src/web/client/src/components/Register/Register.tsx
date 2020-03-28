import React, {
  ChangeEvent,
  Component,
  ComponentState,
  FormEvent,
} from "react";
import { Redirect, Link as RouterLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

interface Props {
  isLoggedIn: boolean;
  history: any;
  onAuthChange: (authState: boolean) => void;
}
interface State {
  email: string;
  username: string;
  password: string;
}

export default class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
    };
  }

  onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    } as ComponentState);
  };

  onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    fetch("/auth/register", {
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
    })
      .then((res) => res.text())
      .then((msg) => {
        // Did not Successfully register
        if (msg === "Bad username") {
          console.log("no good");
        }
        // Successfully registered
        else {
          console.log(msg);
          this.props.onAuthChange(true);
          this.props.history.push("/streams");
        }
      })
      .catch((e) => console.log(e));
  };

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
                <Link variant="body1">
                  <RouterLink to="/login">
                    {"Already have an account? Sign In"}
                  </RouterLink>
                </Link>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Container>
    );
  }
}