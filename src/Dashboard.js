import React, {Component, Fragment} from 'react'
import LinkedAccounts from "./LinkedAccounts";
import AddLinkedAccount from "./AddLinkedAccount";
import {Segment} from "semantic-ui-react";

class Dashboard extends Component {

  render() {
    return (
      <Fragment>
        <Segment attached='top'>
          <AddLinkedAccount currentUser={this.props.currentUser}/>
        </Segment>
        <Segment attached='bottom'>
          <LinkedAccounts currentUser={this.props.currentUser}/>
        </Segment>
      </Fragment>
    )
  }

}

export default Dashboard