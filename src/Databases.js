import React, {Component} from 'react';
import {Icon, Loader, Segment, Table} from "semantic-ui-react";
import {firestore} from "./config/fire";
import {FIREBASE_PATH, ROUTER_PATH} from "./Constants";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {setActiveFirestoreDetails} from "./redux/actions";

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

  render() {

    let {linkedDatabases, showLoader} = this.state;

    console.log('linkedDatabases', linkedDatabases);

    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Project ID</Table.HeaderCell>
            <Table.HeaderCell> </Table.HeaderCell>
            <Table.HeaderCell> </Table.HeaderCell>
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
                  <Table.Cell><Link to={ROUTER_PATH.INDEXES}
                                    onClick={() => this.setActiveFirestoreDetails(linkedDatabase)}>View
                    Indexes</Link></Table.Cell>
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
      </Table>
    )


  }


}

const Databases = connect(mapStateToProps, mapDispatchToProps)(DatabasesRedux);

export default Databases;