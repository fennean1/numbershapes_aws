import React from "react";
import "./App.css";
import { Switch, Route} from "react-router-dom";
import Arena from "./Arena"
import * as multiplicationgrid from "./js/multiplicationgrid.js"
import * as decorators from "./js/decorators.js"
import * as primechips from "./js/primechips.js"
import * as dualnumberline from "./js/dualnumberline.js"
import * as partialproducts from "./js/partialproducts.js"
import Manipulatives from "./Manipulatives"
import * as drawing from "./js/drawing.js"
import * as spotlight from "./js/spotlight.js"
import * as cuisenairecircles from "./js/cuisenairecircles.js"



const Main = () => (
  <Switch>
    <Route path="/multiplicationgrid" render={()=><Arena fullscreen = {true} script = {multiplicationgrid.init}/>} />
    <Route path="/decorators" render={()=><Arena fullscreen = {true} script = {decorators.init}/>} />
    <Route path="/primechips" render={()=><Arena fullscreen = {true} features = {{chip: true}} script = {primechips.init}/>} />
    <Route path="/primeline" render={()=><Arena fullscreen = {true} features = {{chip: true}} script = {primechips.init}/>} />
    <Route path="/dualnumberline" render={()=><Arena fullscreen = {true} features = {{chip: true}} script = {dualnumberline.init}/>} />
    <Route path="/rainbowarrays" render={()=><Arena fullscreen = {true} features = {{chip: true}} script = {partialproducts.init}/>} />
    <Route path="/drawing" render={()=><Arena fullscreen = {true} script = {drawing.init}/>} />
    <Route path="/spotlight" render={()=><Arena fullscreen = {true} script = {spotlight.init}/>} />
    <Route path="/cuisenairecirclesbeta" render={()=><Arena fullscreen = {true} script = {cuisenairecircles.init}/>} />
    <Route path="/relationalcircles" render={()=><Arena fullscreen = {true} script = {cuisenairecircles.init}/>} />
    <Route path="/multiplicationgridk2" render={()=><Arena fullscreen = {true} features = {{type: "k2"}} script = {multiplicationgrid.init}/>} />
    <Route path="/" component={Manipulatives} />
  </Switch>
);

export default Main;
