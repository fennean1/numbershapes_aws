import * as PIXI from "pixi.js";
import blueGradient from "../assets/Clouds.png";
import spaceGround from "../assets/SpaceGround.png";
import spaceShipWindow from "../assets/SpaceShipWindow.png";
import nightBackground from "../assets/NightBackground.png";
import pinkPin from "../assets/PinkPin.png";
import Dice from "../assets/Dice.png";
import greyPin from "../assets/Pin.png";
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
import { Tween } from "jquery";

export const init = (app, setup) => {
  let features;
  let viewPort = new PIXI.Container();
  let backGround;
  let homeButton;
  let diceButton;
  let ground;
  let ultimateNumberLine;
  let pins = []
  let textBoxes = []
  let lineDown = new PIXI.Graphics()

  const NL_COLOR = 0x000000;
  const MOVER_DOT = new PIXI.Texture.from(CONST.ASSETS.MOVER_DOT);
  const SPACE_SHIP_WINDOW = new PIXI.Texture.from(spaceShipWindow);
  const PIN_TEXTURE_2 = new PIXI.Texture.from(CONST.ASSETS.BLUE_SPACE_SHIP);
  const PIN_TEXTURE = new PIXI.Texture.from(pinkPin);
  const BLUE_CIRCLE = new PIXI.Texture.from(CONST.ASSETS.STAR);
  const SHARP_PIN_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.SHARP_PIN);
  const GREY_PIN_TEXTURE = new PIXI.Texture.from(greyPin)
  const DICE = new PIXI.Texture.from(Dice)

  // Layout Parameters
  let WINDOW_WIDTH = setup.width;
  let WINDOW_HEIGHT = setup.height;
  let HOME_BUTTON_WIDTH = WINDOW_WIDTH/15
  let DRAGGER_WIDTH = WINDOW_WIDTH/10
  let H_W_RATIO = setup.height / setup.width;
  let LANDSCAPE = H_W_RATIO < 3 / 4;
  let ARENA_WIDTH = LANDSCAPE ? (4 / 3) * setup.height : setup.width;
  let ARENA_HEIGHT = LANDSCAPE ? setup.height : (3 / 4) * setup.width;
  let NUMBER_LINE_WIDTH = WINDOW_WIDTH;
  let NUMBER_LINE_RANGE = 100;
  let NUMBER_LINE_X = WINDOW_WIDTH / 2 - NUMBER_LINE_WIDTH / 2;
  let NUMBER_LINE_Y = (5 / 8) * WINDOW_HEIGHT;
  let DRAGGER_Y = NUMBER_LINE_Y

  let focalPoint = { x: 0, y: 0 };
  let anchorAngle = 0;
  let angle = Math.PI;

  backGround = new makeBackground();
  ground = new makeGround();

  let numberline;
  let emitters = [];
  let emitters2 = [];

  // Called on resize
  function resize(newFrame, flex) {
    // Make sure all layout parameters are up to date.
    updateLayoutParams(newFrame);
    app.renderer.resize(WINDOW_WIDTH, WINDOW_HEIGHT);
  }

  let sliderLine = new PIXI.Graphics();
  sliderLine.lineStyle(NUMBER_LINE_WIDTH / 300, 0xdbdbdb);
  sliderLine.lineTo(1.1 * NUMBER_LINE_WIDTH, 0);
  sliderLine.x = WINDOW_WIDTH / 2 - (1.1 * NUMBER_LINE_WIDTH) / 2;
  sliderLine.y = DRAGGER_Y
  //app.stage.addChild(sliderLine);

  let dragger = new Draggable(PIN_TEXTURE);
  dragger.lockY = true;
  dragger.anchor.x = 0.5
  dragger.interactive = true;
  dragger.val = 0
  dragger.anchorPoint = dragger.x
  dragger.y = WINDOW_HEIGHT- dragger.height
  dragger.x = WINDOW_WIDTH/2
  app.stage.addChild(dragger);

  let draggerMin = new Draggable(PIN_TEXTURE_2);
  draggerMin.interactive = true;
  draggerMin.lockY = true;
  draggerMin.anchor.set(0.5);
  draggerMin.width = DRAGGER_WIDTH
  draggerMin.height = DRAGGER_WIDTH*2.5
  draggerMin.x = NUMBER_LINE_X + 4*NUMBER_LINE_WIDTH / 9;
  draggerMin.anchorPoint = draggerMin.x
  draggerMin.y = DRAGGER_Y - dragger.height/2
  //app.stage.addChild(draggerMin);

  let draggerCenter = new Draggable(SHARP_PIN_TEXTURE);
  draggerCenter.interactive = true;
  draggerCenter.lockY = true;
  draggerCenter.anchor.set(0.5,0);
  draggerCenter.height = ground.sprite.height/2
  draggerCenter.width = ground.sprite.height/2
  draggerCenter.x = WINDOW_WIDTH/2
  draggerCenter.anchorPoint = draggerCenter.x
  draggerCenter.y = 1.10*NUMBER_LINE_Y
  //app.stage.addChild(draggerMin);


  dragger.on("pointermove", draggerPointerMove);
  dragger.on("pointerdown", draggerPointerDown);
  dragger.on("pointerup", draggerPointerUp);
  dragger.on("pointerupoutside", draggerPointerUp);

  backGround.sprite.on("pointermove", draggerCenterPointerMove);
  backGround.sprite.on("pointerdown", draggerCenterPointerDown);
  backGround.sprite.on("pointerup", draggerCenterPointerUp);
  backGround.sprite.on("pointerupoutside", draggerCenterPointerUp);



  function draggerCenterPointerMove(e){
    if (this.touching){
      let x = e.data.global.x
      let x1 = ultimateNumberLine.getNumberLineFloatValueFromPosition(x)
      let x2 = ultimateNumberLine.getNumberLineFloatValueFromPosition(this.anchorPoint)
      let delta = x2-x1
      let _min = this.initialNumberlineMin + delta
      let _max = this.initialNumberlineMax + delta
      ultimateNumberLine.draw(_min,_max)
      dragger.x = ultimateNumberLine.getNumberLinePositionFromFloatValue(dragger.val)
      pins.forEach(p=>{
        p.x = ultimateNumberLine.getNumberLinePositionFromFloatValue(p.value)
      })
    }
  }

  function drawLine(){
    if(this.touching){
      app.stage.addChild(lineDown)
      lineDown.clear()
      lineDown.lineStyle(ultimateNumberLine.lineThickness,0x000000)
      lineDown.moveTo(this.x,this.y+this.height/2)
      if (this.y > ultimateNumberLine.y){
        lineDown.moveTo(this.x,this.y-this.height/2)
      }
      lineDown.lineTo(this.x,ultimateNumberLine.y)
    }
  }


  function checkAnswer(){
      let roundedX = ultimateNumberLine.roundPositionToNearestTick(this.x)
      let xFloatVal = ultimateNumberLine.getNumberLineFloatValueFromPosition(this.x)
      let roundedXValue = ultimateNumberLine.roundValueToNearestTick(xFloatVal)
      let diff = Math.abs(this.text - roundedXValue)
      const onUpdate = ()=> {
        lineDown.clear()
        lineDown.lineStyle(ultimateNumberLine.lineThickness,0x000000)
        lineDown.moveTo(this.x,this.y+this.height/2)
        lineDown.lineTo(this.x,ultimateNumberLine.y)
      }
      const onComplete = ()=> {
        lineDown.clear()
        TweenLite.to(this,{duration:0.5,alpha: 0})
      }
      if (diff < 0.000000001){
        lineDown.clear()
        let ratio = this.width/this.height
        let newHeight = ultimateNumberLine.digitHeight*1.2
        TweenLite.to(this,{onComplete: onComplete,onUpdate: onUpdate,duration: 1,y: ultimateNumberLine.y-this.height,x: roundedX,height: newHeight,width: newHeight*ratio})
      }
  }

  function draggerCenterPointerDown(e){
    this.touching = true
    this.anchorPoint = e.data.global.x
    this.initialNumberlineMin = ultimateNumberLine.minFloat
    this.initialNumberlineMax = ultimateNumberLine.maxFloat
  }

  function draggerCenterPointerUp(e){
    this.touching = false
  }

  // D_POINTER_MOVE
  function draggerPointerMove() {


  }

  function draggerPointerDown() {

  }

  function draggerPointerUp(e) {
    let roundedX =ultimateNumberLine.roundPositionToNearestTick(this.x)
    ultimateNumberLine.flexPoint = ultimateNumberLine.getNumberLineFloatValueFromPosition(roundedX)
    this.val = ultimateNumberLine.getNumberLineFloatValueFromPosition(roundedX)
    this.x = roundedX
  }

  class DraggableText extends PIXI.Text {
    constructor(){
      super()
      this.anchor.set(0.5)
      this.style.fontFamily = "Chalkboard SE";
      this.on('pointerdown',this.pointerDown)
      this.on('pointermove',this.pointerMove)
      this.on('pointerup',this.pointerUp)
    }

    pointerDown(event){
      this.touching = true
      this.dragged = false
      this.deltaTouch = {
        x: this.x - event.data.global.x,
        y: this.y - event.data.global.y
      }
    }
  
    pointerMove(event){
      if (this.touching){
          this.x = event.data.global.x + this.deltaTouch.x
          this.y = event.data.global.y + this.deltaTouch.y
          this.dragged = true
      }
    }
  
    pointerUp(event){
      this.touching = false
    }
    
    pointerUpOutside(event){
      this.touching = false
    }
  }

  function rollDice(){
    let v = ultimateNumberLine.getRandomValueFromRange()
    lineDown.clear()
    textBoxes.forEach(t=>{
      t.destroy(true)
    })
    textBoxes = []
    createTextBoxes(5)
  }


  function createTextBoxes(n){
    let width = 0
    let maxWidth = 0
    for (let i=0;i<n;i++){
      let d = new DraggableText()
      d.style.height = 20
      d.text = ultimateNumberLine.getRandomValueFromRange()
      d.interactive = true 
      width = width + 1.5*d.width
      d.y = -d.height
      d.x = i*1.1*d.width
      d.on('pointermove',drawLine)
      d.on('pointerup',checkAnswer)
      app.stage.addChild(d)
      textBoxes.push(d)
      if (d.width > maxWidth){
        maxWidth = d.width
      }
    }
    let x = WINDOW_WIDTH/2 - width/2 
    textBoxes.forEach((t,i)=>{
      t.x = x
      x = x + maxWidth*1.5
      TweenLite.to(t,{y: 1/4*WINDOW_HEIGHT})
    })
  }

  // Constructors
  function makeBackground() {
    // Setup Background
    let backGroundGraphics = new PIXI.Graphics()
    this.sprite = new PIXI.Sprite.from(blueGradient)
    this.sprite.width = WINDOW_WIDTH;
    this.sprite.height = WINDOW_HEIGHT;
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.interactive = true;

    app.stage.addChild(this.sprite);

    this.draw = () => {
      this.sprite.width = WINDOW_WIDTH;
      this.sprite.height = WINDOW_HEIGHT;
    };
  }


    // Constructors
    function makeGround() {
      // Setup Background
      this.sprite = new PIXI.Sprite.from(spaceGround);
      this.sprite.width = WINDOW_WIDTH;
      this.sprite.height = WINDOW_HEIGHT/4;
      this.sprite.x = 0;
      this.sprite.y = WINDOW_HEIGHT  - this.sprite.height
      this.sprite.interactive = true;
  
      //app.stage.addChild(this.sprite);
  
      this.draw = () => {
        this.sprite.width = WINDOW_WIDTH;
        this.sprite.height = WINDOW_HEIGHT;
      };
    }

  function updateLayoutParams(newFrame) {
    let frame;
    if (newFrame) {
      frame = newFrame;
    } else {
      frame = { width: WINDOW_WIDTH, height: WINDOW_HEIGHT };
    }
    WINDOW_WIDTH = frame.width;
    WINDOW_HEIGHT = frame.height;
    H_W_RATIO = frame.height / frame.width;
    LANDSCAPE = H_W_RATIO < 3 / 4;
    ARENA_WIDTH = LANDSCAPE ? (4 / 3) * frame.height : frame.width;
    ARENA_HEIGHT = LANDSCAPE ? frame.height : (3 / 4) * frame.width;
  }

  function numberlinePointerDown(e){

  }

  function numberlinePointerMove(e){

  }

  function numberlinePointerUp(e){
   
  }


  // Loading Script
  function load() {
    if (setup.props.features) {
      features = setup.props.features;
    }

    app.stage.interactive = true

    ultimateNumberLine = new UltimateNumberLine(-20,20,NUMBER_LINE_WIDTH,app)
    ultimateNumberLine.setBoundaries(-100000,100000,0.005)
    ultimateNumberLine.x = 0
    ultimateNumberLine.y = NUMBER_LINE_Y
    app.stage.addChild(ultimateNumberLine)
    ultimateNumberLine.hitArea = new PIXI.Rectangle(0,0,WINDOW_WIDTH,WINDOW_HEIGHT-NUMBER_LINE_Y)
    ultimateNumberLine.on('pointerdown',numberlinePointerDown)
    ultimateNumberLine.on('pointermove',numberlinePointerMove)
    ultimateNumberLine.on('pointerup',numberlinePointerUp)

    let atanThis = focalPoint.y / (WINDOW_WIDTH - focalPoint.x);
    anchorAngle = Math.atan(atanThis);

    homeButton = new PIXI.Sprite.from(BUTTONS.HOME)
    homeButton.width = HOME_BUTTON_WIDTH
    homeButton.height = HOME_BUTTON_WIDTH
    homeButton.x = HOME_BUTTON_WIDTH/4
    homeButton.y = HOME_BUTTON_WIDTH/4
    homeButton.interactive = true
    homeButton.on('pointerdown',()=>app.goHome())
    app.stage.addChild(homeButton)

    diceButton = new PIXI.Sprite.from(Dice)
    diceButton.width = HOME_BUTTON_WIDTH
    diceButton.height = HOME_BUTTON_WIDTH
    diceButton.x = WINDOW_WIDTH - HOME_BUTTON_WIDTH*5/4
    diceButton.y = HOME_BUTTON_WIDTH/4
    diceButton.interactive = true
    diceButton.on('pointerdown',rollDice)
    app.stage.addChild(diceButton)


    app.stage.addChild(ultimateNumberLine)


    dragger.height = WINDOW_HEIGHT - NUMBER_LINE_Y - ultimateNumberLine.height
    dragger.width = dragger.height*0.31
    dragger.y = NUMBER_LINE_Y + ultimateNumberLine.height
  
    dragger.x = WINDOW_WIDTH/2
    dragger.interactive = true
    app.stage.addChild(dragger)

  }

  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);
  // app.resizable = true

};
