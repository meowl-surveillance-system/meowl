import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";

import Playback from "./components/Playback/Playback";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import LiveStream from "./components/LiveStream/LiveStream";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

interface Props {}
interface State {
  isLoggedIn: boolean;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isLoggedIn: false };
  }

  // To be passed as a callback to handle authentication changes
  onAuthChange = (authState: boolean) => {
    this.setState({ isLoggedIn: authState });
  };

  componentDidMount() {
    fetch("/auth/isLoggedIn")
      .then((res) => res.json())
      .then((isLoggedIn) => {
        this.setState({ isLoggedIn: isLoggedIn });
        console.log(this.state.isLoggedIn);
      })
      .catch((e) => console.log(e));
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Navbar
              isLoggedIn={this.state.isLoggedIn}
              onAuthChange={this.onAuthChange}
            />
            <Switch>
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
                  <Register
                    {...props}
                    isLoggedIn={this.state.isLoggedIn}
                    onAuthChange={this.onAuthChange}
                  />
                )}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
