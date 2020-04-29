import React, { Component } from "react";
import { Container, TextField, Button } from "@material-ui/core";

interface Props {
    name: String,
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
                <form>
                    <TextField label="name"/>
                    <Button> Submit </Button>
                </form>
            </Container>
        );
    }
}
