import {Button, Form, Icon, Modal} from "semantic-ui-react";
import React, {Component} from "react";
import {GoogleLogin} from "react-google-login";
import {AUTHENTICATION, FIREBASE_PATH} from "./Constants";
import {firestore} from './config/fire';

class AddLinkFirestore extends Component {

  state = {modalOpen: false};

  handleOpen = () => this.setState({modalOpen: true});

  handleClose = () => this.setState({modalOpen: false});

  handleChangeInput = (event) => {
    console.log([event.target.id], event.target.value);
    this.setState({[event.target.id]: event.target.value});
  };

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

    let {projectId, accessToken, googleUserName, googleUserEmail, googleUserPhoto} = this.state;

    let firestoreInfo = {
      projectId, accessToken, googleUserName, googleUserEmail, googleUserPhoto
    };

    const UID = this.props.currentUser.uid;

    firestore.collection(FIREBASE_PATH.FIRESTORE_INFO_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_PROJECT).add(
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
          Link New Firestore Database
        </Button>
      }
             open={this.state.modalOpen}
             onClose={this.handleClose}>
        <Modal.Header>Link New Firestore Database</Modal.Header>
        <Modal.Content>
          <Button fluid positive
                  content='Authenticate Firebase Google Account'
                  as={GoogleLogin}
                  discoveryDocs={AUTHENTICATION.DISCOVERY_DOCS}
                  clientId={AUTHENTICATION.CLIENT_ID}
                  scope={AUTHENTICATION.SCOPES.join(' ')}
                  onSuccess={this.responseGoogleSuccess}
                  onFailure={this.responseGoogleFailure}/>
          <Form>
            <Form.Input id='projectId' label='Project ID' type='text' placeholder='e.g. my-firebase-app'
                        onChange={this.handleChangeInput} required fluid/>
          </Form>
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