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
  groupId: string;
  username: string;
  successMessage: string;
  failMessage: string;
}

/**
 * A component for adding a user to a group
 */
export default class GroupForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      groupId: "",
      username: "",
      successMessage: "",
      failMessage: "",
    };
  }

  /**
   * Submits the inputted groupId and username to the backend to add the user to a group
   * If successful, a success message will be displayed, otherwise a fail message will be displayed.
   * @params event - An event that records submission of a form element
   */
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
          groupId: this.state.groupId,
          username: this.state.username
        }),
      };
      const res = await fetch("/api/addUserGroup", requestOptions);
      const msg = await res.text();
      if (msg === "Successfully added user to group") {
        this.setState({ successMessage: msg, failMessage: "" });
      } else {
        this.setState({ failMessage: msg, successMessage: "" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * Sets the appropriate state when a keyboard event is triggered
   * @params event - An event that records changes happening to an input field
   */
  onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    } as ComponentState);
  };

  /**
   * Renders out a form for the user to input the new password
   */
  render() {
    return (
      <Container component="main" maxWidth="xs">
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
            Add User to Group
          </Typography>
          <Typography>
            {"Add user to a group. If groupId does not exist, a new group will be created with the provided groupId"}
          </Typography>
          <form noValidate onSubmit={this.onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="groupId"
              label="GroupId"
              onChange={this.onChange}
            />
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
              Submit
            </Button>
          </form>
      </Container>
    );
  }
}
