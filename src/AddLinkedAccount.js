import {Button, Icon, Modal} from "semantic-ui-react";
import React, {Component} from "react";
import {GoogleLogin} from "react-google-login";
import {AUTHENTICATION, FIREBASE_PATH} from "./Constants";
import {firestore} from './config/fire';

class AddLinkFirestore extends Component {

  state = {modalOpen: false};

  handleOpen = () => this.setState({modalOpen: true});

  handleClose = () => this.setState({modalOpen: false});

  responseGoogleSuccess = (response) => {
    let accessToken = response.accessToken;
    //this.props.setAccessToken(accessToken);
    let googleUserName = response.w3.ig;
    let googleUserEmail = response.w3.U3;
    let googleUserPhoto = response.w3.Paa;
    this.setState({accessToken, googleUserName, googleUserEmail, googleUserPhoto});
    console.log(accessToken, googleUserName, googleUserEmail, googleUserPhoto);
  };

  responseGoogleFailure = (response) => {
    console.log(response);
    //TODO: Update UI if unsuccessful (use Error Message and get Error?)
    //this.props.setAccessToken('');
  };

  handleLinkCreation = () => {

    this.saveToFirebase();

  };

  saveToFirebase = () => {

    let {accessToken, googleUserName, googleUserEmail, googleUserPhoto} = this.state;

    let firestoreInfo = {
      accessToken, googleUserName, googleUserEmail, googleUserPhoto
    };

    const UID = this.props.currentUser.uid;

    firestore.collection(FIREBASE_PATH.LINKED_ACCOUNTS_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_ACCOUNT).add(
      firestoreInfo
    ).then(() => {
      this.handleClose();
    })
  };

  render() {
    return (
      <Modal trigger={
        <Button onClick={this.handleOpen}>
          <Icon name='linkify'/>
          Link New Firestore Account
        </Button>
      }
             open={this.state.modalOpen}
             onClose={this.handleClose}>
        <Modal.Header>Link New Firestore Account</Modal.Header>
        <Modal.Content>
          <Button fluid positive
                  content='Authenticate Firebase Google Account'
                  as={GoogleLogin}
                  discoveryDocs={AUTHENTICATION.DISCOVERY_DOCS}
                  clientId={AUTHENTICATION.CLIENT_ID}
                  scope={AUTHENTICATION.SCOPES.join(' ')}
                  onSuccess={this.responseGoogleSuccess}
                  onFailure={this.responseGoogleFailure}/>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={this.handleClose}>
            <Icon name='remove'/> Cancel
          </Button>
          <Button color='green' onClick={this.handleLinkCreation}>
            <Icon name='checkmark'/> Link
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

}

export default AddLinkFirestore