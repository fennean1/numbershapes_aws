import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import FractionList from "./FractionList"

import { Switch, Route, Link } from "react-router-dom";
import Shapes from "./Shapes";

const Main = () => (
  <Switch>
    <Route exact path="/" component={Shapes} />
    <Route exact path="/shapes" component={Shapes} />
    <Route exact path="/fractions" component={FractionList} />
  </Switch>
);

export default Main;
