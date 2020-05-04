import React, { Component } from "react";
import { Container, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";

interface Props { }
interface State {
  usernames: Array<string>;
}

/**
 * A component for adding users to groups
 */
export default class UserGroups extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      usernames: [],
    };
  }

  /**
   * Fetch the usernames
   */
  componentDidMount() {
    fetch(`/auth/getUsernames`)
      .then((res) => res.json())
      .then((usernames) => this.setState({ usernames: usernames }))
      .catch((e) => console.error(e));
  }

  /**
   * Renders the list of usernames
   */
  renderList = () => {
    return this.state.usernames.map((username, index) => {
      return (
        <ListItem
          key={index}
        >
        {username}
        </ListItem>
      );
    });
  };

  /**
   * Renders out the usernames and forms to submit users to groups
   */
  render() {
    return (
      <Container>
        <List
          subheader={
            <ListSubheader color="inherit">
              <Typography variant="inherit">Usernames</Typography>
            </ListSubheader>
          }
        >
          {this.renderList()}
        </List>
      </Container>
    );
  }
}
