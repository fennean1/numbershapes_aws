import React, { Component } from "react";
import "./App.css";
import { Switch, Route, Link } from "react-router-dom";

import Arena from "./Arena"
import * as subitizer from "./js/subitizer.js"
import * as matchgame from "./js/numbershapesmatch.js"
import * as dotrateproblem from "./js/dotrateproblem.js"
import * as numberlinespace from "./js/numberlinespace.js"
import * as numberline from "./js/numberline.js"
import * as buildandcut from "./js/buildandcut.js"
import * as multiplication from "./js/multiplication.js"
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
    <Route exact path="/goldrush"  render ={()=><Arena fullscreen = {true} type = {1} script = {subitizer.init}/>} />
    <Route exact path="/multiplication" render={()=><Arena fullscreen = {true} lesson = {Addition} type = {1} script = {multiplication.init}/>} />
    <Route exact path="/spacebubbles" render={()=><Arena fullscreen = {true} features = {{spaceBubbles: true}} script = {numberlinespace.init}/>} />
    <Route exact path="/spaceships" render={()=><Arena fullscreen = {true} features = {{spaceShips: true}}  script = {numberlinespace.init}/>} />
    <Route exact path="/buildandcut" render={()=><Arena fullscreen = {true} features = {{spaceShips: true}}  script = {buildandcut.init}/>} />
    <Route exact path="/dotrateproblem" render={()=><Arena fullscreen = {true} script = {dotrateproblem.init}/>} />
    <Route exact path="/numberline" render={()=><Arena fullscreen = {true} script = {numberline.init}/>} />
    <Route exact path="/addition" render={()=><Arena fullscreen = {true} type = {2} script = {subitizer.init}/>} />
    <Route exact path="/subtraction" render={()=><Arena fullscreen = {true} type = {3} script = {subitizer.init}/>} />
    <Route exact path="/games/matchgame" render={()=><Arena fullscreen = {true} features = {{type: "ADVANCED_MATCHING"}} type = {1} script = {matchgame.init}/>} />
    <Route exact path="/games/matchgame3-7" render={()=><Arena fullscreen = {true} features = {{type: "MEDIUM_MATCHING"}} type = {1} script = {matchgame.init}/>} />
    <Route exact path="/games/matchgame1-4" render={()=><Arena fullscreen = {true} features = {{type: "BASIC_MATCHING"}} type = {1} script = {matchgame.init}/>} />
    <Route exact path="/matchgame" render={()=><Arena fullscreen = {true} features = {{type: "ADVANCED_MATCHING"}} type = {1} script = {matchgame.init}/>} />
    <Route exact path="/matchgame3-7" render={()=><Arena fullscreen = {true} features = {{type: "MEDIUM_MATCHING"}} type = {1} script = {matchgame.init}/>} />
    <Route exact path="/matchgame1-4" render={()=><Arena fullscreen = {true} features = {{type: "BASIC_MATCHING"}} type = {1} script = {matchgame.init}/>} />
    <Route exact path="/mixed" render={()=><Arena fullscreen = {true}  type = {5} script = {subitizer.init}/>} />
    <Route exact path="/dotsgame" render={()=><Arena fullscreen = {true}  value = {8} script = {dotsgame.init}/>} />
    <Route exact path="/makingten" render={()=><Arena fullscreen = {true} lesson = {Addition} type = {4} script = {subitizer.init}/>} />
    <Route exact path="/hiddendots" render={()=><Arena fullscreen = {true} lesson = {Subitization} type = {6} script = {subitizer.init}/>} />
    <Route exact path="/factorwall" component={FractionList} />
    <Route exact path="/lessons" component={LessonList} />
    <Route exact path="/choicegrid" component={Interactives} />
    <Route exact path="/quickimages" component={QuickImages} />
    <Route exact path="/factoring" component={FractionList} />
    <Route exact path="/myapps/:app" component={WebLink} />
    <Route path="/activities/:activity" component={ActivityPage} />
    <Route exact path="/" component={LandingPage} />
    <Route path="/content" component={LandingPage} />
    <Route path="/quickimages/:activity" component={QuickImagePortal} />
  </Switch>
);

export default Main;
