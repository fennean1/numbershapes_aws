import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Icon, Navbar, NavItem } from "react-materialize";
import { Stage, Layer, Rect, Text, Star } from "react-konva";
import Konva from "konva";

import { Switch, Route, Link } from "react-router-dom";

class NavigationBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return (
      <Navbar className="navBar" brand="NumberShapes" right>
        <Link to="/shapes">Shapes</Link>
      </Navbar>
    );
  }
}

export default NavigationBar;
