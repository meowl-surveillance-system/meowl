import React, { ComponentState, Component, ChangeEvent } from 'react';
import ReactPlayer from 'react-player';
import { Container, FormControl, TextField, Button, Typography } from '@material-ui/core';

interface Props { }

interface State {
  tmpUrl: string;
  url: string;
  vidId: string;
}

export default class Playback extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      tmpUrl: "",
      url: "",
      vidId: ""
    };
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let target: HTMLInputElement = (event.target as HTMLInputElement);
    let label: string = target.name;
    let value: string = target.value;
    this.setState({ [label]: value } as ComponentState);
  };

  urlSubmit = (): void => {   
    this.setState({ url: this.state.tmpUrl });
    this.setState({ tmpUrl: "" });
  }

  retrieveVideo = (): void => {
    fetch(`http://localhost:8081/api/getVideo/${this.state.vidId}`)
      .then(res => res.blob())
      .then(blob => {
        const vidUrl = URL.createObjectURL(new Blob([blob]));
        this.setState({ url: vidUrl });
      })

  }

  render() {
    return (
      <Container>
        <Typography variant="h5" component="h6">Video Retrieval Tool</Typography>
        <FormControl data-testid="form">
          <TextField
            id="tmpUrl-input"
            name="tmpUrl"
            value={this.state.tmpUrl}
            onChange={this.handleChange}
            placeholder="Temporary URL"
            inputProps={{ "data-testid": "tmpUrl-test" }}
          />
          <Button onClick={() => this.urlSubmit()}>Submit URL</Button>
        </FormControl>
        <FormControl data-testid="retrieve">
          <TextField
            id="vidId-input"
            name="vidId"
            value={this.state.vidId}
            onChange={this.handleChange}
            placeholder="Video ID"
            inputProps={{ "data-testid": "vid-db-test" }}
          />
          <Button
            onClick={() => this.retrieveVideo()}
          >
            Retrieve Video
          </Button>
        </FormControl>
        <ReactPlayer url={this.state.url} controls={true} />
      </Container >
    );
  }
}