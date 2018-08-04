import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom';
import {Button, Feed, Image, Menu} from "semantic-ui-react";
import {AUTHENTICATION, ROUTER_PATH} from "./Constants";
import {GoogleLogin, GoogleLogout} from "react-google-login";
import {setAccessToken} from "./redux/actions";
import {connect} from "react-redux";
import builtWithFirebaseLogo from './img/firebase-logo-built_white.svg'
import logo from './img/logo-with-text.svg'

const mapStateToProps = state => {
  return {
    accessToken: state.accessToken,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setAccessToken: accessToken => dispatch(setAccessToken(accessToken))
  };
};


class NavBar extends Component {

  handleItemClick = (e, {id}) => {
    this.setState({activeItem: id});
  };

  responseGoogleSuccess = (response) => {
    let accessToken = response.accessToken;
    this.props.setAccessToken(accessToken);
    let googleUserName = response.w3.ig;
    let googleUserEmail = response.w3.U3;
    let googleUserPhoto = response.w3.Paa;
    this.setState({googleUserName, googleUserEmail, googleUserPhoto})
  };

  responseGoogleFailure = (response) => {
    console.log(response);
    //TODO: Update UI if unsuccessful (use Error Message and get Error?)
    this.props.setAccessToken('');
  };

  logoutGoogle = () => {
    this.props.setAccessToken('');
    let googleUserName = '';
    let googleUserEmail = '';
    let googleUserPhoto = '';
    this.setState({googleUserName, googleUserEmail, googleUserPhoto})
  };

  constructor(props) {
    super(props);

    this.state = {
      activeItem: this.props.location.pathname,
      googleUserName: '',
      googleUserEmail: '',
      googleUserPhoto: ''
    }

  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.accessToken !== this.props.accessToken) {
      let accessToken = nextProps.accessToken;
      this.setState({accessToken})
    }

  }

  render() {

    let {activeItem, accessToken, googleUserName, googleUserEmail, googleUserPhoto} = this.state;

    if (!this.props.authenticated) {
      return ('')
    }

    return (

      <Menu id='sidebar-menu' vertical fixed='top' borderless>
        <Menu.Item header>
          <Image src={logo} size='small' centered/>
        </Menu.Item>

        <Link
          to={ROUTER_PATH.INDEXES}><Menu.Item className='nav-bar-desktop-item' key={ROUTER_PATH.INDEXES}
                                              id={ROUTER_PATH.INDEXES} as="span"
                                              active={activeItem === ROUTER_PATH.INDEXES}
                                              onClick={this.handleItemClick} link>Indexes</Menu.Item></Link>

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

        <Menu.Item>
          {accessToken ?
            <Button fluid negative
                    content='Logout'
                    as={GoogleLogout}
                    onLogoutSuccess={this.logoutGoogle}/>
            :
            <Button fluid positive
                    content='Login'
                    as={GoogleLogin}
                    discoveryDocs={AUTHENTICATION.DISCOVERY_DOCS}
                    clientId={AUTHENTICATION.CLIENT_ID}
                    scope={AUTHENTICATION.SCOPES.join(' ')}
                    onSuccess={this.responseGoogleSuccess}
                    onFailure={this.responseGoogleFailure}/>
          }
        </Menu.Item>
        {googleUserName &&
        <Menu.Item>
          <Feed>
            <Feed.Event>
              <Feed.Label image={googleUserPhoto}/>
              <Feed.Content summary={'Logged in as ' + googleUserName} extraText={googleUserEmail}/>
            </Feed.Event>
          </Feed>
        </Menu.Item>
        }

        <Menu.Item id="sidebar-menu-bottom">
            <Image src={builtWithFirebaseLogo} size='small' centered/>
        </Menu.Item>
      </Menu>
    );
  }

}

const SidebarMenu = connect(mapStateToProps, mapDispatchToProps)(withRouter(NavBar));

export default SidebarMenu