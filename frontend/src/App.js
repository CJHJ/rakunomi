import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import history from "./history";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/pages/Home";
import CreateMeeting from "./components/pages/CreateMeeting";
import ViewMeetings from "./components/pages/ViewMeetings";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";

function App() {
  return (
    <Router history={history}>
      <div id="main-container">
        <Header />
        <div id="main-content">
          <Switch>
            <Route path="/meeting/create">
              <CreateMeeting />
            </Route>
            <Route path="/meeting/view">
              <ViewMeetings />
            </Route>
            <Route path="/signin">
              {AuthService.getCurrentUser() ? <Redirect to="/" /> : <SignIn />}
            </Route>
            <Route path="/signup">
              {AuthService.getCurrentUser() ? <Redirect to="/" /> : <SignUp />}
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
