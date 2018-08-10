import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import HomePage from "./HomePage";
import { Switch, Route, Link } from "react-router-dom";
import Shapes from "./Shapes";

const Main = () => (
  <Switch>
    <Route exact path="/" component={Shapes} />
    <Route exact path="/shapes" component={Shapes} />
  </Switch>
);

export default Main;
