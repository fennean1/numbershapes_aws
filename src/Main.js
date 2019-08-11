import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import FractionList from "./FractionList";

import { Switch, Route, Link } from "react-router-dom";
import Shapes from "./Shapes";
import OldSite from "./OldSite";
import AppCard from "./AppCard";
import Arena from "./Arena"
import * as subitizer from "./subitizer.js"

const Main = () => (
  <Switch>
    <Route exact path="/" component={()=><Arena fullscreen = {true} script = {subitizer.init}/>} />
    <Route exact path="/appcard" component={AppCard} />
    <Route exact path="/fractions" component={FractionList} />
  </Switch>
);

export default Main;
