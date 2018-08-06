import {firebaseAuth} from "../config/fire";
import {Redirect} from "react-router-dom";
import React, {Component, Fragment} from "react";
import {Loader} from "semantic-ui-react";

class Logout extends Component {
  constructor() {
    super();
    this.state = {
      redirect: false
    }
  }

  componentWillMount() {
    firebaseAuth.signOut().then((user, error) => {
      console.log(user, error);
      this.setState({redirect: true})
    });
  }

  render() {
    if (this.state.redirect === true) {
      return <Redirect to="/login"/>
    }

    return (
      <Fragment>
        <Loader active>Logging out of Firestore Index Manager...</Loader>
      </Fragment>
    )
  }
}

export default Logout