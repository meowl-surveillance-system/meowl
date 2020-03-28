import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

interface Props { 
	isLoggedIn: boolean;
	onAuthChange: (authState: boolean) => void;
}
interface State {}

export default class Navbar extends Component<Props, State> {
	logoutSubmit = (): void => {
    	const requestOptions = {
      		method: "POST",
    	};
    	fetch(`/auth/logout`, requestOptions)
    	this.props.onAuthChange(false)
  	}

  	// Render the buttons on the navbar when the user is authenticated
  	renderIsLoggedIn = () => {
  		return (
  			<div>
  				<RouterLink to="/" style={{color:"inherit", textDecoration:"none"}} onClick={this.logoutSubmit}>Logout</RouterLink>
  				<RouterLink to="/streams" style={{paddingLeft: '10px', color:"inherit", textDecoration:"none"}}>streams</RouterLink>
  			</div>
  		)
  	}

  	// Render the buttons on the navbar when the user is not authenticated
  	renderIsNotLoggedIn = () => {
  		return (
  			<div>
  				<RouterLink to="/login" style={{ color: "inherit", textDecoration: 'none' }}>Login</RouterLink>
  				<RouterLink to="/register" style={{ paddingLeft: '10px', color: "inherit", textDecoration: 'none' }}>Register</RouterLink>
  			</div>
  		)
  	}

	render() {
		return (
			<AppBar position="static">
				<Toolbar>
					<RouterLink to='/' style={{color:"inherit", textDecoration:"none"}}>
						<Typography variant="title">
							Meowl
						</Typography>
					</RouterLink>
					<Grid container alignItems="flex-start" justify="flex-end" direction="row">
						{this.props.isLoggedIn ? this.renderIsLoggedIn() : this.renderIsNotLoggedIn()}
					</Grid>
				</Toolbar>
			</AppBar>
		)
	}
}