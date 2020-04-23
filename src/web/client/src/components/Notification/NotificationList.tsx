import React, { Component } from "react";
import { Container, Typography } from "@material-ui/core";
import  Notification from './Notification';

interface Props {}
interface State {
    list: Array<Object>
}

interface Notif {
    date: Date,
    type: String,
    name: String,
    img: Buffer
}

export default class NotificationList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            list : []
        };
    }

    componentDidMount() {
        fetch(`/notif/retrieveNotifications`)
            .then((res) => res.json())
            .then((result) => {
                result.array.forEach((element: Notif) => {
                    this.state.list.push(element)
                });
            })
    }

    render() {
        return (
            <Container>
                {this.state.list.map((notif: any) => 
                    <Notification 
                        date={notif.date} 
                        type={notif.type}
                        name={notif.name}
                        img={notif.img}
                    />
                )}
            </Container>
        );
    }
}