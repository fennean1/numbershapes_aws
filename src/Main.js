import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import FractionList from "./FractionList";

import { Switch, Route, Link } from "react-router-dom";
import Shapes from "./Shapes";
import OldSite from "./OldSite";

const Main = () => (
  <Switch>
    <Route exact path="/" component={OldSite} />
    <Route exact path="/oldsite" component={OldSite} />
    <Route exact path="/fractions" component={FractionList} />
  </Switch>
);

export default Main;
