import React from "react";
import "./App.css";
import { Switch, Route} from "react-router-dom";

import Arena from "./Arena"
import * as gridcutting from "./js/gridcutting.js"
import * as gridnodes from "./js/gridnodes.js"
import * as estimation from "./js/estimation.js"
import * as shuttles from "./js/shuttles.js"
import * as bubbletarget from "./js/bubbletarget.js"
import * as multiplicationgrid from "./js/multiplicationgrid.js"
import * as unknownsnumberline from "./js/unknownsnumberline.js"
import Landing from "./Login"
import ProtectedRoute from "./ProtectedRoute"
import Manipulatives from "./Manipulatives"

const Main = () => (
  <Switch>
    <Route path="/login/" component={Landing}  />
    <Route exact path="/:any/login/" component={Landing}  />
    <Route exact path="/estimationinput" render={(props)=><ProtectedRoute {...props} fullscreen = {true} script = {estimation.init}/>} />
    <Route path="/multiplicationgrid" render={(props)=><ProtectedRoute {...props} fullscreen = {true} script = {multiplicationgrid.init}/>} />
    <Route path="/unknownsnumberline" render={(props)=><ProtectedRoute {...props} fullscreen = {true} script = {unknownsnumberline.init}/>} />
    <Route path="/shuttles" render={(props)=><ProtectedRoute {...props} fullscreen = {true} script = {shuttles.init}/>} />
    <Route exact path="/bubbletarget" render={()=><Arena fullscreen = {true} script = {bubbletarget.init}/>} />
    <Route exact path="/multiplication" render={()=><Arena fullscreen = {true} script = {multiplicationgrid.init}/>} />
    <Route exact path="/gridcutting" render={()=><Arena features = {{x: 5,y: 5,descriptor: false}} fullscreen = {true} script = {gridcutting.init}/>} />
    <Route exact path="/gridnodes" render={()=><Arena features = {{x: 5,y: 5,descriptor: false}} fullscreen = {true} script = {gridnodes.init}/>} />
    <Route exact path="/" component={Manipulatives} />
  </Switch>
);

export default Main;
