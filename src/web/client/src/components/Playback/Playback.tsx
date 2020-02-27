import React from 'react';
import ReactPlayer from 'react-player';

type myState = {
  tmpUrl: string;
  url: string;
}

export default class Playback extends React.Component {
  state: myState = {
    tmpUrl: "",
    url: ""
  }

  handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    event.preventDefault();
    this.setState({tmpUrl: event.currentTarget.value});
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    this.setState({ url: this.state.tmpUrl });
    this.setState({ tmpUrl: "" });
  };

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit} data-testid="form">
          <input type="text" value={this.state.tmpUrl} onChange={this.handleChange} data-testid="url" />
          <button type="submit">Enter URL</button>
        </form>
        <ReactPlayer url={this.state.url} controls={true} />
      </div>
    );
  }
}