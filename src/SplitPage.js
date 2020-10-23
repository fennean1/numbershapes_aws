import React, { Component } from "react";
import "./App.css";
import * as shuttles from "./js/shuttles.js"
import Arena from "./Arena"

class SplitPage extends Component {
  constructor() {
    super();
    this.app = {};
    this.showManip = true
  }

  componentDidMount(){

  }

  // Need fullscreen prop
  render() {
    return (
      <div style = {{display: "flex",flexDirection: 'row'}}>
        <div className = "questionMenu">Menu</div>
        <div className = "manipContainer">
        <Arena style = {{flex: 1}} script = {shuttles.init}/>
       </div>
      </div>
    );
  }
}

export default SplitPage;
