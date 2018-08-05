import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom';
import {Image, Menu} from "semantic-ui-react";
import {ROUTER_PATH} from "./Constants";
import builtWithFirebaseLogo from './img/firebase-logo-built_white.svg'
import logo from './img/logo-with-text.svg'

class NavBar extends Component {

  handleItemClick = (e, {id}) => {
    this.setState({activeItem: id});
  };

  constructor(props) {
    super(props);

    this.state = {
      activeItem: this.props.location.pathname,
    }

  }

  render() {

    let {activeItem} = this.state;

    if (!this.props.authenticated) {
      return ('')
    }

    return (

      <Menu id='sidebar-menu' vertical fixed='top' borderless>
        <Menu.Item header>
          <Image src={logo} size='small' centered/>
        </Menu.Item>

        <Link
          to={ROUTER_PATH.DATABASES}><Menu.Item className='nav-bar-desktop-item' key={ROUTER_PATH.DATABASES}
                                              id={ROUTER_PATH.DATABASES} as="span"
                                              active={activeItem === ROUTER_PATH.DATABASES}
                                              onClick={this.handleItemClick} link>Databases</Menu.Item></Link>

        <Link
          to={ROUTER_PATH.SETTINGS}><Menu.Item className='nav-bar-desktop-item' key={ROUTER_PATH.SETTINGS}
                                               id={ROUTER_PATH.SETTINGS} as="span"
                                               active={activeItem === ROUTER_PATH.SETTINGS}
                                               onClick={this.handleItemClick} link>Settings</Menu.Item></Link>

        <Menu.Item id="sidebar-menu-bottom">
            <Image src={builtWithFirebaseLogo} size='small' centered/>
        </Menu.Item>
      </Menu>
    );
  }

}

const SidebarMenu = (withRouter(NavBar));

export default SidebarMenu