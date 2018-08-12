import React, {Component} from 'react'
import {Button, Dropdown, Icon, Message, Modal} from "semantic-ui-react";
import {FIREBASE_PATH} from "./Constants";
import {firestore} from "./config/fire";
import {connect} from "react-redux";
import {setUpdateLinkedAccounts} from "./redux/actions";

const mapDispatchToProps = dispatch => {
  return {
    setUpdateLinkedAccounts: updateLinkedAccounts => dispatch(setUpdateLinkedAccounts(updateLinkedAccounts))
  };
};

class DeleteLinkedAccountModalRedux extends Component {

  state = {
    modalOpen: false,
    deleteLinkedAccountError: false,
    deleteLinkedAccountErrorMessage: '',
  };

  handleOpen = () => this.setState({modalOpen: true});

  handleClose = () => this.setState({modalOpen: false});

  deleteLinkedAccount = () => {
    let UID = this.props.currentUser.uid;
    let linkedAccountId = this.props.linkedAccount.id;
    firestore.collection(FIREBASE_PATH.LINKED_ACCOUNTS_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_ACCOUNT)
      .doc(linkedAccountId).delete().then(() => {
      this.setState({deleteLinkedAccountError: false, deleteLinkedAccountErrorMessage: ''}, () => {
        this.props.setUpdateLinkedAccounts(true);
        this.handleClose();
        console.log('Successfully Deleted Linked Account ' + linkedAccountId + ' for ' + UID);
      });
    }).catch((error) => {
      this.setState({deleteLinkedAccountError: true, deleteLinkedAccountErrorMessage: error})
      console.log('Error Deleting Linked Project' + linkedAccountId + ' for ' + UID);
    });

  };

  render() {

    let linkedAccount = this.props.linkedAccount;
    let {deleteLinkedAccountError, deleteLinkedAccountErrorMessage} = this.state;

    return (
      <Modal
        trigger={
          <Dropdown.Item onClick={() => this.handleOpen()
          } ><Icon name='trash'/>Delete Linked Account</Dropdown.Item>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}>
        <Modal.Header>Delete Linked Account</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete linked Account <strong>{linkedAccount.googleUserEmail}</strong>? This
            action <i>cannot</i> be undone.</p>
          {deleteLinkedAccountError &&
          <Message negative>
            <Message.Header>There was an error deleting the Linked Account</Message.Header>
            <Message.Content>{deleteLinkedAccountErrorMessage}</Message.Content>
          </Message>
          }
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={this.handleClose}>
            <Icon name='remove'/> Cancel
          </Button>
          <Button color='green' onClick={this.deleteLinkedAccount}>
            <Icon name='checkmark'/> Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

}

const DeleteLinkedAccountModal = connect(null, mapDispatchToProps)(DeleteLinkedAccountModalRedux);

export default DeleteLinkedAccountModal;