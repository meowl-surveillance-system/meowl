import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";

import Playback from "./components/Playback/Playback";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import NotificationList from "./components/Notification/NotificationList";
import Navbar from "./components/Navbar/Navbar";
import LiveStream from "./components/LiveStream/LiveStream";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import TrainingDataUploader from "./components/TrainingDataUploader/TrainingDataUploader";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import PendingAccounts from "./components/PendingAccounts/PendingAccounts";
import UserGroups from "./components/UserGroups/UserGroups";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import AccountRecovery from "./components/AccountRecovery/AccountRecovery";

interface Props { }
interface State {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

/**
 * Root level component. Defines the routing structure of the overall app.
 */
class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isLoggedIn: false, isAdmin: false };
  }

  /**
   * To be passed as a callback to handle authentication changes
   * @params authState - The authentication state of the user
   */
  onAuthChange = (authState: boolean, adminState: boolean) => {
    this.setState({ isLoggedIn: authState, isAdmin: adminState });
  };

  /**
   * Make request to auth server to check if user is logged in.
   * If a user refreshes the page, the isLoggedIn state will be
   * grabbed from the auth server.
   */
  componentDidMount() {
    fetch("/auth/isLoggedIn")
      .then((res) => res.json())
      .then((isLoggedIn) => {
        this.setState({ isLoggedIn: isLoggedIn });
        console.log(this.state.isLoggedIn);
        if (isLoggedIn === true) {
          fetch("/auth/isAdmin")
            .then((res) => res.json())
            .then((isAdmin) => {
              this.setState({ isAdmin: isAdmin });
              console.log(this.state.isAdmin);
            })
            .catch((e) => console.error(e));
        }
      })
      .catch((e) => console.error(e));
  }

  /**
   * Defines a set of routes for the application
   */
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Navbar
              isLoggedIn={this.state.isLoggedIn}
              isAdmin={this.state.isAdmin}
              onAuthChange={this.onAuthChange}
            />
            <Switch>
              <ProtectedRoute
                exact
                path="/uploadTrainingData"
                component={TrainingDataUploader}
                isLoggedIn={this.state.isLoggedIn}
                redirectPath="/"
              />
              <ProtectedRoute
                exact
                path="/liveStreams"
                component={LiveStream}
                isLoggedIn={this.state.isLoggedIn}
                redirectPath="/"
              />
              <ProtectedRoute
                exact
                path="/streams"
                component={Playback}
                isLoggedIn={this.state.isLoggedIn}
                redirectPath="/"
              />
              <Route
                exact
                path="/login"
                render={(props) => (
                  <Login
                    {...props}
                    isLoggedIn={this.state.isLoggedIn}
                    onAuthChange={this.onAuthChange}
                  />
                )}
              />
              <Route
                exact
                path="/register"
                render={(props) => (
                  <Register {...props} isLoggedIn={this.state.isLoggedIn} />
                )}
              />
              <ProtectedRoute
                exact
                path="/notifications"
                component = {NotificationList}
                isLoggedIn={this.state.isLoggedIn}
                redirectPath="/"
              />
              <Route
                exact
                path="/accountRecovery"
                render={(props) => <AccountRecovery {...props} />}
              />
              <Route
                exact
                path="/resetPassword/:token"
                render={(props) => <PasswordReset {...props} />}
              />
              <AdminRoute
                exact
                path="/pendingAccounts"
                component={PendingAccounts}
                isLoggedIn={this.state.isLoggedIn}
                isAdmin={this.state.isAdmin}
                redirectPath="/"
              />
              <AdminRoute
                exact
                path="/userGroups"
                component={UserGroups}
                isLoggedIn={this.state.isLoggedIn}
                isAdmin={this.state.isAdmin}
                redirectPath="/"
              />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
