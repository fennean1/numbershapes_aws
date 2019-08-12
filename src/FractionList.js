import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Icon, Row, Col } from "react-materialize";
import { Stage, Layer, Rect, Text, Star, Circle } from "react-konva";
import InputRange from "react-input-range";
import Measure from "react-measure";
import "rc-slider/assets/index.css";
import Konva from "konva";
import { Switch, Route } from "react-router-dom";
import * as randCords from "./randomCoordinates"



const Slider = require("rc-slider");
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const CORAL = "#FF4848";
const BLUE = "#51D0FF";
const GREEN = "#7ADA64";
const PURPLE = "#B478FF";
const YELLOW = "#FFFD82";
const ORANGE = "#ffb84d";
const PINK = "#ff66ff";
const RED = "#ff3333";
const BROWN = "#bf8040";
const SEXY_GREEN = "#669999";
const STRONG_GREEN = "#00b359";
const STRONG_YELLOW = "#ffff00";
const BLUE_GREY = "#8585ad";

class FractionList extends Component {
  constructor(props) {
    super(props);

    this.threeColors = [ "#4079ff" , "#ff4063","#787878"]

    this.colorIndex = 0;

    this.state = {
      whole: 24,
    };
  }

  returnNBlocks(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(i);
    }

    this.colorIndex +=1
    let index = this.colorIndex%3
    let color = this.threeColors[index]

    const liStyle = { background: color,color: "#ffffff",marginTop: 5,marginLeft: 3 };

    return arr.map(e => (
      <div className="grow" style={liStyle}>
        {this.state.whole / n}
      </div>
    ));
  }

  handleChange(event) {
    this.colorIndex = 0
    this.setState({ whole: event.target.value });
  }

  renderRows(n) {
    if (isNaN(n)) {
      return null;
    } else {
      let arr = [];
      let testArr = [1, 2, 3];
      for (let i = 1; i <= n; i++) {
        arr.push(i);
      }
      return arr.map(e => (
        <div className="flexMe">
          {(this.state.whole / e) % 1 == 0 && this.returnNBlocks(e)}
        </div>
      ));
    }
  }
  render() {

    randCords.generateRandomCoordinates(10)

    return (
      <div className = "clouds">
      <div className="container">
        <input
          className="centerText"
          type="text"
          value={this.state.whole}
          onChange={this.handleChange.bind(this)}
        />
        <div className="scroller">{this.renderRows(this.state.whole)}</div>
      </div>
      </div>
    );
  }
}

export default FractionList;
