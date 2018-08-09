import React, {Component, Fragment} from 'react';
import './App.css';
import {Breadcrumb, Button, Icon, Label, Loader, Message, Table} from "semantic-ui-react";
import {connect} from "react-redux";

const mapStateToProps = state => {
  return {
    accessToken: state.accessToken,
    activeFirestoreDetails: state.activeFirestoreDetails
  };
};

class IndexesRedux extends Component {

  getIndexes = () => {
    let accessToken = this.props.accessToken;
    let projectId = this.props.match.params.id;
    console.log(projectId + ' for ' + accessToken);
    this.setState({indexesLoading: true});
    console.log('Refreshing List of Indexes');
    fetch('https://firestore.googleapis.com/v1beta1/projects/' + projectId + '/databases/(default)/indexes', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }).then((response) => {

        if (response.status === 401) {
          throw new Error("Account Unauthorised. Please re-authenticate this account from the Databases screen.");
        }
        if (response.status === 403) {
          throw new Error('Unable to find Firestore Database \'' + projectId + '\' for this account.');
        }

        return response.json()
      }
    ).then((data) => {

      let indexes = data.indexes;

      if (indexes) {
        this.setState({indexes, indexesLoading: false, indexesError: false});
      } else {
        this.setState({indexes: [], indexesLoading: false, indexesError: false});
        console.log('No indexes available.')
      }

    }).catch((error) => {

      let errorText = `${error}`;
      let indexesErrorMessage = errorText.replace('Error: ','');

      this.setState({indexesLoading: false, indexesError: true, indexesErrorMessage});
      console.log(error);
    });
  };

  deleteIndividualIndex = (name) => {
    this.setState({disabledRowNames: this.state.disabledRowNames.concat([name])}, () => {
      this.deleteIndex(name).then(() => {
        this.getIndexes();
      });
    });
  };

  deleteIndex = (name) => {
    let projectId = this.props.activeFirestoreDetails.projectId;
    let accessToken = this.props.accessToken;
    console.log('Deleting Index with ID of', name.replace('projects/' + projectId + '/databases/(default)/indexes/', ''));
    return fetch('https://firestore.googleapis.com/v1beta1/' + name, {
      method: 'delete',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }).then((response) => {

      //TODO: Add code to catch 401 (unauthorised) error

      console.log(response);
      console.log('Index successfully deleted');
    }).catch((error) => {
      console.log(error);
    });
  };

  deleteAllIndexes = () => {
    console.log('Deleting Indexes');
    this.state.indexes.forEach(item => {
      this.deleteIndex(item.name);
    });
  };

  getIndexId = (name) => {
    let nameArray = name.split('/');
    return nameArray[nameArray.length - 1];
  };

  constructor(props) {
    super(props);

    this.state = {
      indexes: [],
      indexesLoading: false,
      indexesError: false,
      indexesErrorMessage: '',
      disabledRowNames: []
    };

  }

//TODO: Load indexes on start up and change button to 'refresh indexes'

  render() {

    let {indexes, indexesLoading, indexesError, indexesErrorMessage, disabledRowNames} = this.state;

    return (
      <Fragment>
        <Button onClick={this.getIndexes}>Get Indexes</Button>
        <Button onClick={this.deleteAllIndexes} negative disabled={indexes.length === 0}>Delete All Indexes</Button>

        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Index ID</Table.HeaderCell>
              <Table.HeaderCell>Collection Group</Table.HeaderCell>
              <Table.HeaderCell>Fields Indexed</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {indexes.map((item, index) =>
              <Table.Row key={index} disabled={disabledRowNames.find(k => k === item.name)}>
                <Table.Cell>
                  {this.getIndexId(item.name)}
                </Table.Cell>
                {console.log(item)}
                <Table.Cell>
                  {item.collectionId}
                </Table.Cell>
                <Table.Cell>
                  <Breadcrumb>
                    {item.fields.map((field, index) =>
                      <span key={index}>
                          <Breadcrumb.Section>
                            {field.fieldPath}
                            {field.mode === 'ASCENDING' ? <Icon name='arrow up'/> :
                              <Icon name='arrow down'/>}
                          </Breadcrumb.Section>
                        {index !== item.fields.length - 1 && <Breadcrumb.Divider/>}
                        </span>
                    )}
                  </Breadcrumb>
                </Table.Cell>
                <Table.Cell><Label color='blue'>{item.state}</Label></Table.Cell>
                <Table.Cell>
                  {disabledRowNames.find(k => k === item.name) ?
                    <Loader active inline='centered' size='small'/> :
                    <Icon name='delete' link
                          onClick={() => this.deleteIndividualIndex(item.name)}/>}
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        {indexesLoading && <Loader active inline='centered'>Loading Indexes...</Loader>}
        {indexesError &&
        <Message error>
          <Message.Header>Error Loading Indexes</Message.Header>
          <Message.Content>{indexesErrorMessage}</Message.Content>
        </Message>}
      </Fragment>
    )
  }
}

const Indexes = connect(mapStateToProps, null)(IndexesRedux);

export default Indexes