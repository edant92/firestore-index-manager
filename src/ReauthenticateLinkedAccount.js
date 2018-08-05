import {Button, Icon} from "semantic-ui-react";
import React, {Component} from "react";
import {GoogleLogin} from "react-google-login";
import {AUTHENTICATION, FIREBASE_PATH} from "./Constants";
import {firestore} from './config/fire';

class ReauthenticateLinkedAccount extends Component {

  responseGoogleSuccess = (response) => {
    let accessToken = response.accessToken;
    let googleUserName = response.w3.ig;
    let googleUserEmail = response.w3.U3;
    let googleUserPhoto = response.w3.Paa;
    this.setState({accessToken, googleUserName, googleUserEmail, googleUserPhoto},
      () => {
        this.saveToFirebase()
      }
    );
  };

  responseGoogleFailure = (response) => {
    console.log(response);
    //TODO: Update UI if unsuccessful (use Error Message and get Error?)
    //this.props.setAccessToken('');
  };

  saveToFirebase = () => {

    let {accessToken, googleUserName, googleUserEmail, googleUserPhoto} = this.state;

    let firestoreInfo = {
      accessToken, googleUserName, googleUserEmail, googleUserPhoto
    };

    const UID = this.props.currentUser.uid;
    const linkedAccountId = this.props.linkedAccountId;

    firestore.collection(FIREBASE_PATH.LINKED_ACCOUNTS_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_ACCOUNT)
      .doc(linkedAccountId).update(
      firestoreInfo
    ).then(() => {
      //TODO: Update Reauth button to be disabled/not needed
    })
  };

  render() {
    return (
      <Button fluid positive
              as={GoogleLogin}
              discoveryDocs={AUTHENTICATION.DISCOVERY_DOCS}
              clientId={AUTHENTICATION.CLIENT_ID}
              scope={AUTHENTICATION.SCOPES.join(' ')}
              onSuccess={this.responseGoogleSuccess}
              onFailure={this.responseGoogleFailure}>
        <Icon name='refresh'/>
        Reauthenticate
      </Button>
    )
  }

}

export default ReauthenticateLinkedAccount