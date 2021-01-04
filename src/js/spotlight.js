import * as PIXI from "pixi.js-legacy";
import blueGradient from "../assets/blue-gradient.png";
import MagnifyingGlass from "../assets/MagnifyingGlass.png";
import * as CONST from "./const.js";
import {
  TweenLite,
} from "gsap";
import {ArrayModel, Axis} from "./api_kh.js";


export const init = (app, setup) => {
  
const loader = PIXI.Loader.shared; // PixiJS exposes a premade instance for you to use.
const sprites = {};

// Chainable `add` to enqueue a resource

loader.add('backGround', 'https://res.cloudinary.com/duim8wwno/image/upload/v1609774858/Spotlight%20Game/SpotlightBackground_kqukoy.png')
loader.add('backGroundSvg', 'https://res.cloudinary.com/duim8wwno/image/upload/v1609773542/Spotlight%20Game/SpotlightBackground_uitjdt.svg')

// The `load` method loads the queue of resources, and calls the passed in callback called once all
// resources have loaded.
loader.load((loader, resources) => {
    sprites.backGround = resources.backGround.texture
    sprites.backGroundSvg = resources.backGroundSvg.texture

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
    S.objects.backGround.width = newFrame.width
    S.objects.backGround.height = newFrame.height
  }

  // Loading Script
  function load() {

     let svg = PIXI.Texture.from('https://res.cloudinary.com/duim8wwno/image/upload/v1609773542/Spotlight%20Game/SpotlightBackground_uitjdt.svg', true, 0, 2);

      S.objects.backGround = new PIXI.Sprite()
      S.objects.backGround.texture = svg
      S.objects.backGround.width = window_frame.width
      S.objects.backGround.height = window_frame.height
      app.stage.addChild(S.objects.backGround)

    //draw(S.frame)
  }




  // Call load script
  loader.onComplete.add(load); // called once when the queued resources all load.

  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);

};


