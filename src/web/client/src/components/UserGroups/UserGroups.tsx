import React, { Component } from "react";
import { Container, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";

import GroupForm from "../GroupForm/GroupForm";

interface Props { }
interface State {
  usernames: Array<string>;
  groups: Array<string>;
  groupsToUsersDict: Record<string, Array<string>>;
}

/**
 * A component for adding users to groups
 * TODO: Write tests for this component
 */
export default class UserGroups extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      usernames: [],
      groups: [],
      groupsToUsersDict: {},
    };
  }

  /**
   * Fetch the usernames and groups
   */
  componentDidMount() {
    fetch(`/auth/getUsernames`)
      .then((res) => res.json())
      .then((usernames) => this.setState({ usernames }))
      .catch((e) => console.error(e));
    fetch(`/api/getGroups`)
      .then((res) => res.json())
      .then((groups) => this.setState({ groups }))
      .then(() => {
        this.state.groups.map((groupId, index) => {
          return fetch(`/api/getGroupUsers/${groupId}`)
            .then((res) => res.json())
            .then((users) => this.setState({ groupsToUsersDict: {...this.state.groupsToUsersDict, [groupId]: users } }))
            .catch((e) => console.error(e))
        })
      })
      .catch((e) => console.error(e))
  }

  /**
   * Renders the list of usernames
   */
  renderUsernames = () => {
    return this.state.usernames.map((username, index) => {
      return ( 
        <ListItem
          key={index}
          button
        >
        {username}
        </ListItem>
      );
    });
  };

  /**
   * Render all groups
   */
  renderGroups = () => {
    return Object.keys(this.state.groupsToUsersDict).map((group, index) => {
      return ( 
        <List
          subheader={
            <ListSubheader color="inherit">
              <Typography variant="inherit">{group}</Typography>
            </ListSubheader>
          }
          key={index}
        >
        {this.renderGroupUsers(this.state.groupsToUsersDict[group])}
        </List>
      );
    });
  };

  /**
   * Render the usernames for the specified group
   * @params group - The specified group to be rendered
   */
  renderGroupUsers = (group: Array<string>) => {
    return group.map((username, index) => {
      return (
        <ListItem
          key={index}
          button
        >
          {username}
        </ListItem>
      );
    });
  }

  /**
   * Renders out the usernames and forms to submit users to groups
   */
  render() {
    return (
      <Container>
         <List
          subheader={
            <ListSubheader color="inherit">
              <Typography variant="inherit">Groups</Typography>
            </ListSubheader>
          }
        >
         {this.renderGroups()}
        </List>
         <List
          subheader={
            <ListSubheader color="inherit">
              <Typography variant="inherit">Usernames</Typography>
            </ListSubheader>
          }
        >
          {this.renderUsernames()}
        </List>
        <GroupForm />
      </Container>
    );
  }
}
