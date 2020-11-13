import * as PIXI from "pixi.js-legacy";
import blueGradient from "../assets/blue-gradient.png";
import MagnifyingGlass from "../assets/MagnifyingGlass.png";
import * as CONST from "./const.js";
import {
  TweenLite,
} from "gsap";
import {HorizontalNumberLine,AdjustableStrip,Chip,FractionStrip, Pin, MultiplicationStrip} from "./api_kh.js";

export const init = (app, setup) => {
  

  // Constants
  const BLUE_GRADIENT_TEXTURE = new PIXI.Texture.from(blueGradient)

  // Should be updated any time a change is made on the screen.
  let localState = {
    features: setup.features,
    backGround: true,
    grid: {
      width: 10,
      height: 10,
      x: 4,
      y: 5,
    },
    axis: {
      yState: {
        min: 0,
        max: 10,
        length: 100,
      },
      xState: {
        min: 0,
        max: 10,
        length: 100,
      }
    },
  }

  let localObjects = {}

  // Objects
  let axis2D = {}
  let whiskerMin = new PIXI.Graphics()
  let whiskerMax = new PIXI.Graphics()

  function backgroundPointerDown(e) {
    this.touching = true 
  }

  function backgroundPointerMove(e) {
    if (this.touching){

    } 
  }
  function backgroundPointerUp(e){
    this.touching = false
  }


  // Called on resize
  let execute;
  function resize(newFrame) {
  clearTimeout(execute);
  execute = setTimeout(()=>{
      draw(newFrame)
    },500);
  }

  function draw(newFrame){
    localState.frame = newFrame
    app.renderer.resize(newFrame.width,newFrame.height)
  }

  // Loading Script
  function load() {
    if (localState.backGround){
      localObjects.backGround = new PIXI.Graphics(BLUE_GRADIENT_TEXTURE)
    }

    if (localState.grid){
      localObjects.grid = new PIXI.Container()
    }

    if (localState.axis){
      localObjects.axis2D = new PIXI.Container()
    }
    
    draw()
  }




  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);

};


