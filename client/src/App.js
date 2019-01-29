import React, {Component, Fragment} from 'react';
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import { Auth } from "aws-amplify";
class App extends Component {

  state = {
    isAuthenticated: false,
    isAuthenticating: true
  };

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (error) {
      if (error !== "No current user") {
        alert(error);
      }
    }
    
    this.setState( {isAuthenticating: false});
  }

  handleLogout = async event => {
    await Auth.signOut();
  
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated});
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    return(
      !this.state.isAuthenticating &&
        <div className="App">
          <Navbar fluid collapseOnSelect staticTop inverse>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">Lyrebird</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                {this.state.isAuthenticated
                  ? <Fragment>
                      <LinkContainer to="/draw">
                        <NavItem eventKey={1}>
                          Draw
                        </NavItem>
                      </LinkContainer>
                      <LinkContainer to="/get-inspired">
                      <NavItem eventKey={2}>
                        Get Inspired
                      </NavItem>
                      </LinkContainer>
                      <LinkContainer to="/play">
                      <NavItem eventKey={3}>
                        Play
                      </NavItem>
                      </LinkContainer>
                      <LinkContainer to="/my-images">
                      <NavItem eventKey={4}>
                        My Profile
                      </NavItem>
                      </LinkContainer>
                      <NavDropdown eventKey={5} title="About" id="basic-nav-dropdown">
                        <LinkContainer exact to={'/about#demo'}>
                          <MenuItem eventKey={5.1}>Demo</MenuItem>
                        </LinkContainer>
                        <LinkContainer exact to={"/about#about"}>
                          <MenuItem eventKey={5.2}>The Big Idea</MenuItem>
                        </LinkContainer>
                        <LinkContainer exact to="/about#credits">
                          <MenuItem eventKey={5.3}>Credits</MenuItem>
                        </LinkContainer>
                      </NavDropdown>
                    </Fragment>
                  : <NavDropdown eventKey={5} title="About" id="basic-nav-dropdown">
                      <MenuItem eventKey={5.1}>Demo</MenuItem>
                      <MenuItem eventKey={5.2}>The Big Idea</MenuItem>
                      <MenuItem eventKey={5.3}>Credits</MenuItem>
                    </NavDropdown>
                }
              </Nav>
              <Nav pullRight>
                {this.state.isAuthenticated
                  ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                  : <Fragment>
                      <LinkContainer to="/signup">
                        <NavItem>Signup</NavItem>
                      </LinkContainer>
                      <LinkContainer to="/login">
                        <NavItem>Login</NavItem>
                      </LinkContainer>
                    </Fragment>
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps}/>
        </div>
    );
  }
}

export default withRouter(App);
