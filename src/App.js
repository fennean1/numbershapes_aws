import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import NavBar from "./NavBar";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min";

import Main from "./Main";

const App = () => (
  <div>
    <NavBar />
    <Main />
  </div>
);

export default App;
