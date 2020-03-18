import React, { ChangeEvent, Component, ComponentState, FormEvent } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

interface Props {}
interface State {
	username: string,
	password: string
}

export default class Register extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			username: "",
			password: ""
		}
	}

	componentDidMount() {
		// If user is logged in redirect back to homepage
	}

	onChange = (event: ChangeEvent<HTMLInputElement>): void => {
		event.preventDefault();
		this.setState({ [event.target.name]: event.target.value } as ComponentState);
	}

	onSubmit = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		fetch('http://localhost:8081/auth/register', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password,
			})
		}).then(res => console.log(res));
	}

	render() {
		return (
			<Container component="main" maxWidth="xs">
      			<Grid
				  container
				  spacing={2}
				  direction="column"
				  alignItems="center"
				  justify="center"
				  style={{ minHeight: '100vh' }}
				>
			        <Typography component="h1" variant="h5">
			    	  Register
			        </Typography>
			        <form noValidate onSubmit={this.onSubmit}>
			          <TextField
			            variant="outlined"
			            margin="normal"
			            required
			            fullWidth
			            label="Username"
			            name="username"
			            onChange={this.onChange}
			          />
			          <TextField
			            variant="outlined"
			            margin="normal"
			            required
			            fullWidth
			            name="password"
			            label="Password"
			            type="password"
			            onChange={this.onChange}
			          />
			          <Button
			            type="submit"
			            fullWidth
			            variant="contained"
			            color="primary"
			          >
			            Submit
			          </Button>
			          <Grid container>
			            <Grid item>
			              <Link href="#" variant="body1">
			                {"Already have an account? Sign In"}
			              </Link>
			            </Grid>
			          </Grid>
			        </form>
			    </Grid>
	    	</Container>
		)
	}
}