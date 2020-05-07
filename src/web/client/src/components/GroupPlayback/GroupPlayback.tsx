import React, { Component } from "react";
import { Container, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";

import ResponsivePlayer from "../ResponsivePlayer/ResponsivePlayer";

interface Props { }
interface State {
  url: string;
  cameraIdsDict: Record<string, Array<string>>;
  groupIdsToCameraIdsDict: Record<string, Array<string>>;
}

/**
 * A component for playing back streams that have previously been recorded
 * TODO: Write tests for this
 */
export default class GroupPlayback extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      url: "",
      cameraIdsDict: {},
      groupIdsToCameraIdsDict: {}
    };
  }

  /**
   * Fetch the cameraIds from the backend server and set the cameraId to streamIds dictionary
   */
  async componentDidMount() {
    try {
      const res: Response = await fetch(`/api/getUserGroupCamerasDict`);
      const groupIdsToCameraIdsDict: Record<string, Array<string>> = await res.json();
      const cameraIdsDict: Record<string, Array<string>> = {};
      await Promise.all(Object.keys(groupIdsToCameraIdsDict).map((groupId: string) => {
        return Promise.all(groupIdsToCameraIdsDict[groupId].map(async (cameraId: string) => {
          const res: Response = await fetch(`/api/getStreamIdsGroups/${cameraId}`);
          const streamIds: string[] = await res.json();
          cameraIdsDict[cameraId] = streamIds;
        }));
      }));
      this.setState({ groupIdsToCameraIdsDict, cameraIdsDict });
    }
    catch (e) {
      console.error(e);
    }
  }

  /**
   * Renders the nested list of groupIds to cameraIds to streamIds
   */
  renderList = () => {
    return Object.keys(this.state.groupIdsToCameraIdsDict).map((groupId, index) => {
      return (
        <List
          key={index}
          subheader={
            <ListSubheader color="inherit">
              <Typography variant="inherit">{groupId}</Typography>
            </ListSubheader>
          }
        >
          {this.renderCameraIds(this.state.groupIdsToCameraIdsDict[groupId])}
        </List>
      );
    });
  };

  /**
   * Renders a list of cameraIds to streamIds
   * @params cameraIds - A list of camera IDs
   */
  renderCameraIds = (cameraIds: Array<string>) => {
    return cameraIds.map((cameraId, index) => {
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
      )
    })
  }

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
              <Typography variant="inherit">Group Streams</Typography>
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
