import React, { Component } from "react";
import { Container, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";

import ResponsivePlayer from "../ResponsivePlayer/ResponsivePlayer";

interface Props {}
interface State {
  tmpUrl: string;
  url: string;
  cameraIds: Array<string>;
  cameraIdsDict: Record<string, Array<string>>;
}

export default class Playback extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tmpUrl: "",
      url: "",
      cameraIds: [],
      cameraIdsDict: {},
    };
  }

  // Map cameraId to streamIds
  componentDidMount() {
    fetch(`/api/getCameraIds`)
      .then((res) => res.json())
      .then((cameraIds) => this.setState({ cameraIds: cameraIds }))
      .then(() =>
        this.state.cameraIds.map((cameraId, index) => {
          fetch(`/api/getStreamIds/${cameraId}`)
            .then((res) => res.json())
            .then((streamIds) =>
              this.setState({
                cameraIdsDict: {
                  ...this.state.cameraIdsDict,
                  [cameraId]: streamIds,
                },
              }),
            );
        }),
      );
  }

  // Render the nested list of cameraIds and streamIds
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

  urlSubmit = (): void => {
    this.setState({ url: this.state.tmpUrl });
    this.setState({ tmpUrl: "" });
  };

  retrieveVideo = (streamId: string): void => {
    fetch(`/api/getVideo/${streamId}`)
      .then((res) => res.blob())
      .then((blob) => {
        const vidUrl = URL.createObjectURL(new Blob([blob]));
        this.setState({ url: vidUrl });
      });
  };

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
