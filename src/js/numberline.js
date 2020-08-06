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
 
  function load() {
    if (setup.props.features) {
      features = setup.props.features;
    }

    let numberline = new UltimateNumberLine(-10,50,window.innerWidth,app)

    const balls = ()=>{}

    numberline.zoomTo(5,10,10,balls,balls)
    numberline.y = window.innerHeight/3

    app.stage.addChild(numberline)

  }

  // Call load script
  load();


};
