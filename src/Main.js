import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {ROUTER_PATH} from "./Constants";
import Indexes from "./Indexes";

// AuthenticatedRoute added above App component
const AuthenticatedRoute = ({component: Component, authenticated, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
        ? <Component {...props} {...rest} />
        : <Redirect to={{pathname: ROUTER_PATH.INDEXES, state: {from: props.location}}}/>}/>
  )
};

class Main extends Component {

  render() {

    return (
      <Switch>
        <Route exact path={ROUTER_PATH.INDEXES} component={Indexes}/>
      </Switch>
    )
  };
}

export default Main
