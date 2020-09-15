import React from "react";

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
              <a href="">Home</a>
            </li>
            <li className="header-nav-button">
              <a href="">Create Meeting</a>
            </li>
            <li className="header-nav-button">
              <a href="">View Meeting</a>
            </li>
          </ul>
        </nav>
        <div id="header-user">
          <button className="header-user-button">Sign In</button>
          <button className="header-user-button">Sign Up</button>
        </div>
      </header>
    );
  }
}

export default Header;
