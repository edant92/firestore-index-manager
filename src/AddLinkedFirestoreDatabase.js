import {Button, Form, Header, Icon, Message, Modal} from "semantic-ui-react";
import React, {Component} from "react";
import {FIREBASE_PATH} from "./Constants";
import {firestore} from './config/fire';
import {setUpdateLinkedDatabases} from "./redux/actions";
import connect from "react-redux/es/connect/connect";

const mapDispatchToProps = dispatch => {
  return {
    setUpdateLinkedDatabases: updateLinkedDatabases => dispatch(setUpdateLinkedDatabases(updateLinkedDatabases))
  };
};

class AddLinkedFirestoreDatabaseRedux extends Component {

  state = {
    modalOpen: false,
    connectionTestLoaderActive: false,
    connectionTestSuccessful: false,
    connectionTestError: false,
    connectionTestErrorMessage: ''

  };

  handleOpen = () => this.setState({
    modalOpen: true,
    connectionTestLoaderActive: false,
    connectionTestSuccessful: false,
    connectionTestError: false,
    connectionTestErrorMessage: ''
  });

  handleClose = () => this.setState({modalOpen: false});

  handleChangeInput = (event) => {
    console.log([event.target.id], event.target.value);
    this.setState({[event.target.id]: event.target.value});
  };


  checkConnection = () => {

    let {projectId} = this.state;

    let accessToken = this.props.linkedAccount.accessToken;

    this.setState({connectionTestLoaderActive: true});
    console.log('Getting test indexes for ' + projectId + ' in ' + accessToken);
    fetch('https://firestore.googleapis.com/v1beta1/projects/' + projectId + '/databases/(default)/indexes', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }).then((response) => {

        if (response.status === 401) {
          throw new Error("Account Unauthorised. Please re-authenticate");
        }
        if (response.status === 403) {
          throw new Error('Unable to find Firestore Database \'' + projectId + '\' for this account.');
        }

        return response.json()
      }
    ).then((data) => {
      this.setState({
        connectionTestLoaderActive: false,
        connectionTestSuccessful: true,
        connectionTestError: false,
        connectionTestErrorMessage: ''
      });
      console.log(data.indexes);
    }).catch((error) => {

      let errorText = `${error}`;
      let connectionTestErrorMessage = errorText.replace('Error: ','');

      this.setState({
        connectionTestLoaderActive: false,
        connectionTestSuccessful: false,
        connectionTestError: true,
        connectionTestErrorMessage
      });
      console.log('error: ', error);
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
      this.props.setUpdateLinkedDatabases(true);
      this.handleClose();
    })
  };

  render() {

    let {connectionTestLoaderActive, connectionTestSuccessful, connectionTestError, connectionTestErrorMessage} = this.state;

    return (
      <Modal trigger={
        <Button floated='right' onClick={this.handleOpen}>
          <Icon name='add'/>
          Link Firestore Database
        </Button>
      }
             open={this.state.modalOpen}
             onClose={this.handleClose}>
        <Modal.Header>
          <Header>
            Link Firestore Database
            <Header.Subheader>Link a Firestore Database associated
              to {this.props.linkedAccount.googleUserName} ({this.props.linkedAccount.googleUserEmail})</Header.Subheader>
          </Header>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input id='projectId' label='Project ID' type='text' placeholder='e.g. my-firebase-app'
                        onChange={this.handleChangeInput} required fluid error={connectionTestError}/>
          </Form>
          {connectionTestError &&
          <Message negative>
            <Message.Header>Error Linking Database</Message.Header>
            <p>{connectionTestErrorMessage}</p>
          </Message>
          }
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={this.handleClose}>
            <Icon name='remove'/> Cancel
          </Button>

          {connectionTestLoaderActive ?
            <Button loading>Test Connection</Button>
            :
            connectionTestSuccessful ?
              <Button color='green' onClick={this.handleLinkCreation}>
                <Icon name='checkmark'/> Link
              </Button>
              :
              <Button color='blue' onClick={this.checkConnection}>
                Test Connection
              </Button>

          }
        </Modal.Actions>
      </Modal>
    )
  }

}

const AddLinkedFirestoreDatabase = connect(null, mapDispatchToProps)(AddLinkedFirestoreDatabaseRedux);

export default AddLinkedFirestoreDatabase;