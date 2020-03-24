import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

interface Props { isLoggedIn: boolean }
interface State {}

export default class Navbar extends Component<Props, State> {
	logoutSubmit = (): void => {
    	const requestOptions = {
      		method: "POST",
    	};
    	fetch(`/auth/logout`, requestOptions)
  	}

	render() {
		return (
			this.props.isLoggedIn ?
				<AppBar position="static">
					<Toolbar>
						<Typography variant="title">
						Meowl
						</Typography>
						<Grid container alignItems="flex-start" justify="flex-end" direction="row">
							<Link href="/" color="inherit" onClick={this.logoutSubmit}>Logout</Link>
						</Grid>
					</Toolbar>
				</AppBar>
			:
				<AppBar position="static">
					<Toolbar>
						<Typography variant="title">
						Meowl
						</Typography>
						<Grid container alignItems="flex-start" justify="flex-end" direction="row">
							<Link href="/login" color="inherit" style={{ textDecoration: 'none' }}>Login</Link>
						</Grid>
					</Toolbar>
				</AppBar>
		)
	}
}