import React, {Component} from 'react'
import {Divider, Grid, Image, List, Segment} from "semantic-ui-react";
import logo from './img/logo-with-text.svg'

class AccountDeleted extends Component {

  constructor() {
    super();
    this.state = {
      redirect: false
    }
  }

  render() {

    return (
      <Grid padded stackable columns={3} centered verticalAlign='middle' textAlign='left'
            id='content-main-opposite'>
        <Grid.Column> </Grid.Column>
        <Grid.Column>
          <Segment basic>
            <Image src={logo} centered/>
            <Divider section/>
            <List>
              <List.Item>
                <List.Header>Your Account has been deleted</List.Header>
                <List.Description>
                  Thank you for using Firestore Index Manager
                </List.Description>
              </List.Item>
            </List>
            <Divider section/>
          </Segment>
        </Grid.Column>
        <Grid.Column> </Grid.Column>
      </Grid>
    )
  }
}

export default AccountDeleted