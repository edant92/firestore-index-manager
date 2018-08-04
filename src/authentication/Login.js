import React, {Component} from 'react'
import {firebaseAuth, googleProvider} from "../config/fire";
import {Redirect} from "react-router-dom";
import {Button, Grid, Icon, Image, Segment} from "semantic-ui-react";
import logo from '../img/logo-with-text.svg'

class Login extends Component {

  authWithGoogle = () => {
    firebaseAuth.useDeviceLanguage();
    firebaseAuth.signInWithRedirect(googleProvider).catch((error) => {
      console.log(error.message, error.code);
    });
  };

  constructor() {
    super();
    this.state = {
      redirect: false,
      email: '',
      password: '',
      formError: false,
      emailError: false,
      passwordError: false,
      passwordErrorCode: '',
      passwordErrorMessage: ''
    }
  }

  render() {

    const {from} = this.props.location.state || {from: {pathname: '/'}};

    if (this.props.currentUser) {
      return <Redirect to='/'/>
    }

    if (this.state.redirect === true) {
      return <Redirect to={from}/>
    }

    return (
      <Grid padded stackable columns='equal' centered verticalAlign='middle' textAlign='left'>
        <Grid.Column>
        </Grid.Column>
        <Grid.Column width={8}>
          <Segment>
            <Image src={logo} size='small' centered/>
            <Segment basic>
              Create a Firebase Index Manager account
              (this is separate to your Firebase account)
              <Button fluid color='google plus' onClick={() => this.authWithGoogle()}>
                <Icon name='google'/>
                Continue with Google
              </Button>
            </Segment>
          </Segment>
        </Grid.Column>
        <Grid.Column>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login