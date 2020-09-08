import React, { Component } from "react";
import "./App.css";
import Feedback from "feeder-react-feedback"; // import Feedback component
import "feeder-react-feedback/dist/feeder-react-feedback.css"; // import stylesheet

import * as Pixi from "pixi.js";

class Arena extends Component {
  constructor() {
    super();
    this.app = {};
    this.state = {
      open: false,
    };
  }

  handleClose() {
    this.setState({ open: false });
  }

  componentWillUnmount() {
    this.app.destroy(true);
  }

  componentWillMount() {
    Pixi.settings.RESOLUTION = 2;
    this.app = new Pixi.Application(0, 0, {
      backgroundColor: 0xffffff,
      antialias: false,
    });
    this.app.renderer.backgroundColor = 0xffffff;
    this.app.renderer.resolution = 2;
    this.app.renderer.autoDensity = true;
  }

  loadInstructions() {
    this.setState({ open: true });
  }

  goHome() {
    window.location.assign("http://khtestenv.herokuapp.com");
  }

  componentDidMount() {
    this.gameCanvas.appendChild(this.app.view);

    const setup = {
      height: this.gameCanvas.clientHeight,
      width: this.gameCanvas.clientWidth,
      props: this.props,
    };

    this.app.help = () => this.loadInstructions();
    this.app.goHome = () => this.goHome();

    this.app.renderer.resize(
      this.gameCanvas.clientWidth,
      this.gameCanvas.clientHeight
    );

    this.props.script(this.app, setup);
  }

  // Need fullscreen prop
  render() {
    let styleType = this.props.fullscreen ? { height: "100vh" } : null;
    return (
      <div>
        <Feedback style = {{height: 1000}}email = {true} projectId="5f183e5515d6510004b665ea" />
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
