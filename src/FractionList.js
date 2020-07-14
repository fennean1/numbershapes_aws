import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "rc-slider/assets/index.css";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import RecordVoiceOver from "@material-ui/icons/Home";


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

    this.threeColors = ["#4079ff", "#ff4063", "#787878"];

    this.colorIndex = 0;

    this.liStyle = {
      background: "#4079ff",
      color: "#ffffff",
      margin: 1,
    };

    this.state = {
      whole: 24,
    };
  }

  returnNBlocks(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(i);
    }

    return arr.map((e) => (
      <div className="grow" style={this.liStyle}>
        <p style = {{fontSize: 20, fontFamily: "Chalkboard SE"}}>{this.state.whole / n}</p>
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
      for (let i = 2; i <= n; i++) {
        arr.push(i);
      }
      return arr.map(e => {
        let valid = this.state.whole / e % 1 == 0 &&  e < 51 
        return <div className="flexMe">
          {valid && this.returnNBlocks(e)}
        </div>
        }
      );
    }
  }
  render() {
    return (
      <div className="clouds">
        <Fab
          style={{ position: "absolute", top: 20, left: 20 }}
          onClick={() => this.props.history.push('/content/games')}
          color="secondary"
          aria-label="add"
        >
          <RecordVoiceOver />
        </Fab>
        <div className="container" style = {{padding: 20,flexDirection: 'column',display: 'flex',alignContent: 'center'}}>
            <div className = "flexMe" style = {this.liStyle}>
                <input
                  style = {{fontFamily: "Chalkboard SE",fontSize: 20, textAlign: 'center',flex: 1,display: "flex",margin: 20}}
                  value={this.state.whole}
                  onChange={this.handleChange.bind(this)}
              />
            </div>
          <div className="scroller" style = {{flex: 1}}>{this.renderRows(this.state.whole)}</div>
        </div>
      </div>
    );
  }
}

export default FractionList;
