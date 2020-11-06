import React, { Component } from "react";
import "./App.css";

import * as PIXI from "pixi.js-legacy";

class Arena extends Component {
  constructor() {
    super();
    this.app = {};
    this.state = {
      open: false,
    };
  }


  componentWillUnmount() {
    this.app.destroy(true);
  }

  componentWillMount() {
    console.log("UPDATED")
    PIXI.settings.RESOLUTION = 2;
    this.app = new PIXI.Application({forceCanvas: true});
    this.app.renderer.backgroundColor = 0xffffff;
    this.app.renderer.resolution = 2;
    this.app.renderer.autoDensity = true;
  }

  loadInstructions() {
    this.setState({ open: true });
  }

  resize(){
    this.app.resize({width: this.gameCanvas.clientWidth,height: this.gameCanvas.clientHeight})
  }

  componentDidMount() {
    this.gameCanvas.appendChild(this.app.view);

    const setup = {
      height: this.gameCanvas.clientHeight,
      width: this.gameCanvas.clientWidth,
      props: this.props,
    };

    this.app.renderer.resize(
      this.gameCanvas.clientWidth,
      this.gameCanvas.clientHeight
    );

    this.props.script(this.app, setup);


    window.addEventListener('resize',()=>this.resize())
  }

  // Need fullscreen prop
  render() {
    let styleType = this.props.fullscreen ? { height: "100vh"} : null;
    return (
      <div>
        <div
          style={styleType}
          ref={(me) => {
            this.gameCanvas = me;
          }}
        />
      </div>
    );
  }
}

export default Arena;
