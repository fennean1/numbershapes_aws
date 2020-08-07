import * as PIXI from "pixi.js";
import blueGradient from "../assets/Clouds.png";
import spaceGround from "../assets/SpaceGround.png";
import spaceShipWindow from "../assets/SpaceShipWindow.png";
import nightBackground from "../assets/NightBackground.png";
import {BLUE,RED,GREEN,ORANGE,PURPLE,PINK,NUMERAL,BALLS,BUTTONS} from "../AssetManager.js"
import * as CONST from "./const.js";
import { Fraction, Draggable, distance, FractionFrame, UltimateNumberLine } from "./api.js";
import {
  TweenMax,
  TimelineLite,
  Power2,
  Elastic,
  CSSPlugin,
  TweenLite,
  TimelineMax,
  Power4,
} from "gsap";

export const init = (app, setup) => {

  let features;
  let numberline;

  function onNumberLineDown(e){
    this.touching = true
    let x = e.data.getLocalPosition(this).x
    this.anchor = this.getNumberLineFloatValueFromPosition(x)
  }

  function onNumberLineUp(){
    this.touching = false
  }
 
  function onNumberLineMove(e){
    if (this.touching){
      let x = e.data.getLocalPosition(this).x
      let max = this.getNumberLineMaxFromAnchor(this.anchor,x)
      numberline.draw(0,max)
    }

  }
 
 
  function load() {
    if (setup.props.features) {
      features = setup.props.features;
    }

    numberline = new UltimateNumberLine(-10,50,window.innerWidth*0.8,app)
    numberline.draw(-5,50)
    numberline.x = 100
    numberline.interactive = true
    numberline.hitArea = new PIXI.Rectangle(0, 0, numberline.width, numberline.height);
 

    numberline.y = window.innerHeight/3

    app.stage.addChild(numberline)

    numberline.on('pointerdown',onNumberLineDown)
    numberline.on('pointerup',onNumberLineUp)
    numberline.on('pointerupoutside',onNumberLineUp)
    numberline.on('pointermove',onNumberLineMove)
  
  



  }

  // Call load script
  load();


};
