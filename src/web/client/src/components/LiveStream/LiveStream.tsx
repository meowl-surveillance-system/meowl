import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";

import ResponsivePlayer from "../ResponsivePlayer/ResponsivePlayer";

interface Props {}
interface State {
  liveCameraStreamIds: Record<string, string>;
  ip: string;
  port: string;
  url: string;
}

export default class LiveStream extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      liveCameraStreamIds: {},
      ip: "",
      port: "",
      url: "",
    };
  }

  componentDidMount() {
    fetch(`/api/getLiveCameraStreamIds`)
      .then((res) => res.json())
      .then((collection) => this.setState({ liveCameraStreamIds: collection }));
  }

  // Render a nested list of all live streamIds
  renderList = () => {
    return Object.keys(this.state.liveCameraStreamIds).map(
      (cameraId, index) => {
        const streamId = this.state.liveCameraStreamIds[cameraId];
        return (
          <List
            key={index}
            subheader={
              <ListSubheader color="inherit">
                <Typography variant="inherit">{cameraId}</Typography>
              </ListSubheader>
            }
          >
            <ListItem button key={index} onClick={() => this.getURL(streamId)}>
              {streamId}
            </ListItem>
          </List>
        );
      },
    );
  };

  getURL = (streamId: string) => {
    this.setState({
      url: `http://${this.state.ip}:${this.state.port}/hls/${streamId}.m3u8`,
    });
  };

  render() {
    return (
      <Container>
        <List
          subheader={
            <ListSubheader color="inherit">
              <Typography variant="inherit">Live Streams</Typography>
            </ListSubheader>
          }
        >
          {this.renderList()}
        </List>
        <ResponsivePlayer url={this.state.url} controls={true} />
      </Container>
    );
  }
}
