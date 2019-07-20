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

class OldSite extends Component {
  constructor(props) {
    super(props);

    this.colors = [
      BLUE,
      GREEN,
      PURPLE,
      YELLOW,
      ORANGE,
      PINK,
      RED,
      BLUE_GREY,
      SEXY_GREEN,
      STRONG_GREEN,
      STRONG_YELLOW,
      BROWN
    ];
    this.colorIndex = 0;

    this.state = {
      whole: 24
    };
  }

  returnNBlocks(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(i);
    }

    let color = n > this.colors.length ? BLUE_GREY : this.colors[n - 1];

    const liStyle = { background: color, margin: 2 };

    return arr.map(e => (
      <div className="grow" style={liStyle}>
        {this.state.whole / n}
      </div>
    ));
  }

  handleChange(event) {
    this.setState({ whole: event.target.value });
  }

  renderRows(n) {
    if (isNaN(n)) {
      return null;
    } else {
      let arr = [];
      let testArr = [1, 2, 3];
      for (let i = 0; i < n; i++) {
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
    return (
      <iframe
        src="http://number-shapes.com/"
        width={window.innerWidth}
        height={window.innerHeight}
        flexDirection="column"
        frameborder="0"
      />
    );
  }
}

export default OldSite;
