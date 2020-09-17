import React from "react";
import { Link } from "react-router-dom";

import "./css/Header.css";
import AuthService from "../services/auth.service";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    AuthService.logout();
    window.location.reload();
  }

  render() {
    const currentUser = AuthService.getCurrentUser();

    return (
      <header id="app-header">
        <div id="header-logo">
          <h1>RakuNomi</h1>
        </div>
        <nav id="header-navbar">
          <ul id="navbar-list">
            <li className="header-nav-button">
              <Link to="/">Home</Link>
            </li>
            {currentUser && (
              <li className="header-nav-button">
                <Link to="/meeting/create">Create Meeting</Link>
              </li>
            )}
            {currentUser && (
              <li className="header-nav-button">
                <Link to="/meetings">View Meetings</Link>
              </li>
            )}
          </ul>
        </nav>
        <div id="header-user">
          {!currentUser && (
            <Link to="/signin">
              <button className="header-user-button">Sign In</button>
            </Link>
          )}
          {!currentUser && (
            <Link to="/signup">
              <button className="header-user-button">Sign Up</button>
            </Link>
          )}
          {currentUser && (
            <div className="header-user-greeting">
              Hello, {currentUser.user_name}
            </div>
          )}
          {currentUser && (
            <button className="header-user-button" onClick={this.handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>
    );
  }
}

export default Header;
