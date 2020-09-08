import React, { Component } from "react";
import "./App.css";
import { Switch, Route, Link } from "react-router-dom";

import Arena from "./Arena"
import * as subitizer from "./js/subitizer.js"
import * as matchgame from "./js/numbershapesmatch.js"
import * as clothesline from "./js/clothesline.js"
import * as dotrateproblem from "./js/dotrateproblem.js"
import * as numberlinespace from "./js/numberlinespace.js"
import * as numberline from "./js/projectile.js"
import * as buildandcut from "./js/buildandcut.js"
import * as dualnumberline from "./js/dualnumberline.js"
import * as twodimensionalnumberline from "./js/twodimensionalnumberline.js"
import * as fractionmultiplication from "./js/fractionmultiplication.js"
import * as plainjane from "./js/plainjane.js"
import * as multiplication from "./js/multiplication.js"
import * as khtestenv from "./js/khtestenv.js"
import * as dotsgame from "./js/dotsgame.js"
import * as Subitization from "./activities/Subitization.json";
import * as Addition from "./activities/Addition.json";
import LessonList from "./LessonList"
import Interactives from "./Interactives"
import QuickImages from "./QuickImages"
import WebLink from "./WebLink"
import QuickImagePortal from "./QuickImagePortal";
import LandingPage from "./LandingPage"
import FractionList from "./FractionList";
import ActivityPage from "./ActivityPage";

const Main = () => (
  <Switch>
    <Route exact path="/estimationinput" render={()=><Arena fullscreen = {true} script = {khtestenv.init}/>} />
    <Route exact path="/" component={LandingPage} />
    <Route path="/content" component={LandingPage} />
    <Route path="/quickimages/:activity" component={QuickImagePortal} />
  </Switch>
);

export default Main;
