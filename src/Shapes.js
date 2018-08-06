import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Icon, Row, Col } from "react-materialize";
import { Stage, Layer, Rect, Text, Star, Circle } from "react-konva";
import InputRange from "react-input-range";
//import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import { Switch, Route } from "react-router-dom";

const Slider = require("rc-slider");
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class Shapes extends Component {
  constructor(props) {
    super(props);

    this.width = 0;
    this.height = 0;
    this.state = {
      sliderValue: 10,
      layers: []
    };
  }

  componentWillMount() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  boundsChanged(value) {
    this.setState({ upperBound: value[1] });
    this.setState({ lowerBound: value[0] });
  }

  createTempArrayForNumber(n) {}

  getRandomIndexesForNumber(number) {
    let tempArray = [];
    let randomIndexes = [];

    for (var i = 0; i < 5; i++) {
      let row = [];
      for (var j = 0; j < 5; j++) {
        tempArray.push([i, j]);
      }
    }

    console.log("This is the temp array", tempArray);

    for (i = 0; i < number; i++) {
      // Pick a random index
      let index = Math.floor(Math.random() * tempArray.length);
      // Add it to the tempArray
      randomIndexes.push(tempArray[index]);
      // Remove it from the temporary array.
      tempArray.splice(index, 1);
    }

    return randomIndexes;
  }

  randomClicked(e) {
    let rand =
      this.state.lowerBound +
      Math.floor(
        Math.random() * (this.state.upperBound - this.state.lowerBound)
      );

    let indexes = this.getRandomIndexesForNumber(rand);

    console.log("indexes", indexes);

    this.drawMyLayersAt(indexes);
  }

  drawMyLayersAt(indexes) {
    let newLayers = [];
    let ri = this.width / 80;
    let ro = this.width / 40;
    for (var i = 0; i < indexes.length; i++) {
      const scale = 1;

      console.log(indexes[i][0] * 5 * ro + 0.5 * this.width);
      console.log(indexes[i][1] * 5 * ro + 0.5 * this.height);

      let dx = 5 * (Math.random(1) - 1 / 2) * ri;
      let dy = 5 * (Math.random(1) - 1 / 2) * ri;

      newLayers.push(
        <Star
          key={i}
          x={indexes[i][0] * 6 * ro + 0.2 * this.width + dx}
          y={indexes[i][1] * 4 * ro + 0.2 * this.height + dy}
          numPoints={5}
          innerRadius={ri}
          outerRadius={ro}
          fill="#c00ffe"
          opacity={0.5}
          draggable={true}
          scale={{
            x: scale,
            y: scale
          }}
          rotation={Math.random() * 180}
          shadowColor="black"
          shadowBlur={10}
          shadowOffset={{
            x: 5,
            y: 5
          }}
          shadowOpacity={0.6}
          // custom attribute
          startScale={scale}
        />
      );
    }

    this.setState({ layers: newLayers });
  }

  render() {
    return (
      <div>
        <Stage width={this.width} height={this.height}>
          <Layer>{this.state.layers}</Layer>
        </Stage>
        <div className="container">
          <div className="col">
            <Range
              onChange={value => {
                this.boundsChanged(value);
              }}
              className="slider"
              max={25}
              step={1}
            />
            <Button
              className="goButton"
              onClick={() => {
                this.randomClicked();
              }}
            >
              Go
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Shapes;
