import React, { ChangeEvent, Component, ComponentState, FormEvent } from "react";
import { Container, TextField, Typography, Button } from "@material-ui/core";

interface Props {
    isLoggedIn: boolean
}
interface State {
    name: string
}

/** 
 * A component for rendering one notification
*/
export default class BlackList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            name: ''
        }
    }

    /**
     * Sets the appropriate state when a keyboard event is triggered
     * @params event - An event that records changes happening to an input field
     */
    onChange = (event: ChangeEvent<HTMLInputElement>): void => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        } as ComponentState);
    };

    /**
     * Submits the name to be added to blacklist table in DB
     * @params event - An event that records submission of a form element
     */
    onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            const res = await fetch("/blacklist/insertBlacklist", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: this.state.name,
                }),
            });
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Render submit form for inserting to blacklist
     */
    render() {
        const info = this.props;
        return (
            <Container>
                <form noValidate onSubmit = {this.onSubmit}>
                    <Typography>Insert the name of the individual you would like to blacklist (all lowercase)</Typography>
                    <TextField label="name" name="name" onChange = {this.onChange} />
                    <Button type="submit"> Submit </Button>
                </form>
            </Container>
        );
    }
}
