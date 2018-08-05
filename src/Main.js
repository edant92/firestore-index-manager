import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {ROUTER_PATH} from "./Constants";
import Indexes from "./Indexes";
import Login from "./authentication/Login";
import Dashboard from "./Dashboard";

// AuthenticatedRoute added above App component
const AuthenticatedRoute = ({component: Component, authenticated, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
        ? <Component {...props} {...rest} />
        : <Redirect to={{pathname: ROUTER_PATH.LOGIN, state: {from: props.location}}}/>}/>
  )
};

class Main extends Component {

  render() {

    return (
      <Switch>
        <Route exact path={ROUTER_PATH.LOGIN} render={(props) => {
          return <Login setCurrentUser={this.props.setCurrentUser} currentUser={this.props.currentUser} {...props}/>
        }}/>
        <AuthenticatedRoute authenticated={this.props.authenticated} exact path={ROUTER_PATH.INDEXES}
                            component={Indexes} currentUser={this.props.currentUser}/>
        }}/>
        <AuthenticatedRoute authenticated={this.props.authenticated} exact path={ROUTER_PATH.DATABASES}
                            component={Dashboard} currentUser={this.props.currentUser}/>
        }}/>
      </Switch>
    )
  };
}

export default Main
