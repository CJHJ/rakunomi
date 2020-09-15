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
          <button className="header-nav-button">Home</button>
          <button className="header-nav-button">Create Meeting</button>
          <button className="header-nav-button">View Meeting</button>
        </nav>
        <div id="header-user">
          <button className="header-signup">Sign In</button>
          <button className="header-signin">Sign Up</button>
        </div>
      </header>
    );
  }
}

export default Header;
