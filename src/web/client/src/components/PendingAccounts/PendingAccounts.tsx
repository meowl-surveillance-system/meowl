import React, { Component } from "react";
import { Container, Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import Button from "@material-ui/core/Button";

interface Props {}
interface State {
  selectedAccount: string;
  accountList: Array<string>;
}

/**
 * A component for viewing and approving pending accounts
 */
export default class PendingAccounts extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedAccount: "",
      accountList: [],
    };
  }

  /**
   * Fetch the pendingAccounts from backend
   */
  componentDidMount() {
    fetch(`/auth/getPendingAccounts`)
      .then((res) => res.json())
      .then((usernames) => this.setState({ accountList: usernames }))
      .catch((e) => console.error(e));
  }

  /**
   * Renders the list of pending accounts
   */
  renderList = () => {
    return this.state.accountList.map((username, index) => {
      return (
        <ListItem
          button
          key={index}
          onClick={() => this.setState({ selectedAccount: username })}
        >
          {username}
        </ListItem>
      );
    });
  };

  /**
   * Rejects the selectedAccount
   */
  rejectAccount = (): void => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.state.selectedAccount,
      }),
    };
    fetch(`/auth/rejectRegistration`, requestOptions)
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
      })
      .catch((e) => console.log(e));
  };

  /**
   * Approves the selectedAccount
   */
  approveAccount = (): void => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.state.selectedAccount,
      }),
    };
    fetch(`/auth/approveRegistration`, requestOptions)
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
      })
      .catch((e) => console.error(e));
  };

  /**
   * Renders out the approve and reject buttons and a list of accounts
   */
  render() {
    return (
      <Container>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.rejectAccount()}
        >
          Reject
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.approveAccount()}
        >
          Approve
        </Button>
        <List
          subheader={
            <ListSubheader color="inherit">
              <Typography variant="inherit">Pending Accounts</Typography>
            </ListSubheader>
          }
        >
          {this.renderList()}
        </List>
      </Container>
    );
  }
}
