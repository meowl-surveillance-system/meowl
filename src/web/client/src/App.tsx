import React, { Component } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import './App.css';

import Playback from './components/Playback/Playback';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

interface Props {}
interface State {
  isLoggedIn: boolean
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isLoggedIn: false }
  }

  componentDidMount() {
    // Check if user is logged in by calling an express route. I don't know how well this works yet.
    fetch('/auth/isLoggedIn')
      .then(res => res.json())
      .then(isLoggedIn => {
        this.setState( { isLoggedIn: isLoggedIn })
        console.log(this.state.isLoggedIn)})
      .catch(e => console.log(e));
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Navbar isLoggedIn={this.state.isLoggedIn} />
            <Switch>
              <ProtectedRoute
                exact
                path="/streams"
                component={Playback}
                isLoggedIn={this.state.isLoggedIn}
                redirectPath="/" />
              <ProtectedRoute 
                exact 
                path="/login"
                component={Login}
                isLoggedIn={!this.state.isLoggedIn}
                redirectPath="/" />
              <ProtectedRoute 
                exact 
                path="/register" 
                component={Register}
                isLoggedIn={!this.state.isLoggedIn}
                redirectPath="/" />
            </Switch>
           </div>
        </BrowserRouter>
      </div>
    )
  };
}

export default App;
