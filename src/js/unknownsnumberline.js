import * as PIXI from "pixi.js";
import blueGradient from "../assets/Clouds.png";
import spaceGround from "../assets/SpaceGround.png";
import spaceShipWindow from "../assets/SpaceShipWindow.png";
import nightBackground from "../assets/NightBackground.png";
import pinkPin from "../assets/PinkPin.png";
import Dice from "../assets/Dice.png";
import greyPin from "../assets/Pin.png";
import * as CONST from "./const.js";
import {Draggable,HorizontalNumberLine,BlockRow} from "./api_kh.js";
import { fabric } from "fabric";
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

  const WINDOW_WIDTH = setup.width
  const WINDOW_HEIGHT = setup.height


  // Objects
  let numberline;
  let sliderA;
  let sliderB;
  let generatorA;
  let generatorB;
  let blockA;
  let blockB;
  let blockRowA;
  let backGround;

  //CONST 

  const BLUE_PIN_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.BLUE_DIAMOND_PIN)


  function sliderAPointerDown(){

  }

  function sliderAPointerMove(){
    if (this.touching){
      let zero = numberline.getNumberLinePositionFromFloatValue(0)
      let w = this.x - zero
      let n = Math.round(w/blockRowA.blockWidth)
      blockRowA.draw(n)
    }
  }

  function sliderAPointerUp(){
    let zero = numberline.getNumberLinePositionFromFloatValue(0)
    this.x = blockRowA.blockWidth*blockRowA.n + zero
    blockRowA.value = numberline.getNumberLineFloatValueFromPosition(zero+blockRowA.blockWidth*blockRowA.n)
    sliderA.x = zero+blockRowA.blockWidth*blockRowA.n
    blockRowA.resize()
  }


  function sliderBPointerDown(){

  }

  function sliderBPointerMove(){

    if (this.touching){
      let zero = numberline.getNumberLinePositionFromFloatValue(0)
      let w = this.x - zero
      blockRowA.draw(blockRowA.n,w)
      sliderA.x = blockRowA.blockWidth*blockRowA.n + zero
    }

  }

  function sliderBPointerUp(){
    let zero = numberline.getNumberLinePositionFromFloatValue(0)
    let roundedPosition = numberline.roundPositionToNearestTick(this.x)
    let blockVal = numberline.getNumberLineFloatValueFromPosition(roundedPosition)
    let blockWidth = roundedPosition - zero
    blockRowA.value = blockVal*blockRowA.n
    blockRowA.draw(blockRowA.n,blockWidth)

    this.x = roundedPosition
    console.log("blockwidth",)
    sliderA.x = zero + blockWidth*blockRowA.n
    
  }


  function backgroundPointerDown(e) {
    this.touching = true 
    this.anchorPoint = e.data.global.x;
    this.initialNumberlineMin = numberline.minFloat;
    this.initialNumberlineMax = numberline.maxFloat;
  }

  function backgroundPointerMove(e) {
    if (this.touching){
      let x = e.data.global.x;
      let x1 = numberline.getNumberLineFloatValueFromPosition(x);
      let x2 = numberline.getNumberLineFloatValueFromPosition(
        this.anchorPoint
      );
      let delta = x2 - x1;
      let _min = this.initialNumberlineMin + delta;
      let _max = this.initialNumberlineMax + delta;
      numberline.draw(_min, _max);

      let zero = numberline.getNumberLinePositionFromFloatValue(0)
      blockRowA.x = zero
      sliderA.x = zero + blockRowA.blockWidth*blockRowA.n
      sliderB.x = zero + blockRowA.blockWidth
    } 
  }

  function backgroundPointerUp(e){
    this.touching = false
  }


  // Called on resize
  function resize(newFrame) {
    // Make sure all layout parameters are up to date.
    updateLayoutParams(newFrame);
    app.renderer.resize(WINDOW_WIDTH, WINDOW_HEIGHT);
  }


  function updateLayoutParams(newFrame) {
    let frame;
    if (newFrame) {
      frame = newFrame;
    } else {
      frame = { width: WINDOW_WIDTH, height: WINDOW_HEIGHT };
    }
  }

  // Loading Script
  function load() {
    if (setup.props.features) {
      features = setup.props.features;
    }

    backGround = new PIXI.Sprite.from(blueGradient)
    backGround.interactive = true
    backGround.width = WINDOW_WIDTH
    backGround.height = WINDOW_HEIGHT
    backGround.on('pointerdown',backgroundPointerDown)
    backGround.on('pointermove',backgroundPointerMove)
    backGround.on('pointerup',backgroundPointerUp)
    backGround.on('pointerupoutside',backgroundPointerUp)
    app.stage.addChild(backGround)


    numberline = new HorizontalNumberLine(-6,50,WINDOW_WIDTH,app)
    numberline.setBoundaries(-100000,100000,1)
    numberline.draw(-6,50)
    numberline.y = WINDOW_HEIGHT/2

    let initialBlockWidth = numberline.majorDX

    blockRowA = new BlockRow(1,initialBlockWidth,WINDOW_HEIGHT/20,app)
    blockRowA.y = numberline.y - blockRowA._height
    blockRowA.value = numberline.majorStep
    blockRowA.x = numberline.getNumberLinePositionFromFloatValue(0)

    sliderA = new Draggable(BLUE_PIN_TEXTURE)
    sliderB = new Draggable(BLUE_PIN_TEXTURE)

    sliderB.anchor.set(0.5,1)
    sliderB.lockY = true
    sliderB.angle = 180
    sliderB.x = blockRowA.x + blockRowA.width
    sliderB.y = numberline.y
    sliderB.on('pointerdown',sliderBPointerDown)
    sliderB.on('pointermove',sliderBPointerMove)
    sliderB.on('pointerup',sliderBPointerUp)
    sliderB.on('pointerupoutside',sliderBPointerUp)


    sliderA.anchor.set(0.5,1)
    sliderA.lockY = true
    sliderA.angle = 180
    sliderA.x = blockRowA.x + blockRowA.width
    sliderA.y = numberline.y
    sliderA.on('pointerdown',sliderAPointerDown)
    sliderA.on('pointermove',sliderAPointerMove)
    sliderA.on('pointerup',sliderAPointerUp)
    sliderA.on('pointerupoutside',sliderAPointerUp)

    app.stage.addChild(numberline)
    app.stage.addChild(sliderB)
    app.stage.addChild(sliderA)
    app.stage.addChild(blockRowA)


    numberline.onUpdate = () => {
      let zeroDistance = numberline.getDistanceFromZeroFromValue(blockRowA.value)
      let blockEndPoint = numberline.getNumberLinePositionFromFloatValue(blockRowA.value)
      let zeroX = numberline.getNumberLinePositionFromFloatValue(0)
      sliderA.x = blockEndPoint
      blockRowA.resize(zeroDistance/blockRowA.n)
      sliderB.x = zeroX + zeroDistance/blockRowA.n
    } 

    numberline.onUpdateComplete = () => {
      console.log("block row value",blockRowA.value)
      let blockEndPoint = numberline.getNumberLinePositionFromFloatValue(blockRowA.value)
      let zeroX = numberline.getNumberLinePositionFromFloatValue(0)
      let width = blockEndPoint - zeroX
      console.log("width",width)
      blockRowA.draw(blockRowA.n,width/blockRowA.n)
      blockRowA.width = Math.abs(width)
    } 
  
  
  }

  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);

};
