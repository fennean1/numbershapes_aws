import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
//import * as Test from "./js/wallscript.js";
import NavigationBar from "./NavBar";
import { Button, Icon, Navbar, NavItem } from "react-materialize";

import * as Pixi from "pixi.js";

class Arena extends Component {
  constructor() {
    super();
    this.app = {};
  }

  componentWillUnmount(){
    console.log("Destroying all")
    //this.app.destroyAll()
    console.log("this.app.destroy",this.app.destroy)
    this.app.destroy(true)
  }

  componentWillMount() {
    Pixi.settings.RESOLUTION = 3
    this.app = new Pixi.Application(0,0,{backgroundColor: 0xffffff,antialias: true});
    //this.app.stage.backgroundColor = 0xfffffff
    this.app.renderer.backgroundColor = 0xffffff;
    this.app.renderer.resolution = 3
    this.app.renderer.autoDensity = true
  }

  componentDidMount() {
    this.gameCanvas.appendChild(this.app.view);

    const setup = {
      height: this.gameCanvas.clientHeight,
      width: this.gameCanvas.clientWidth,
      props: this.props
    };

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
      <div style = {styleType}
        ref={me => {
          this.gameCanvas = me;
        }}
      />
    );
  }
}

export default Arena;
