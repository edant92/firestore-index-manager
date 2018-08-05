import React, {Component, Fragment} from 'react'
import LinkedAccounts from "./LinkedAccounts";
import AddLinkedAccount from "./AddLinkedAccount";
import {Segment} from "semantic-ui-react";

class Dashboard extends Component {

  render() {
    return (
      <Fragment>
        <Segment>
          <AddLinkedAccount currentUser={this.props.currentUser}/>
        </Segment>
        <Segment>
          <LinkedAccounts currentUser={this.props.currentUser}/>
        </Segment>
      </Fragment>
    )
  }

}

export default Dashboard