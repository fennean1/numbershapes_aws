import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import NavBar from "./NavBar";

import OldSite from "./OldSite";

import Main from "./Main";

const App = () => (
  <div>
    <Main />
  </div>
);

export default App;
