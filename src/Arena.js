import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
//import * as Test from "./js/wallscript.js";
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';

import * as Pixi from "pixi.js";

class Arena extends Component {
  constructor() {
    super();
    this.app = {};
    this.state = {
      open: false,
    }
  }

 handleClose() {
  this.setState({open: false})
  };


  componentWillUnmount(){
    this.app.destroy(true)
  }

  componentWillMount() {
    Pixi.settings.RESOLUTION = 2
    this.app = new Pixi.Application(0,0,{backgroundColor: 0xffffff,antialias: false});
    this.app.renderer.backgroundColor = 0xffffff
    this.app.renderer.resolution = 2
    this.app.renderer.autoDensity = true
  }

  loadInstructions(){
    this.setState({open: true})
  }

  goHome(){
    window.location.assign("http://www.numbershapes.com")
  }

  componentDidMount() {
    this.gameCanvas.appendChild(this.app.view);

    const setup = {
      height: this.gameCanvas.clientHeight,
      width: this.gameCanvas.clientWidth,
      props: this.props
    };

    this.app.help = () => this.loadInstructions()
    this.app.goHome = ()=> this.goHome()

    this.app.renderer.resize(this.gameCanvas.clientWidth,this.gameCanvas.clientHeight)

    this.props.script(this.app, setup);
   
  }

  // Need fullscreen prop
  render() {
    let styleType = this.props.fullscreen ? { height: "100vh" } : null;
    return (
      <div style = {styleType}
        ref={me => {
          this.gameCanvas = me;
        }}
      />
    );
  }
}

export default Arena;
