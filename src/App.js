import React, { Component } from 'react';
import './App.css';
import {Segment} from "semantic-ui-react";
import HeadrDesktop from "./HeaderDesktop";
import Main from "./Main";

class App extends Component {
  render() {
    return (
      <div>
        <HeadrDesktop/>
        <Segment id='content-main' basic>
          <Main />
        </Segment>
      </div>
    );
  }
}

export default App;
