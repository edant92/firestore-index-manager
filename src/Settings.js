import React, {Component} from "react";
import {Header, Image, List, Segment} from "semantic-ui-react";
import DeleteAccountModal from "./DeleteAccountModal";

class Settings extends Component {

  state = {
    modalOpen: false
  };

  render() {

    let currentUser = this.props.currentUser;

    console.log(currentUser);

    return (
      <Segment basic>
        <Header as='h1'>Settings</Header>
        <Segment>
          <Header as='h2'>Account Details</Header>
          <List divided verticalAlign='middle'>
            <List.Item>
              <Image avatar src={currentUser.photoURL}/>
              <List.Content>
                <List.Header>{currentUser.displayName}</List.Header>
                {currentUser.email}
              </List.Content>
            </List.Item>
          </List>
        </Segment>
        <Segment>
          <Header as='h2'>Delete Account</Header>
          <DeleteAccountModal currentUser={currentUser}/>
        </Segment>
      </Segment>
    )
  }

}

export default Settings;