import React, { ComponentState, Component, ChangeEvent } from 'react';
import ReactPlayer from 'react-player';
import { Container, FormControl, TextField, Button, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
interface Props { }

interface State {
  tmpUrl: string;
  url: string;
  vidId: string;
  cameraId: string;
  streamIds: Array<string>;
}

export default class Playback extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      tmpUrl: "",
      url: "",
      vidId: "",
      cameraId: "",
      streamIds: []
    };
  }

  componentDidMount() {
    fetch(`/api/getStreamIds/1`)
      .then(res => res.json())
        .then(streamIds => this.setState( { streamIds: streamIds }));
  }

  renderStreamIds = () => {
    return this.state.streamIds.map((streamId, index) => {
      return (
        <ListItem button onClick={() => this.retrieveVideo(streamId)} key={index}>{streamId}</ListItem>
      );
    })
  }

  urlSubmit = (): void => {   
    this.setState({ url: this.state.tmpUrl });
    this.setState({ tmpUrl: "" });
  }

  retrieveVideo = (streamId: string): void => {
    fetch(`/api/getVideo/${streamId}`)
      .then(res => res.blob())
      .then(blob => {
        const vidUrl = URL.createObjectURL(new Blob([blob]));
        this.setState({ url: vidUrl });
      })

  }

  render() {
    return (
      <Container>
        <List 
          subheader={
            <ListSubheader color="inherit">
              <Typography variant="title">My Streams</Typography>
            </ListSubheader>
          }
        >
          {this.renderStreamIds()}
        </List>
       
        <ReactPlayer url={this.state.url} controls={true} />
      </Container >
    );
  }
}