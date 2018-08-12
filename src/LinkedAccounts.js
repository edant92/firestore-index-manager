import React, {Component, Fragment} from 'react';
import {Divider, Dropdown, Icon, Image, List, Loader, Menu} from "semantic-ui-react";
import {firestore} from "./config/fire";
import {FIREBASE_PATH} from "./Constants";
import {connect} from "react-redux";
import {setUpdateLinkedAccounts} from "./redux/actions";
import LinkedDatabases from "./LinkedDatabases";
import ReauthenticateLinkedAccount from "./ReauthenticateLinkedAccount";
import DeleteLinkedAccountModal from "./DeleteLinkedAccountModal";

const mapStateToProps = state => {
  return {
    activeFirestoreDetails: state.activeFirestoreDetails,
    updateLinkedAccounts: state.updateLinkedAccounts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUpdateLinkedAccounts: updateLinkedAccounts => dispatch(setUpdateLinkedAccounts(updateLinkedAccounts))
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

  componentWillReceiveProps(nextProps, nextContext) {

    console.log('nextProps', nextProps);
    if (nextProps.updateLinkedAccounts !== this.props.updateLinkedAccounts) {
      this.getLinkedAccounts();
      this.props.setUpdateLinkedAccounts(false);
    }
  }

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

          {linkedAccounts.length !== 0 ?
            linkedAccounts.map((linkedAccount, index) =>
              <Fragment key={index}>
                <Menu style={{marginTop: 0}} fluid borderless text>
                  <Menu.Item>
                    <List divided verticalAlign='middle'>
                      <List.Item>
                        <Image avatar src={linkedAccount.googleUserPhoto}/>
                        <List.Content>
                          <List.Header>{linkedAccount.googleUserName}</List.Header>
                          {linkedAccount.googleUserEmail}
                        </List.Content>
                      </List.Item>
                    </List>
                  </Menu.Item>
                  <Menu.Menu position='right'>
                    <Menu.Item>
                      <ReauthenticateLinkedAccount currentUser={this.props.currentUser}
                                                   linkedAccount={linkedAccount}/>
                    </Menu.Item>
                    <Dropdown item icon='setting'>
                      <Dropdown.Menu>
                        <Dropdown.Item><Icon name='refresh'/>Force Reauthentication</Dropdown.Item>
                        <DeleteLinkedAccountModal currentUser={this.props.currentUser}
                                                  linkedAccount={linkedAccount}/>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Menu.Menu>
                </Menu>
                <LinkedDatabases currentUser={this.props.currentUser} linkedAccount={linkedAccount}/>
                {index < linkedAccounts.length - 1 && <Divider/>}
              </Fragment>
            )
            :
            <Fragment>
              You haven't linked any Firebase Accounts yet.
            </Fragment>}
        </Fragment>
      )
    }

  }

}

const LinkedAccounts = connect(mapStateToProps, mapDispatchToProps)(LinkedAccountsRedux);

export default LinkedAccounts;