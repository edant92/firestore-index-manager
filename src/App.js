import React, { Component } from 'react';
import './App.css';
import {Segment} from "semantic-ui-react";
import SidebarMenu from "./SidebarMenu";
import Main from "./Main";

class App extends Component {
  render() {
    return (
      <div>
        <SidebarMenu/>
        <Segment id='content-main' basic>
          <Main />
        </Segment>
      </div>
    );
  }
}

export default App;
