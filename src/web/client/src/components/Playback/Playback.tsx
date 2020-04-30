import React, { Component } from "react";
import { Container, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";

import ResponsivePlayer from "../ResponsivePlayer/ResponsivePlayer";

interface Props { }
interface State {
  url: string;
  cameraIds: Array<string>;
  cameraIdsDict: Record<string, Array<string>>;
}

/**
 * A component for playing back streams that have previously been recorded
 */
export default class Playback extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      url: "",
      cameraIds: [],
      cameraIdsDict: {},
    };
  }

  /**
   * Fetch the cameraIds from the backend server and set the cameraId to streamIds dictionary
   */
  componentDidMount() {
    fetch(`/api/getCameraIds`)
      .then((res) => res.json())
      .then((cameraIds) => this.setState({ cameraIds: cameraIds }))
      .then(() =>
        this.state.cameraIds.map((cameraId, index) => {
          return fetch(`/api/getStreamIds/${cameraId}`)
            .then((res) => res.json())
            .then((streamIds) =>
              this.setState({
                cameraIdsDict: {
                  ...this.state.cameraIdsDict,
                  [cameraId]: streamIds,
                },
              }),
            )
            .catch((e) => console.error(e));
        }),
      )
      .catch((e) => console.error(e));
  }

  /**
   * Renders the nested list of cameraIds and streamIds
   */
  renderList = () => {
    return Object.keys(this.state.cameraIdsDict).map((cameraId, index) => {
      return (
        <List
          key={index}
          subheader={
            <ListSubheader color="inherit">
              <Typography variant="inherit">{cameraId}</Typography>
            </ListSubheader>
          }
        >
          {this.renderStreamIds(this.state.cameraIdsDict[cameraId])}
        </List>
      );
    });
  };

  /**
   * Renders a list of stream IDs which is a sublist of the nested list
   * @params streamIds - A list of stream IDs
   */
  renderStreamIds = (streamIds: Array<string>) => {
    return streamIds.map((streamId, index) => {
      return (
        <ListItem
          button
          key={index}
          onClick={() => this.retrieveVideo(streamId)}
        >
          {streamId}
        </ListItem>
      );
    });
  };

  /**
   * Retrieves the stream from the API server, creates a URL from the bytes retrieved, and sets the url state
   * @params streamId - the ID of the stream that is retrieved
   */
  retrieveVideo = (streamId: string): void => {
    fetch(`/api/getVideo/${streamId}`)
      .then((res) => res.blob())
      .then((blob) => {
        const vidUrl = URL.createObjectURL(new Blob([blob]));
        this.setState({ url: vidUrl });
      })
      .catch((e) => console.log(e));
  };

  /**
   * Renders out the nested list of cameraIds to streamIds and the appropriate React player based on the url state
   */
  render() {
    return (
      <Container>
        <List
          subheader={
            <ListSubheader color="inherit">
              <Typography variant="inherit">My Streams</Typography>
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
