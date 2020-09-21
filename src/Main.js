import React from "react";
import "./App.css";
import { Switch, Route} from "react-router-dom";

import Arena from "./Arena"
import * as gridcutting from "./js/gridcutting.js"
import * as gridnodes from "./js/gridnodes.js"
import * as estimation from "./js/estimation.js"
import * as bubbletarget from "./js/bubbletarget.js"
import * as multiplicationgrid from "./js/multiplicationgrid.js"
import LandingPage from "./LandingPage"

const Main = () => (
  <Switch>
    <Route exact path="/estimationinput" render={()=><Arena fullscreen = {true} script = {estimation.init}/>} />
    <Route exact path="/bubbletarget" render={()=><Arena fullscreen = {true} script = {bubbletarget.init}/>} />
    <Route exact path="/multiplicationgrid" render={()=><Arena fullscreen = {true} script = {multiplicationgrid.init}/>} />
    <Route exact path="/gridcutting" render={()=><Arena features = {{x: 5,y: 5,descriptor: false}} fullscreen = {true} script = {gridcutting.init}/>} />
    <Route exact path="/gridnodes" render={()=><Arena features = {{x: 5,y: 5,descriptor: false}} fullscreen = {true} script = {gridnodes.init}/>} />
    <Route exact path="/" component={LandingPage} />
    <Route path="/content" component={LandingPage} />
  </Switch>
);

export default Main;
