import React, { Component } from "react";
import { Container, Typography } from "@material-ui/core";
import  Notification from './Notification';

interface Props {}
interface State {
    list: Array<Object>
}

interface Notif {
    date: Date,
    type: string,
    name: string,
    frame_id: String
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
                    let tmp = {
                        date: new Date,
                        type: '',
                        name: '',
                        img: ''
                    }
                    fetch(`/notif/retrieveFrame/${element.frame_id}`)
                        .then((res) => res.json())
                        .then((result) => {
                            tmp.date = element.date;
                            tmp.type = element.type;
                            tmp.name = element.name;
                            tmp.img = result;
                            this.state.list.push(tmp)
                        })
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