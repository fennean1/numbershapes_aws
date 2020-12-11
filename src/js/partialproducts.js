import * as PIXI from "pixi.js-legacy";
import blueGradient from "../assets/blue-gradient.png";
import MagnifyingGlass from "../assets/MagnifyingGlass.png";
import * as CONST from "./const.js";
import {
  TweenLite,
} from "gsap";
import {ArrayModel, Axis} from "./api_kh.js";
import { blue } from "@material-ui/core/colors";


export const init = (app, setup) => {
  
const loader = PIXI.Loader.shared; // PixiJS exposes a premade instance for you to use.
const sprites = {};

// Chainable `add` to enqueue a resource
loader.add('backGround', 'https://res.cloudinary.com/duim8wwno/image/upload/v1607622190/blue-gradient_un84kq.png')

// The `load` method loads the queue of resources, and calls the passed in callback called once all
// resources have loaded.
loader.load((loader, resources) => {
    sprites.backGround = resources.backGround.texture

});



  // Layout Vars
  let window_width = setup.width
  let window_height = setup.height
  let window_frame = {width: window_width,height: window_height}


  // Should be updated any time a change is made on the screens

  let objects = {}

  let S = {
    frame: {width: setup.width,height: setup.height},
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
      },
      xState: {
        min: 0,
        max: 10,
      }
    },
    objects: objects
  }


  // Objects


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
    S.frame = newFrame
    app.renderer.resize(newFrame.width,newFrame.height)
  }

  // Loading Script
  function load() {
    if (S.backGround){
      console.log("setting up background")
      S.objects.backGround = new PIXI.Sprite()
      S.objects.backGround.width = window_frame.width
      S.objects.backGround.height = window_frame.height
      S.objects.backGround.texture = sprites.backGround
      app.stage.addChild(S.objects.backGround)
    }

    const initArrayState = {
      width: 10,
      height: 10,
      aCut: 5,
      bCut: 5,
    }

    const initAxisState = {
      frame: window_frame,
      a: 15,
      b: 15,
    }

    S.objects.axis = new Axis(app,initAxisState)
    S.objects.array = new ArrayModel(app,S.objects.axis,initArrayState)
  
    S.objects.array.setXY(-5,5)

    app.stage.addChild(S.objects.axis)
    app.stage.addChild(S.objects.array)
    
    draw(S.frame)
  }




  // Call load script
  loader.onComplete.add(load); // called once when the queued resources all load.

  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);

};


