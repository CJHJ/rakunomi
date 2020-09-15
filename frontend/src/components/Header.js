import React from "react";
import { Link } from "react-router-dom";

import "./css/Header.css";

class Header extends React.Component {
  render() {
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
            <li className="header-nav-button">
              <Link to="/meeting/create">Create Meeting</Link>
            </li>
            <li className="header-nav-button">
              <Link to="/meeting/view">View Meeting</Link>
            </li>
          </ul>
        </nav>
        <div id="header-user">
          <Link to="/signin">
            <button className="header-user-button">Sign In</button>
          </Link>
          <Link to="/signup">
            <button className="header-user-button">Sign Up</button>
          </Link>
        </div>
      </header>
    );
  }
}

export default Header;
