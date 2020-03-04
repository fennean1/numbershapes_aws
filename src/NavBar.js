import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { Switch, Route, Link } from "react-router-dom";

class NavigationBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return (
      <AppBar className="grey" position="static">
        <Toolbar>
          <Typography style={{ paddingRight: 40 }} variant="h6">
            <Link className="white-text" to={"/"}>
              Subitize
            </Link>
          </Typography>
          <Typography style={{ paddingRight: 40 }} variant="h6">
            <Link className="white-text" to={"/addition"}>
              Addition
            </Link>
          </Typography>
          <Typography style={{ paddingRight: 40 }} variant="h6">
            <Link className="white-text" to={"/subtraction"}>
              Subtraction
            </Link>
          </Typography>
          <Typography style={{ paddingRight: 40 }} variant="h6">
            <Link className="white-text" to={"/makingten"}>
              Make 10
            </Link>
          </Typography>
          <Typography style={{ paddingRight: 40 }} variant="h6">
            <Link className="white-text" to={"/hiddendots"}>
              Hidden Dots
            </Link>
          </Typography>
          <Typography style={{ paddingRight: 40 }} variant="h6">
            <Link className="white-text" to={"/dotsgame"}>
              Explore 8
            </Link>
          </Typography>
          <Typography style={{ paddingRight: 40 }} variant="h6">
            <Link className="white-text" to={"/fractions"}>
              Factoring
            </Link>
          </Typography>
          <Typography style={{ paddingRight: 40 }} variant="h6">
            <a
              className="white-text"
              target="_blank"
              href="http://number-shapes.com/"
            >
              Learn More
            </a>
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default NavigationBar;
