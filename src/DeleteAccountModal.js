import React, {Component} from 'react'
import {Button, Icon, Modal} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import {FIREBASE_PATH, ROUTER_PATH} from "./Constants";
import {firebaseAuth, firestore, googleProvider} from "./config/fire";

class DeleteAccountModal extends Component {

  state = {
    modalOpen: false
  };

  handleOpen = () => this.setState({
    modalOpen: true,
  });

  handleClose = () => this.setState({modalOpen: false});

  deleteAccount = () => {
    this.deleteLinkedAccounts();
    this.deleteLinkedDatabases();
    this.deleteUserAccount();

  };

  deleteLinkedAccounts = () => {
    const UID = this.props.currentUser.uid;
    let linkedDatabasesRef = firestore.collection(FIREBASE_PATH.LINKED_ACCOUNTS_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_ACCOUNT);

    linkedDatabasesRef.get().then((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        firestore.collection(FIREBASE_PATH.LINKED_ACCOUNTS_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_ACCOUNT)
          .doc(doc.id).delete().then(() => {
          console.log('Successfully Deleted Linked Account' + doc.id + ' for ' + UID);
        }).catch(() => {
          console.log('Error Deleting Linked Account' + doc.id + ' for ' + UID);
        });
      });

    });

  };

  deleteLinkedDatabases = () => {
    const UID = this.props.currentUser.uid;
    let linkedDatabasesRef = firestore.collection(FIREBASE_PATH.LINKED_ACCOUNTS_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_PROJECT);

    linkedDatabasesRef.get().then((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        firestore.collection(FIREBASE_PATH.LINKED_ACCOUNTS_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_PROJECT)
          .doc(doc.id).delete().then(() => {
          console.log('Successfully Deleted Linked Project ' + doc.id + ' for ' + UID);
        }).catch(() => {
          console.log('Error Deleting Linked Project' + doc.id + ' for ' + UID);
        });
      });

    });

  };

  deleteUserAccount = () => {
    firebaseAuth.signInWithPopup(googleProvider)
      .then((result) => {

        let currentUser = firebaseAuth.currentUser;
        let credential = result.credential;

        currentUser.reauthenticateAndRetrieveDataWithCredential(credential).then(() => {
          currentUser.delete().then(() => {
            this.props.history.push(ROUTER_PATH.ACCOUNT_DELETED)
          }).catch((error) => {
            console.log('Error deleting user account', error);
          });
        }).catch((error) => {
          console.log('Error re-authenticating: ', error)
        });

      })
      .catch((error) => {
        console.log(error.message, error.code);
      });
  };


  render() {
    return (
      <Modal
        trigger={
          <Button negative onClick={this.handleOpen}>
            <Icon name='trash'/>
            Delete Account
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}>
        <Modal.Header>Delete Account</Modal.Header>
        <Modal.Content>
          <p><strong>
            Are you sure you want to delete your Firestore Index Manager account? (You will need to re-authenticate your
            account to do this)
          </strong></p>
          <p>
            This will delete your Firestore Index Manager account as well as the information for any associated
            Firestore Databases. This action <i>cannot</i> be undone.
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={this.handleClose}>
            <Icon name='remove'/> Cancel
          </Button>
          <Button color='green' onClick={this.deleteAccount}>
            <Icon name='checkmark'/> Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

}

export default withRouter(DeleteAccountModal)