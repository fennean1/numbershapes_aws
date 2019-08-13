import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import FractionList from "./FractionList";

import { Switch, Route, Link } from "react-router-dom";
import Shapes from "./Shapes";
import OldSite from "./OldSite";
import AppCard from "./LessonCard";
import Arena from "./Arena"
import * as subitizer from "./subitizer.js"
import * as LessonOne from "./activities/LessonOne.json";
import LessonList from "./LessonList"

console.log("LessonOne",LessonOne)

const Main = () => (
  <Switch>
    <Route exact path="/" component={()=><Arena fullscreen = {true} type = {1}script = {subitizer.init}/>} />
    <Route exact path="/subtraction" component={()=><Arena fullscreen = {true} type = {3} script = {subitizer.init}/>} />
    <Route exact path="/appcard" component={()=><AppCard data = {LessonOne}/>}/>
    <Route exact path="/fractions" component={FractionList} />
    <Route exact path="/lessons" component={LessonList} />
  </Switch>
);

export default Main;
