import React, { Component } from "react";
import { Container, Typography } from "@material-ui/core";
import Notification from "./Notification";

interface Props {}
interface State {
  list: Array<Record<string, any>>;
}

interface Notif {
  date: Date;
  type: string;
  name: string;
  frame_id: string;
  stream_id: string;
}

/* 
 * A component for rendering multiple notifications. Each individual notification is rendered
 * using the Notification component
 */
export default class NotificationList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    fetch(`/notif/retrieveNotifications`)
      .then((res) => res.json())
      .then((result) => {
        result.map((element: Notif) => {
          const tmp = {
            date: new Date(),
            type: "",
            name: "",
            img: "",
          };
          fetch(`/notif/retrieveFrame/${element.frame_id}/${element.stream_id}`)
            .then((res) => res.json())
            .then((result) => {
              tmp.date = element.date;
              tmp.type = element.type;
              tmp.name = element.name;
              tmp.img = result.frame.data;
              this.setState({ list: [...this.state.list, tmp] });
            })
            .catch((e) => console.error(e));
        });
      })
      .catch((e) => console.error(e));
  }

  /*
   * Maps each element in list state to a Notification component based on that element's
   * date, type, name, and frame buffer
   */
  render() {
    return (
      <Container>
        <Typography>Notifications</Typography>
        {this.state.list.map((notif: any, index: number) => (
          <Notification
            key={index}
            date={notif.date}
            type={notif.type}
            name={notif.name}
            img={notif.img}
          />
        ))}
      </Container>
    );
  }
}
