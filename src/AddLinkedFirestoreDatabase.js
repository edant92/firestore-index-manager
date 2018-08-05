import {Button, Form, Icon, Modal} from "semantic-ui-react";
import React, {Component} from "react";
import {FIREBASE_PATH} from "./Constants";
import {firestore} from './config/fire';

class AddLinkedFirestoreDatabase extends Component {

  state = {modalOpen: false};

  handleOpen = () => this.setState({modalOpen: true});

  handleClose = () => this.setState({modalOpen: false});

  handleChangeInput = (event) => {
    console.log([event.target.id], event.target.value);
    this.setState({[event.target.id]: event.target.value});
  };


  checkConnection = () => {

    let {projectId} = this.state;

    let accessToken = this.props.linkedAccount.accessToken;

    this.setState({indexesLoading: true});
    console.log('Getting test indexes for ' + projectId + ' in ' + accessToken);
    fetch('https://firestore.googleapis.com/v1beta1/projects/' + projectId + '/databases/(default)/indexes', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }).then((response) => response.json()
    ).then((data) => {
      console.log(data.indexes);
    }).catch((error) => {
      console.log(error);
    });
  };

  handleLinkCreation = () => {
    this.saveToFirebase();
  };

  saveToFirebase = () => {

    let {projectId} = this.state;

    let linkedAccountId = this.props.linkedAccount.id;

    let firestoreInfo = {
      projectId, linkedAccountId
    };

    const UID = this.props.currentUser.uid;

    firestore.collection(FIREBASE_PATH.LINKED_ACCOUNTS_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_PROJECT).add(
      firestoreInfo
    ).then(() => {
      this.handleClose();
    })
  };

  render() {
    return (
      <Modal trigger={
        <Button floated='right' onClick={this.handleOpen}>
          <Icon name='add'/>
          Add New Firestore Database
        </Button>
      }
             open={this.state.modalOpen}
             onClose={this.handleClose}>
        <Modal.Header>Link New Firestore Database</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input id='projectId' label='Project ID' type='text' placeholder='e.g. my-firebase-app'
                        onChange={this.handleChangeInput} required fluid/>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={this.handleClose}>
            <Icon name='remove'/> Cancel
          </Button>
          <Button color='blue' onClick={this.checkConnection}>
            Check Connection
          </Button>
          <Button color='green' onClick={this.handleLinkCreation}>
            <Icon name='checkmark'/> Link
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

}

export default AddLinkedFirestoreDatabase