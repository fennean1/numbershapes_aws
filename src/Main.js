import React from "react";
import "./App.css";
import { Switch, Route} from "react-router-dom";

import Arena from "./Arena"
import * as multiplicationgrid from "./js/multiplicationgrid.js"
import * as decorators from "./js/decorators.js"
import * as primechips from "./js/primechips.js"
import * as dualnumberline from "./js/dualnumberline.js"
import Manipulatives from "./Manipulatives"

const Main = () => (
  <Switch>
    <Route path="/multiplicationgrid" render={()=><Arena fullscreen = {true} script = {multiplicationgrid.init}/>} />
    <Route path="/decorators" render={()=><Arena fullscreen = {true} script = {decorators.init}/>} />
    <Route path="/primechips" render={()=><Arena fullscreen = {true} features = {{chip: true}} script = {primechips.init}/>} />
    <Route path="/primeline" render={()=><Arena fullscreen = {true} features = {{chip: true}} script = {primechips.init}/>} />
    <Route path="/dualnumberline" render={()=><Arena fullscreen = {true} features = {{chip: true}} script = {dualnumberline.init}/>} />
    <Route path="/multiplicationgridk2" render={()=><Arena fullscreen = {true} features = {{type: "k2"}} script = {multiplicationgrid.init}/>} />
    <Route path="/" component={Manipulatives} />
  </Switch>
);

export default Main;
