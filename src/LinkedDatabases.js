import React, {Component} from 'react';
import {Icon, Loader, Segment, Table} from "semantic-ui-react";
import {firestore} from "./config/fire";
import {FIREBASE_PATH, ROUTER_PATH} from "./Constants";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {setAccessToken, setUpdateLinkedDatabases} from "./redux/actions";
import AddLinkedFirestoreDatabase from "./AddLinkedFirestoreDatabase";

const mapStateToProps = state => {
  return {
    activeFirestoreDetails: state.activeFirestoreDetails,
    accessToken: state.accessToken,
    updateLinkedDatabases: state.updateLinkedDatabases
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAccessToken: accessToken => dispatch(setAccessToken(accessToken)),
    setUpdateLinkedDatabases: updateLinkedDatabases => dispatch(setUpdateLinkedDatabases(updateLinkedDatabases))
  };
};

class DatabasesRedux extends Component {

  getLinkedProjectDatabases = () => {
    const UID = this.props.currentUser.uid;
    let linkedAccountId = this.props.linkedAccount.id;
    let linkedDatabasesRef = firestore.collection(FIREBASE_PATH.LINKED_ACCOUNTS_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_PROJECT)
      .where('linkedAccountId', '==', linkedAccountId);

    console.log('Getting linked databases from', linkedAccountId);

    linkedDatabasesRef.get().then((querySnapshot) => {

      let linkedDatabases = [];

      querySnapshot.forEach((doc) => {

        let docData = doc.data();

        let linkedDatabase = {
          id: doc.id,
          projectId: docData.projectId,
        };

        console.log('linkedDatabase', linkedDatabase);

        linkedDatabases = [linkedDatabase].concat(linkedDatabases);
      });

      this.setState({
        linkedDatabases, showLoader: false
      });

    });

  };

  constructor() {
    super();
    this.state = {
      linkedDatabases: [],
      showLoader: true
    };
  };

  componentDidMount() {
    this.getLinkedProjectDatabases();
  }

  componentWillReceiveProps(nextProps, nextContext) {

    console.log('nextProps', nextProps);
    if (nextProps.updateLinkedDatabases !== this.props.updateLinkedDatabases) {
      this.getLinkedProjectDatabases();
      this.props.setUpdateLinkedDatabases(false);
    }
  }

  render() {

    let {linkedDatabases, showLoader} = this.state;

    console.log('linkedDatabases', linkedDatabases);

    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={10}>Project ID</Table.HeaderCell>
            <Table.HeaderCell width={3}/>
            <Table.HeaderCell width={3}/>
          </Table.Row>
        </Table.Header>

        {showLoader ?
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Segment basic>
                  <Loader active/>
                </Segment>
              </Table.Cell>
            </Table.Row>
          </Table.Body> :
          linkedDatabases.length !== 0 ?
            <Table.Body>
              {linkedDatabases.map(linkedDatabase =>
                <Table.Row key={linkedDatabase.id}>
                  <Table.Cell>{linkedDatabase.projectId}</Table.Cell>
                  <Table.Cell>
                    <Link to={ROUTER_PATH.DASHBOARD_TO_INDEX + '/' + linkedDatabase.projectId}
                          onClick={() => this.props.setAccessToken(this.props.linkedAccount.accessToken)}>
                      View Indexes
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Icon name='delete' link onClick={() => {
                    }}/>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body> :
            <Table.Body>
              <Table.Row>
                <Table.Cell>You haven't linked any databases yet.</Table.Cell>
              </Table.Row>
            </Table.Body>
        }
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan='3'>
              <AddLinkedFirestoreDatabase currentUser={this.props.currentUser}
                                          linkedAccount={this.props.linkedAccount}/>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    )


  }


}

const LinkedDatabases = connect(mapStateToProps, mapDispatchToProps)(DatabasesRedux);

export default LinkedDatabases;