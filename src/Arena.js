import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
//import * as Test from "./js/wallscript.js";
import NavigationBar from "./NavBar";
import { Button, Icon, Navbar, NavItem } from "react-materialize";
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

  handleOpen() {
    this.setState({open: true})
  };

  componentWillUnmount(){
    console.log("Destroying all")
    //this.app.destroyAll()
    console.log("this.app.destroy",this.app.destroy)
    this.app.destroy(true)
  }

  componentWillMount() {
    Pixi.settings.RESOLUTION = 3
    this.app = new Pixi.Application(0,0,{backgroundColor: 0xffffff,antialias: true});
    this.app.renderer.backgroundColor = 0xffffff;
    this.app.renderer.resolution = 3
    this.app.renderer.autoDensity = true
  }

  loadInstructions(){
    console.log("I'm trying to help")
    this.setState({open: true})
  }

  componentDidMount() {
    this.gameCanvas.appendChild(this.app.view);

    const setup = {
      height: this.gameCanvas.clientHeight,
      width: this.gameCanvas.clientWidth,
      props: this.props
    };

    this.app.help = () => this.loadInstructions()

    this.app.renderer.resize(this.gameCanvas.clientWidth,this.gameCanvas.clientHeight)

    this.props.script(this.app, setup);
   
  }

  // Need fullscreen prop

  render() {
    console.log("Render Called");

    /*
    if (this.props.show == true) {
      console.log("Animating alpha");
      window.createjs.Tween.get(this.app.stage).to(
        {
          alpha: 1
        },
        500,
        window.createjs.Ease.getPowInOut(4)
      );
    } else {
      window.createjs.Tween.get(this.app.stage).to(
        {
          alpha: 0
        },
        500,
        window.createjs.Ease.getPowInOut(4)
      );
    }
    */

    let styleType = this.props.fullscreen ? { height: "100vh" } : null;
    return (
      <div>
      <Drawer anchor="bottom" open={this.state.open} onClose={this.handleClose.bind(this)}>
      <div className ="card">
        <div className ="card-content">
          <span className ="card-title">Getting Started</span>
          <p>{this.props.lesson.coreSkillDescription}</p>
        </div>
        <div className="card-action">
          <a className = "black-text" href={this.props.lesson.worksheet}>Worksheet</a>
        </div>
  </div>
         
      </Drawer>
      <div style = {styleType}
        ref={me => {
          this.gameCanvas = me;
        }}
      />
      </div>
    );
  }
}

export default Arena;
