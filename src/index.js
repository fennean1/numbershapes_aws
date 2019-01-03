import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ParallaxProvider } from "react-scroll-parallax";

import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();
