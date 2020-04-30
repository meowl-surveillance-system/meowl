import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

interface Props {
  isLoggedIn: boolean;
  isAdmin: boolean;
  onAuthChange: (authState: boolean, adminState: boolean) => void;
}
interface State { }

/**
 * A navigation bar component for easy access to other pages
 */
export default class Navbar extends Component<Props, State> {
  /**
   * Logout the user by sending a logout request to the auth server
   */
  logoutSubmit = (): void => {
    const requestOptions = {
      method: "POST",
    };
    fetch(`/auth/logout`, requestOptions);
    this.props.onAuthChange(false, false);
  };

  /**
   * Renders the button on navbar when user is admin
   */
  renderIsAdmin = () => {
    return (
      <RouterLink
        to="/pendingAccounts"
        style={{
          paddingLeft: "10px",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        PendingAccounts
      </RouterLink>
    );
  };

  /**
   * Renders the buttons on the navbar when the user is authenticated
   */
  renderIsLoggedIn = () => {
    return (
      <div>
        <RouterLink
          to="/uploadTrainingData"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          UploadTrainingData
        </RouterLink>
        <RouterLink
          to="/liveStreams"
          style={{ paddingLeft: "10px", color: "inherit", textDecoration: "none" }}
        >
          LiveStreams
        </RouterLink>
        <RouterLink
          to="/streams"
          style={{
            paddingLeft: "10px",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Streams
        </RouterLink>
        {this.props.isAdmin && this.renderIsAdmin()}
        <RouterLink
          to="/"
          style={{
            paddingLeft: "10px",
            color: "inherit",
            textDecoration: "none",
          }}
          onClick={this.logoutSubmit}
        >
          Logout
        </RouterLink>
      </div>
    );
  };

  /**
   * Renders the buttons on the navbar when the user is not authenticated
   */
  renderIsNotLoggedIn = () => {
    return (
      <div>
        <RouterLink
          to="/login"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Login
        </RouterLink>
        <RouterLink
          to="/register"
          style={{
            paddingLeft: "10px",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Register
        </RouterLink>
      </div>
    );
  };

  /**
   * Renders the navbar appropriately based on the isLoggedIn prop
   */
  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <RouterLink
            to="/"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <Typography variant="inherit">Meowl</Typography>
          </RouterLink>
          <Grid
            container
            alignItems="flex-start"
            justify="flex-end"
            direction="row"
          >
            {this.props.isLoggedIn
              ? this.renderIsLoggedIn()
              : this.renderIsNotLoggedIn()}
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}
