import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import Playback from './components/Playback/Playback';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';

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
      .then(isLoggedIn => this.setState( { isLoggedIn: isLoggedIn }))
      .catch(e => console.log(e));
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Navbar isLoggedIn={this.state.isLoggedIn} />
            <Switch>
              <Route exact path="/" component={Playback} />
              <Route exact path="/login" render={(props) => <Login {...props} isLoggedIn={this.state.isLoggedIn} />} />
              <Route exact path="/register" render={(props) => <Register {...props} isLoggedIn={this.state.isLoggedIn} />} />
            </Switch>
           </div>
        </BrowserRouter>
      </div>
    )
  };
}

export default App;
