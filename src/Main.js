import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import Home from "./Home";
import { Switch, Route, Link } from "react-router-dom";
import Shapes from "./Shapes";

const Main = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/shapes" component={Shapes} />
  </Switch>
);

export default Main;
