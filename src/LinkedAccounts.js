import React, {Component, Fragment} from 'react';
import {Image, List, Loader, Segment} from "semantic-ui-react";
import {firestore} from "./config/fire";
import {FIREBASE_PATH} from "./Constants";
import {connect} from "react-redux";
import {setActiveFirestoreDetails} from "./redux/actions";
import LinkedDatabases from "./LinkedDatabases";
import AddLinkedFirestoreDatabase from "./AddLinkedFirestoreDatabase";

const mapStateToProps = state => {
  return {
    activeFirestoreDetails: state.activeFirestoreDetails,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveFirestoreDetails: activeFirestoreDetails => dispatch(setActiveFirestoreDetails(activeFirestoreDetails))
  };
};

class LinkedAccountsRedux extends Component {

  getLinkedAccounts = () => {
    const UID = this.props.currentUser.uid;
    let linkedDatabasesRef = firestore.collection(FIREBASE_PATH.LINKED_ACCOUNTS_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_ACCOUNT);

    console.log('Getting linked databases from', linkedDatabasesRef.path);

    linkedDatabasesRef.get().then((querySnapshot) => {

      let linkedAccounts = [];

      querySnapshot.forEach((doc) => {

        let docData = doc.data();

        let linkedAccount = {
          id: doc.id,
          accessToken: docData.accessToken,
          googleUserEmail: docData.googleUserEmail,
          googleUserName: docData.googleUserName,
          googleUserPhoto: docData.googleUserPhoto
        };

        console.log('linkedAccount', linkedAccount);

        linkedAccounts = [linkedAccount].concat(linkedAccounts);
      });

      this.setState({
        linkedAccounts, showLoader: false
      });

    });

  };

  constructor() {
    super();
    this.state = {
      linkedAccounts: [],
      showLoader: true
    };
  };

  componentDidMount() {
    this.getLinkedAccounts();
  }

  render() {

    let {linkedAccounts, showLoader} = this.state;

    console.log('linkedAccounts', linkedAccounts);

    if (showLoader) {
      return (
        <Loader active/>
      )
    } else {
      return (
        <Fragment>
          {linkedAccounts.map(linkedAccount =>
            <Segment key={linkedAccount.id}>

              <List divided verticalAlign='middle'>
                <List.Item>
                  <List.Content floated='right'>
                    <AddLinkedFirestoreDatabase currentUser={this.props.currentUser} linkedAccount={linkedAccount}/>
                  </List.Content>
                  <Image avatar src={linkedAccount.googleUserPhoto}/>
                  <List.Content>
                    <List.Header>{linkedAccount.googleUserName}</List.Header>
                    {linkedAccount.googleUserEmail}
                  </List.Content>
                </List.Item>
              </List>
              <LinkedDatabases currentUser={this.props.currentUser} linkedAccount={linkedAccount}/>
            </Segment>
          )}
        </Fragment>
      )
    }

  }

}

const LinkedAccounts = connect(mapStateToProps, mapDispatchToProps)(LinkedAccountsRedux);

export default LinkedAccounts;