import React, {Component} from "react";
import {Divider, Header, Segment} from "semantic-ui-react";
import DeleteAccountModal from "./DeleteAccountModal";

class Settings extends Component {

  state = {
    modalOpen: false
  };

  render() {
    return (
      <Segment basic>
        <Header as='h1'>Settings</Header>
        <Divider/>
        <Header as='h2'>Delete Account</Header>
        <DeleteAccountModal currentUser={this.props.currentUser}/>
      </Segment>
    )
  }

}

export default Settings;