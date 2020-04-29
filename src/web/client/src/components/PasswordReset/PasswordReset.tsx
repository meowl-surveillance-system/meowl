import React, {
  Component,
  FormEvent,
  ChangeEvent,
  ComponentState,
} from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

interface Props {
  match: any;
  history: any;
}
interface State {
  password: string;
  successMessage: string;
  failMessage: string;
}

export default class PasswordReset extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      password: "",
      successMessage: "",
      failMessage: "",
    };
  }

  async componentDidMount() {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetToken: this.props.match.params.token,
        }),
      };
      const res = await fetch("/auth/verifyToken", requestOptions);
      if (res.status === 400) {
        this.props.history.push("/");
      }
    } catch (e) {
      console.error(e);
    }
  }

  onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: this.state.password,
          resetToken: this.props.match.params.token,
        }),
      };
      const res = await fetch("/auth/submitPasswordReset", requestOptions);
      const msg = await res.json();
      if (msg === "Successfully updated password") {
        this.setState({ successMessage: msg, failMessage: "" });
      } else {
        this.setState({ failMessage: msg, successMessage: "" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    } as ComponentState);
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
          {this.state.failMessage && (
            <Typography style={{ color: "red" }}>
              {this.state.failMessage}
            </Typography>
          )}
          {this.state.successMessage && (
            <Typography style={{ color: "green" }}>
              {this.state.successMessage}
            </Typography>
          )}
          <Typography component="h1" variant="h5">
            Password Reset Form
          </Typography>
          <form noValidate onSubmit={this.onSubmit}>
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
          </form>
        </Grid>
      </Container>
    );
  }
}
