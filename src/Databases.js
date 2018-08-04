import React, {Component, Fragment} from 'react';
import {Icon, Loader, Segment, Table} from "semantic-ui-react";
import AddLinkFirestore from "./AddLinkFirestore";
import {firestore} from "./config/fire";
import {FIREBASE_PATH, ROUTER_PATH} from "./Constants";
import {Link} from "react-router-dom";
import Indexes from "./Indexes";

class Databases extends Component {

  handleChangeInput = (event) => {
    this.setState({[event.target.id]: event.target.value});
  };

  getLinkedDatabases = () => {
    const UID = this.props.currentUser.uid;
    let linkedDatabasesRef = firestore.collection(FIREBASE_PATH.FIRESTORE_INFO_BASE).doc(UID).collection(FIREBASE_PATH.FIRESTORE_PROJECT);

    console.log('Getting linked databases from', linkedDatabasesRef);

    linkedDatabasesRef.get().then((querySnapshot) => {

      let linkedDatabases = [];

      querySnapshot.forEach((doc) => {

        let docData = doc.data();

        console.log('docData', docData);

        let linkedDatabase = {
          id: doc.id,
          projectId: docData.projectId,
          googleUserEmail: docData.googleUserEmail
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
    this.getLinkedDatabases();
  }

  render() {

    let {linkedDatabases, showLoader} = this.state;

    console.log('linkedDatabases', linkedDatabases);

    return (
      <Fragment>
        <Segment>
          <AddLinkFirestore currentUser={this.props.currentUser}/>
        </Segment>
        <Segment>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Project ID</Table.HeaderCell>
                <Table.HeaderCell>Linked Account / Email</Table.HeaderCell>
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
                      <Table.Cell>{linkedDatabase.googleUserEmail}</Table.Cell>
                      <Table.Cell><Link to={ROUTER_PATH.INDEXES}>View Indexes</Link></Table.Cell>
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
        </Segment>
      </Fragment>
    )


  }


}

export default Databases;