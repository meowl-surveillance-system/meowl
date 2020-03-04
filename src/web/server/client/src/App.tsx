import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import Playback from './components/Playback/Playback';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Playback} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
