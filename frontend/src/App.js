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
import ViewMeeting from "./components/pages/ViewMeeting";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Feedback from "./components/pages/Feedback";
import EditMeeting from "./components/pages/EditMeeting";

function App() {
  return (
    <Router history={history}>
      <div id="main-container">
        <Header />
        <div id="main-content">
          <Switch>
            <Route path="/meeting/feedback">
              <Feedback />
            </Route>
            <Route path="/meeting/create">
              {!AuthService.getCurrentUser() ? (
                <Redirect to="/signin" />
              ) : (
                <CreateMeeting />
              )}
            </Route>
            <Route path="/meeting/view">
              {!AuthService.getCurrentUser() ? (
                <Redirect to="/signin" />
              ) : (
                <ViewMeeting />
            <Route path="/meeting/edit">
              {!AuthService.getCurrentUser() ? (
                <Redirect to="/signin" />
              ) : (
                <EditMeeting />
              )}
            </Route>
            <Route path="/meetings">
              {!AuthService.getCurrentUser() ? (
                <Redirect to="/signin" />
              ) : (
                <ViewMeetings />
              )}
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
