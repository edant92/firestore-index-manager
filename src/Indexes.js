import React, {Component, Fragment} from 'react';
import './App.css';
import {Breadcrumb, Button, Icon, Label, Loader, Message, Table} from "semantic-ui-react";
import {connect} from "react-redux";

const mapStateToProps = state => {
  return {
    accessToken: state.accessToken
  };
};

class IndexesRedux extends Component {

  getIndexes = () => {
    this.setState({indexesLoading: true});
    console.log('Refreshing List of Indexes');
    fetch('https://firestore.googleapis.com/v1beta1/projects/jobcatcher-app/databases/(default)/indexes', {
      headers: {
        'Authorization': 'Bearer ' + this.props.accessToken
      }
    }).then((response) => response.json()
    ).then((data) => {

      let indexes = data.indexes;

      if (indexes) {
        this.setState({indexes, indexesLoading: false});
      } else {
        this.setState({indexes: [], indexesLoading: false});
        console.log('No indexes available.')
      }

    }).catch((error) => {
      this.setState({indexesLoading: false});
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
    console.log('Deleting Index with ID of', name.replace('projects/jobcatcher-app/databases/(default)/indexes/', ''));
    return fetch('https://firestore.googleapis.com/v1beta1/' + name, {
      method: 'delete',
      headers: {
        'Authorization': 'Bearer ' + this.props.accessToken
      }
    }).then((response) => {
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
      disabledRowNames: []
    };

  }

  componentDidUpdate(prevProps) {
    if (prevProps.accessToken !== this.props.accessToken) {
      this.getIndexes();
    }
  }

//TODO: Load indexes on start up and change button to 'refresh indexes'

  render() {

    let {indexes, indexesLoading, disabledRowNames} = this.state;

    if (this.props.accessToken) {
      // noinspection JSUnresolvedVariable
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
                <Table.Row key={index} disabled={disabledRowNames.find(k => k===item.name)}>
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
                    {disabledRowNames.find(k => k===item.name) ?
                      <Loader active inline='centered' size='small'/> :
                      <Icon name='delete' link
                            onClick={() => this.deleteIndividualIndex(item.name)}/>}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          {indexesLoading && <Loader active inline='centered'>Loading Indexes...</Loader>}
        </Fragment>
      )
    } else {
      return (
        <Message error>
          <Message.Content>
            <Message.Header>Not logged in</Message.Header>
            You must log in to access your Firestore indexes
          </Message.Content>
        </Message>
      )
    }
  }
}

const Indexes = connect(mapStateToProps, null)(IndexesRedux);

export default Indexes