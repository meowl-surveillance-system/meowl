import React, { ComponentState } from 'react';
import ReactPlayer from 'react-player';

type myState = {
  tmpUrl: string;
  url: string;
  startTime: string;
  vidId: string;
}

export default class Playback extends React.Component {
  state: myState = {
    tmpUrl: "",
    url: "",
    startTime: "",
    vidId: ""
  }

  handleChange = (field: string) => (event: React.FormEvent<HTMLInputElement>): void => {
    event.preventDefault();
    this.setState({ [field]: event.currentTarget.value} as ComponentState);
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    this.setState({ url: this.state.tmpUrl });
    this.setState({ tmpUrl: "" });
  };

  retrieveVideo = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    fetch(`http://localhost:8081/api/getVideo/?start=${this.state.startTime}&id=${this.state.vidId}`)
    .then(res => res.blob())
    .then(blob => {
      const vidUrl = URL.createObjectURL(new Blob([blob]));
      this.setState({ url: vidUrl });
    })
      
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit} data-testid="form">
          <label>Video URL</label>
          <input type="text" value={this.state.tmpUrl} onChange={this.handleChange('tmpUrl')} data-testid="url" />
          <button type="submit">Enter URL</button>
        </form>

        <form onSubmit={this.retrieveVideo} data-testid="retrieve">
          <p>Video Retrieval:</p>
          <label>Start Time</label>
          <input type="text" value={this.state.startTime} onChange={this.handleChange('startTime')} data-testid="" />
          <label>Video Id</label>
          <input type="text" value={this.state.vidId} onChange={this.handleChange('vidId')} data-testid="" />
          <button type="submit">Retrieve Video</button>
        </form>
        <ReactPlayer url={this.state.url} controls={true} />
      </div>
    );
  }
}