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

interface Props {}
interface State {
  username: string;
  successMessage: string;
  failMessage: string;
}

export default class AccountRecovery extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      successMessage: "",
      failMessage: "",
    };
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
          username: this.state.username,
        }),
      };
      const res = await fetch("/auth/beginPasswordReset", requestOptions);
      const msg = await res.json();
      if (msg === "Successfully sent password reset email") {
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
            Account Recovery
          </Typography>
          <Typography>
            {
              "Forgot your account's password? Well damn. Enter your username and we'll send you a recovery link to the associated e-mail"
            }
          </Typography>
          <form noValidate onSubmit={this.onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              onChange={this.onChange}
            />
            <Button fullWidth type="submit" variant="contained" color="primary">
              Send Recovery Email
            </Button>
          </form>
        </Grid>
      </Container>
    );
  }
}
