import React, {Component} from 'react'
import {firebaseAuth, googleProvider} from "../config/fire";
import {Redirect} from "react-router-dom";
import {Button, Divider, Grid, Icon, Image, List, Segment} from "semantic-ui-react";
import logo from '../img/logo-with-text.svg'

class Login extends Component {

  authWithGoogle = () => {
    firebaseAuth.useDeviceLanguage();
    firebaseAuth.signInWithPopup(googleProvider).catch((error) => {
      console.log(error.message, error.code);
    });
  };

  constructor() {
    super();
    this.state = {
      redirect: false
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
      <Grid padded stackable columns={3} centered verticalAlign='middle' textAlign='left'
            id='content-main-opposite'>
        <Grid.Column> </Grid.Column>
        <Grid.Column>
          <Segment basic>
            <Image src={logo} centered/>
            <List>
              <List.Item>
                <List.Header>Sign in using any Google account</List.Header>
                <List.Description>
                  This does <strong>not</strong> need to be associated to your Firebase/Firestore account.
                </List.Description>
              </List.Item>
            </List>
            <Divider hidden/>
            <Button fluid color='google plus' onClick={() => this.authWithGoogle()}>
              <Icon name='google'/>
              Sign in with Google
            </Button>
            <Divider section/>
          </Segment>
        </Grid.Column>
        <Grid.Column> </Grid.Column>
      </Grid>
    )
  }
}

export default Login