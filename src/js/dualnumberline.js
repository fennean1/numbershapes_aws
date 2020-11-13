import * as PIXI from "pixi.js";
import openLock from "../assets/UnlockedLock.png";
import closedLock from "../assets/LockedLock.png";
import spaceGround from "../assets/LockedLock.png";
import blueGradient from "../assets/blue-gradient.png";
import greyPin from "../assets/Pin.png";
import MagnifyingGlass from "../assets/MagnifyingGlass.png";
import {
  Draggable,
  HorizontalNumberLine,
  NumberLine,
  Pin,
} from "./api_kh.js";



export const init = (app, setup) => {
  let features = {}
  let snapIndicator = new PIXI.Graphics()
  let backGround;
  let ground;
  let numberlineA;
  let numberlineB;
  let pins = [];
  let lockButton;
  let magnifyingPin;

  const PIN_TEXTURE = new PIXI.Texture.from(greyPin);
  const SHARP_PIN_TEXTURE = new PIXI.Texture.from(greyPin);
  const OPEN_LOCK_TEXTURE = new PIXI.Texture.from(openLock);
  const CLOSED_LOCK_TEXTURE = new PIXI.Texture.from(closedLock);
  const MAGNIFYING_GLASS = new PIXI.Texture.from(MagnifyingGlass)

  // Layout Parameters
  let WINDOW_WIDTH = setup.width;
  let WINDOW_HEIGHT = setup.height;
  let VIEW_WIDTH = setup.width
  let VIEW_HEIGHT = setup.height
  let HOME_BUTTON_WIDTH = WINDOW_WIDTH / 15;
  let H_W_RATIO = setup.height / setup.width;
  let NUMBER_LINE_WIDTH = WINDOW_WIDTH;
  let NUMBER_LINE_Y = (5 / 8) * WINDOW_HEIGHT;
  let DRAGGER_Y = NUMBER_LINE_Y;
  let BTN_DIM = Math.min(VIEW_WIDTH,VIEW_HEIGHT)/10

  backGround = new makeBackground();
  ground = new makeGround();


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
  sliderLine.y = DRAGGER_Y;
  //app.stage.addChild(sliderLine);


  let panRegionDown = new Draggable(SHARP_PIN_TEXTURE);
  panRegionDown.interactive = true;
  panRegionDown.lockY = true;
  panRegionDown.anchor.set(0.5, 0);
  panRegionDown.height = ground.sprite.height / 2;
  panRegionDown.width = ground.sprite.height / 2;
  panRegionDown.x = WINDOW_WIDTH / 2;
  panRegionDown.anchorPoint = panRegionDown.x;
  panRegionDown.y = 1.1 * NUMBER_LINE_Y;
  //app.stage.addChild(draggerMin);
  backGround.sprite.on("pointermove", panRegionDownPointerMove);
  backGround.sprite.on("pointerdown", panRegionDownPointerDown);
  backGround.sprite.on("pointerup", panRegionDownPointerUp);
  backGround.sprite.on("pointerupoutside", panRegionDownPointerUp);
     



  class LockButton extends PIXI.Sprite {
    constructor(locked,unlockTexture,lockTexture){
      super()
      this.locked = locked
      this.lockTexture = lockTexture
      this.unlockTexture = unlockTexture
      this.texture = this.locked ? this.lockTexture : this.unlockTexture
      this.interactive = true
      this.on('pointerdown',this.onPointerDown)
    }

    setState(lockedState){
      this.locked = lockedState
    }

    toggleLock(){
      this.locked = !this.locked
      this.texture = this.locked ? this.lockTexture : this.unlockTexture
      if (!this.locked){
        numberlineA.flexPoint = 0
        numberlineB.flexPoint = 0
        magnifyingPin.alpha = 0
      } else {
        magnifyingPin.alpha = 1
        magnifyingPin.x = VIEW_WIDTH/2
        magnifyingPin.value = numberlineA.getNumberLineFloatValueFromPosition(magnifyingPin.x)
        numberlineA.flexPoint = numberlineA.getNumberLineFloatValueFromPosition(magnifyingPin.x)
        numberlineB.flexPoint = numberlineB.getNumberLineFloatValueFromPosition(magnifyingPin.x)
      }
    }

    onPointerDown(){
      this.toggleLock()
    }
  }


  function panRegionDownPointerDown(e) {
    this.touching = true;
    this.anchorPoint = e.data.global.x;
    this.initialNumberlineMin = numberlineA.minFloat;
    this.initialNumberlineMax = numberlineA.maxFloat;

    numberlineB.initialNumberlineMin = numberlineB.minFloat;
    numberlineB.initialNumberlineMax = numberlineB.maxFloat;
  }

  function panRegionDownPointerMove(e) {
    if (this.touching) {
      let x = e.data.global.x;
      let x1 = numberlineA.getNumberLineFloatValueFromPosition(x);
      let x2 = numberlineA.getNumberLineFloatValueFromPosition(
        this.anchorPoint
      );
      let delta = x2 - x1;
      let _min = this.initialNumberlineMin + delta;
      let _max = this.initialNumberlineMax + delta;

      let x1B = numberlineB.getNumberLineFloatValueFromPosition(x);
      let x2B = numberlineB.getNumberLineFloatValueFromPosition(
        this.anchorPoint
      );
      let deltaB = x2B - x1B;
      let _minB = numberlineB.initialNumberlineMin + deltaB;
      let _maxB = numberlineB.initialNumberlineMax + deltaB;
      
      numberlineA.draw(_min, _max);
      numberlineB.draw(_minB, _maxB);
      magnifyingPin.synch()

    }
  }

  function panRegionDownPointerUp(e) {
    this.touching = false;

  }


  // Constructors
  function makeBackground() {
    // Setup Background
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
    this.sprite.height = WINDOW_HEIGHT / 4;
    this.sprite.x = 0;
    this.sprite.y = WINDOW_HEIGHT - this.sprite.height;
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
  }

  function numberlinePointerDown(e) {
    this.moved = false;
    this.touching = true;
    let x = e.data.getLocalPosition(this).x
    numberlineB.pointerDownValue = numberlineB.getNumberLineFloatValueFromPosition(x)
    let roundedX = this.roundPositionToNearestTick(x)
    snapIndicator.x = roundedX
  }

  function numberlinePointerMove(e) {
    if (this.touching) {
      this.moved = true;
      let x = e.data.getLocalPosition(this).x
      if (lockButton.locked){
        let bounds = numberlineB.getBoundsFrom(x,numberlineB.pointerDownValue)
        numberlineB.draw(bounds.min,bounds.max)
      } else {
        let roundedX = this.roundPositionToNearestTick(x)
        snapIndicator.x = roundedX
      }
    }

  }

  function numberlinePointerUp(e) {
    let x = e.data.getLocalPosition(this).x;
    if (!this.moved) {
      // Click only logic goes here.  
    }

    if (!lockButton.locked){
      let roundedX = this.roundPositionToNearestTick(x)
      numberlineB.synchWith(roundedX)
      snapIndicator.x = roundedX
    }
  }


  // Numberline B
  function numberlineBPointerDown(e) {
    let x = e.data.getLocalPosition(this).x
    let roundedX = this.roundPositionToNearestTick(x)
    snapIndicator.x = roundedX
    numberlineA.pointerDownValue = numberlineA.getNumberLineFloatValueFromPosition(x)
  }

  function numberlineBPointerMove(e) {
    if (this.touching) {
      this.moved = true;
      let x = e.data.getLocalPosition(this).x
      if (lockButton.locked){
        let bounds = numberlineA.getBoundsFrom(x,numberlineA.pointerDownValue)
        numberlineA.draw(bounds.min,bounds.max)
      } else {
        let roundedX = this.roundPositionToNearestTick(x)
        snapIndicator.x = roundedX
      }
    }
  }

  function numberlineBPointerUp(e) {
    let x = e.data.getLocalPosition(this).x;
    if (!this.moved) {
      // A click only logic here.
    }
    if (!lockButton.locked){
      let roundedX = this.roundPositionToNearestTick(x)
      numberlineA.synchWith(roundedX)
      snapIndicator.x = roundedX
    }
  }

  function magnifyinPinPointerUp(){
      if (lockButton.locked){
        numberlineB.flexPoint = numberlineB.getNumberLineFloatValueFromPosition(this.x)
      } else {
        numberlineB.flexPoint = 0
        numberlineA.flexPoint = 0
      }

  }

  // Loading Script
  function load() {
    if (setup.props.features) {
      features = setup.props.features;
    }

    app.stage.interactive = true;


    // NUMBERLINE A
    numberlineA = new HorizontalNumberLine(
      -1,
      25,
      NUMBER_LINE_WIDTH,
      app
    );
    numberlineA.setBoundaries(-100000, 100000, 0.005);
    numberlineA.x = 0;
    numberlineA.y = NUMBER_LINE_Y;
    app.stage.addChild(numberlineA);
    numberlineA.hitArea = new PIXI.Rectangle(
      0,
      0,
      WINDOW_WIDTH,
      1/4*(WINDOW_HEIGHT - NUMBER_LINE_Y)
    );
    
    // NUMBERLINE B
    numberlineB = new HorizontalNumberLine(
      -1,
      25,
      NUMBER_LINE_WIDTH,
      app
    );
    numberlineB.setBoundaries(-100000, 100000, 0.005);
    numberlineB.x = 0;
    numberlineB.y = 1/2*NUMBER_LINE_Y;
    app.stage.addChild(numberlineB);
    numberlineB.hitArea = new PIXI.Rectangle(
      0,
      0,
      WINDOW_WIDTH,
      WINDOW_HEIGHT - NUMBER_LINE_Y
    );


    app.stage.addChild(numberlineA);



      // Pointer Events
    numberlineA.on("pointerdown", numberlinePointerDown);
    numberlineA.on("pointermove", numberlinePointerMove);
    numberlineA.on("pointerup", numberlinePointerUp);
    
      // Pointer Events
    numberlineB.on("pointerdown", numberlineBPointerDown);
    numberlineB.on("pointermove", numberlineBPointerMove);
    numberlineB.on("pointerup", numberlineBPointerUp);
        
    snapIndicator.lineStyle(2,0x000000)
    let zeroPoint = numberlineB.getNumberLinePositionFromFloatValue(0)
    snapIndicator.lineTo(0,numberlineA.y-numberlineB.y)
    snapIndicator.x = zeroPoint
    snapIndicator.y = numberlineB.y
    app.stage.addChild(snapIndicator)

    lockButton = new LockButton(true,OPEN_LOCK_TEXTURE,CLOSED_LOCK_TEXTURE)
    lockButton.width = HOME_BUTTON_WIDTH
    lockButton.height = HOME_BUTTON_WIDTH
    lockButton.x = WINDOW_WIDTH - lockButton.width
    lockButton.y = 0
    app.stage.addChild(lockButton)

    const pinState = {
        height: BTN_DIM/1.5,
        width: BTN_DIM/1.5,
        texture: MAGNIFYING_GLASS,
      }

    magnifyingPin = new Pin(numberlineA,pinState)
    magnifyingPin.x = numberlineA.getNumberLinePositionFromFloatValue(0)
    magnifyingPin.y = numberlineA.y + VIEW_HEIGHT/4
    magnifyingPin.on('pointerup',magnifyinPinPointerUp)
    magnifyingPin.on('pointerupoutside',magnifyinPinPointerUp)
    magnifyingPin.drawWhisker()
    magnifyingPin.value = 0
    app.stage.addChild(magnifyingPin)




  }

  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);
  // app.resizable = true
};
