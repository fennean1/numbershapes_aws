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
    console.log("Destroying all")
    //this.app.destroyAll()
    console.log("this.app.destroy",this.app.destroy)
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

  componentDidMount() {
    this.gameCanvas.appendChild(this.app.view);

    const setup = {
      height: this.gameCanvas.clientHeight,
      width: this.gameCanvas.clientWidth,
      props: this.props
    };

    this.app.help = () => this.loadInstructions()
    this.app.goToApps = () => {window.location.href = 'https://apps.apple.com/au/app/numbershapes-whiteboard/id1052209727'}

    this.app.renderer.resize(this.gameCanvas.clientWidth,this.gameCanvas.clientHeight)

    this.props.script(this.app, setup);

    window.onresize = () => {
      const setup = {
        height: this.gameCanvas.clientHeight,
        width: this.gameCanvas.clientWidth,
        props: this.props
      };
      this.app.renderer.resize(this.gameCanvas.clientWidth,this.gameCanvas.clientHeight)
      this.props.script(this.app, setup);
    }
   
  }

  // Need fullscreen prop

  render() {

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

   let worksheet = 'https://drive.google.com/file/d/0B8L_uJ1iQlGJTFYxNzF1SkxsMlk/view'
   //this.props.lesson.worksheet


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
          <a className = "black-text" href={worksheet}>Workbook</a>
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
