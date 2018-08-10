import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Icon, Row, Col } from "react-materialize";
import { Stage, Layer, Rect, Text, Star, Circle } from "react-konva";
import InputRange from "react-input-range";
import Measure from "react-measure";
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
    this.dimensions = {};
    this.randomNumber = 0;

    this.state = {
      sliderValue: 10,
      layers: [],
      upperBound: 15,
      lowerBound: 5,
      randomNumber: 0
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

  componentDidMount() {
    console.log("Dimensions", this.dimensions);
  }

  randomClicked(e) {
    console.log("Dimensions", this.dimensions);

    let rand =
      this.state.lowerBound +
      Math.floor(
        Math.random() * (this.state.upperBound - this.state.lowerBound)
      );

    this.setState({ randomNumber: rand });

    let indexes = this.getRandomIndexesForNumber(rand);

    console.log("indexes", indexes);

    this.drawMyLayersAt(indexes);
  }

  drawMyLayersAt(indexes) {
    const { top, right, bottom, left, width, height } = this.dimensions;

    let newLayers = [];
    let ri = width / 60;
    let dh = height / 8;
    let dw = width / 5;
    let ro = width / 30;
    for (var i = 0; i < indexes.length; i++) {
      const scale = 1;

      let dx = 3 * (Math.random(1) - 1 / 2) * ri;
      let dy = (Math.random(1) - 1 / 2) * ri;

      newLayers.push(
        <Star
          key={i}
          x={indexes[i][0] * dw + 0.1 * width + dx}
          y={indexes[i][1] * dh + 0.15 * height + dy}
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
      <Measure
        bounds
        onResize={contentRect => {
          console.log("content rect bounds", contentRect.bounds);
          this.dimensions = contentRect.bounds;
        }}
      >
        {({ measureRef }) => (
          <div>
            <div className="container ">
              <div className="col">
                <Range
                  onChange={value => {
                    this.boundsChanged(value);
                  }}
                  className="slider"
                  max={25}
                  step={1}
                  defaultValue={[5, 15]}
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
            <div ref={measureRef}>
              <Stage width={this.width} height={this.height}>
                <Layer>{this.state.layers}</Layer>
              </Stage>
            </div>
          </div>
        )}
      </Measure>
    );
  }
}

export default Shapes;
