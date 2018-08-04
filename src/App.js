import React, { Component } from 'react';
import './App.css';
import {Segment} from "semantic-ui-react";
import SidebarMenu from "./SidebarMenu";
import Main from "./Main";
import {firebaseAuth} from "./config/fire";

class App extends Component {

  setCurrentUser = (user) => {
    if (user) {
      this.setState({
        currentUser: user,
        authenticated: true
      })
    } else {
      this.setState({
        currentUser: null,
        authenticated: false
      })
    }
  };

  constructor(props) {
    // noinspection JSCheckFunctionSignatures
    super(props);
    this.state = {
      authenticated: false,
      currentUser: null,
      loading: true
    };
  }

  componentWillMount() {
    this.removeAuthListener = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false
        })
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false
        })
      }
    });

    firebaseAuth.getRedirectResult().then((result) => {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential.accessToken;
        console.log(token)
        // ...
      }
      // The signed-in user info.
      let user = result.user;
      console.log(user)
    }).catch((error) => {
      // Handle Errors here.
      let errorCode = error.code;
      console.log(errorCode);
      let errorMessage = error.message;
      console.log(errorMessage);
      // The email of the user's account used.
      let email = error.email;
      console.log(email);
      // The firebase.auth.AuthCredential type that was used.
      let credential = error.credential;
      console.log(credential)
      // ...
    });

  }

  componentWillUnmount() {
    this.removeAuthListener();
  }

  render() {
    return (
      <div>
        <SidebarMenu authenticated={this.state.authenticated}/>
        <Segment id='content-main' basic>
          <Main setCurrentUser={this.setCurrentUser} authenticated={this.state.authenticated}
                currentUser={this.state.currentUser}/>
        </Segment>
      </div>
    );
  }
}

export default App;
