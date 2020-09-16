import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/pages/Home";
import CreateMeeting from "./components/pages/CreateMeeting";
import ViewMeetings from "./components/pages/ViewMeetings";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Feedback from "./components/pages/Feedback";

function App() {
  return (
    <Router>
      <div id="main-container">
        <Header />
        <div id="main-content">
          <Switch>
            <Route path="/meeting/feedback">
              <Feedback />
            </Route>
            <Route path="/meeting/create">
              <CreateMeeting />
            </Route>
            <Route path="/meeting/view">
              <ViewMeetings />
            </Route>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
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
