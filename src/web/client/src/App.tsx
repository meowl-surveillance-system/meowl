import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import Playback from './components/Playback/Playback';
import Register from './components/Register/Register';
import Login from './components/Login/Login';

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
      .then(res => { this.setState( { isLoggedIn: res.status === 200 ? true : false } )})
      .catch(e => console.log(e));
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Playback} />
            <Route exact path="/login" render={(props) => <Login {...props} isLoggedIn={this.state.isLoggedIn} />} />
            <Route exact path="/register" render={(props) => <Register {...props} isLoggedIn={this.state.isLoggedIn} />} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  };
}

export default App;
