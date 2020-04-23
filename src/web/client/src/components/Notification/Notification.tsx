import React, { Component } from "react";
import { Container, Typography } from "@material-ui/core";

interface Props {
    date: Date,
    type: String,
    name: String,
    img: Buffer
}
interface State {}

/** 
 * A component for rendering one notification
*/
export default class Notification extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    /**
     * Renders a single notification
     */
    render() {
        const info = this.props;
        return (
            <Container>
                <Typography>Date: {info.date}</Typography>
                <Typography>Type: {info.type}</Typography>
                <Typography>Name: {info.name}</Typography>
                <img src={`data:image/jpeg;base64,${info.img}`} />
            </Container>
        );
    }
}