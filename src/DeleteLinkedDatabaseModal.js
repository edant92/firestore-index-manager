import React, {Component} from 'react'
import {Button, Icon, Message, Modal} from "semantic-ui-react";
import {FIREBASE_PATH} from "./Constants";
import {firestore} from "./config/fire";
import {connect} from "react-redux";
import {setUpdateLinkedDatabases} from "./redux/actions";

const mapDispatchToProps = dispatch => {
  return {
    setUpdateLinkedDatabases: updateLinkedDatabases => dispatch(setUpdateLinkedDatabases(updateLinkedDatabases))
  };
};

class DeleteAccountModalRedux extends Component {

  state = {
    modalOpen: false,
    deleteLinkedDatabaseError: false,
    deleteLinkedDatabaseErrorMessage: '',
  };

  handleOpen = () => this.setState({modalOpen: true});

  handleClose = () => this.setState({modalOpen: false});

  deleteLinkedDatabase = () => {
    let UID = this.props.currentUser.uid;
    let linkedDatabaseId = this.props.linkedDatabase.id;
    firestore.collection(FIREBASE_PATH.LINKED_ACCOUNTS_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_PROJECT)
      .doc(linkedDatabaseId).delete().then(() => {
      this.setState({deleteLinkedDatabaseError: false, deleteLinkedDatabaseErrorMessage: ''}, () => {
        this.props.setUpdateLinkedDatabases(true);
        this.handleClose();
        console.log('Successfully Deleted Linked Project ' + linkedDatabaseId + ' for ' + UID);
      });
    }).catch((error) => {
      this.setState({deleteLinkedDatabaseError: true, deleteLinkedDatabaseErrorMessage: error})
      console.log('Error Deleting Linked Project' + linkedDatabaseId + ' for ' + UID);
    });

  };

  render() {

    let linkedDatabase = this.props.linkedDatabase;
    let {deleteLinkedDatabaseError, deleteLinkedDatabaseErrorMessage} = this.state;

    return (
      <Modal
        trigger={
          <Icon name='delete' link onClick={() => this.handleOpen()
          }/>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}>
        <Modal.Header>Delete Linked Database</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete linked Database <strong>{linkedDatabase.projectId}</strong>? This
            action <i>cannot</i> be undone.</p>
          {deleteLinkedDatabaseError &&
          <Message negative>
            <Message.Header>There was an error deleting the Linked Database</Message.Header>
            <Message.Content>{deleteLinkedDatabaseErrorMessage}</Message.Content>
          </Message>
          }
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={this.handleClose}>
            <Icon name='remove'/> Cancel
          </Button>
          <Button color='green' onClick={this.deleteLinkedDatabase}>
            <Icon name='checkmark'/> Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

}

const DeleteAccountModal = connect(null, mapDispatchToProps)(DeleteAccountModalRedux);

export default DeleteAccountModal;