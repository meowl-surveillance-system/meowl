import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";

import ResponsivePlayer from "../ResponsivePlayer/ResponsivePlayer";
import { NGINX_HLS_SERVER_IP, NGINX_HLS_SERVER_PORT } from "../../settings";

interface Props {}
interface State {
  liveCameraStreamIds: Record<string, string>;
  ip: string;
  port: string;
  url: string;
}

/**
 * The LiveStream component displays all live streams
 */
export default class LiveStream extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      liveCameraStreamIds: {},
      ip: NGINX_HLS_SERVER_IP,
      port: NGINX_HLS_SERVER_PORT,
      url: "",
    };
  }

  /**
   * Fetch all cameras that are currently recording
   */
  async componentDidMount() {
    try {
      const res = await fetch(`/api/getLiveCameraStreamIds`);
      const collection = await res.json();
      this.setState({ liveCameraStreamIds: collection });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Render a nested list of cameraIds to streamIds
   */
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

  /**
   * Set the appropraite streaming URL
   * @params streamId - The ID of a particular stream
   */
  getURL = (streamId: string) => {
    this.setState({
      url: `http://${this.state.ip}:${this.state.port}/hls/${streamId}.m3u8`,
    });
  };

  /**
   * Renders the nested list and React player of a particular stream
   */
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
