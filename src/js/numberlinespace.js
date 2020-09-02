import * as PIXI from "pixi.js";
import blueGradient from "../assets/Clouds.png";
import spaceGround from "../assets/SpaceGround.png";
import spaceShipWindow from "../assets/SpaceShipWindow.png";
import nightBackground from "../assets/NightBackground.png";
import {BLUE,RED,GREEN,ORANGE,PURPLE,PINK,NUMERAL,BALLS,BUTTONS} from "../AssetManager.js"
import * as CONST from "./const.js";
import { Fraction, Draggable, distance, FractionFrame } from "./api.js";
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
  let viewPort = new PIXI.Container();
  let backGround;
  let homeButton;
  let windowButton;
  let ground;
  let hundredsJumps;
  let tensJumps;
  let fractionFrame;
  let papers = [];
  let jumps;
  let MAX_STAR_SIZE = 5;
  let numberlineVal = 100;

  const NL_COLOR = 0x000000;
  const MOVER_DOT = new PIXI.Texture.from(CONST.ASSETS.MOVER_DOT);
  const SPACE_SHIP_WINDOW = new PIXI.Texture.from(spaceShipWindow);
  const PIN_TEXTURE_2 = new PIXI.Texture.from(CONST.ASSETS.BLUE_SPACE_SHIP);
  const PIN_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.PINK_SPACE_SHIP);
  const BLUE_CIRCLE = new PIXI.Texture.from(CONST.ASSETS.STAR);
  const SHARP_PIN_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.SHARP_PIN);

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
  let NUMBER_LINE_Y = (3 / 4) * WINDOW_HEIGHT;
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

  class Emitter extends PIXI.Sprite {
    constructor(radius, theta) {
      super();
      this.theta = theta;
      this.radius = radius;
      this.x = focalPoint.x + Math.cos(theta) * radius;
      this.y = focalPoint.y + Math.sin(theta) * radius;
      this.initialX = this.x;
      this.initialY = this.y;
      this.width = MAX_STAR_SIZE;
      this.height = MAX_STAR_SIZE;
      this.accumulator = 0;
    }

    beginUpdate() {
      this.accumulator = 0;
    }

    update(delta) {
      this.delta = delta;
      let moddedDelta = this.delta % this.radius;
      this.x = this.initialX - moddedDelta * Math.cos(this.theta);
      this.y = this.initialY - moddedDelta * Math.sin(this.theta);
      let deltaX = this.x - focalPoint.x;
      let deltaY = this.y - focalPoint.y;
      let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      this.alpha = distance / (WINDOW_HEIGHT / 2);
    }

    endUpdate() {
      this.accumulator = 0;
    }
  }

  let sliderLine = new PIXI.Graphics();
  sliderLine.lineStyle(NUMBER_LINE_WIDTH / 300, 0xdbdbdb);
  sliderLine.lineTo(1.1 * NUMBER_LINE_WIDTH, 0);
  sliderLine.x = WINDOW_WIDTH / 2 - (1.1 * NUMBER_LINE_WIDTH) / 2;
  sliderLine.y = DRAGGER_Y
  //app.stage.addChild(sliderLine);

  let dragger = new Draggable(PIN_TEXTURE);
  dragger.lockY = true;
  dragger.interactive = true;
  dragger.anchor.set(0.5);
  dragger.ds = 200000;
  dragger.width = DRAGGER_WIDTH
  dragger.height = DRAGGER_WIDTH*2.5
  dragger.x = NUMBER_LINE_X + (5 * NUMBER_LINE_WIDTH) / 9;
  dragger.anchorPoint = dragger.x
  dragger.y = DRAGGER_Y - dragger.height/2
  //app.stage.addChild(dragger);

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

  draggerMin.on("pointermove", draggerMinPointerMove);
  draggerMin.on("pointerdown", draggerMinPointerDown);
  draggerMin.on("pointerup", draggerMinPointerUp);
  draggerMin.on("pointerupoutside", draggerMinPointerUp);

  draggerCenter.on("pointermove", draggerCenterPointerMove);
  draggerCenter.on("pointerdown", draggerCenterPointerDown);
  draggerCenter.on("pointerup", draggerCenterPointerUp);
  draggerCenter.on("pointerupoutside", draggerCenterPointerUp);


  function zoomToShips(){
    let minCompression = Math.min(numberline.compressionOne,numberline.compressionTwo)
    let maxCompression = Math.max(numberline.compressionOne,numberline.compressionTwo)
    const onUpdate = ()=>{
      dragger.x = numberline.getNumberLinePositionFromFloatValue(minCompression)
      draggerMin.x = numberline.getNumberLinePositionFromFloatValue(maxCompression)
    }
    numberline.zoomTo(-maxCompression/10,1.1*maxCompression,1,onUpdate,onUpdate)
  }


  function draggerCenterPointerMove(){
    if (this.touching){
      let x1 = numberline.getNumberLineFloatValueFromPosition(this.x)
      let x2 = numberline.getNumberLineFloatValueFromPosition(this.anchorPoint)
      let delta = x2-x1
      let _min = this.initialNumberlineMin + delta
      let _max = this.initialNumberlineMax + delta
      numberline.draw(_min,_max)
      let minCompression = Math.min(numberline.compressionOne,numberline.compressionTwo)
      let maxCompression = Math.max(numberline.compressionOne,numberline.compressionTwo)
      dragger.x = numberline.getNumberLinePositionFromFloatValue(minCompression)
      draggerMin.x = numberline.getNumberLinePositionFromFloatValue(maxCompression)
    }
  }

  function draggerCenterPointerDown(){
    this.initialNumberlineMin = numberline.minFloat
    this.initialNumberlineMax = numberline.maxFloat
  }

  function draggerCenterPointerUp(e){
    let minCompression = Math.min(numberline.compressionOne,numberline.compressionTwo)
    let maxCompression = Math.max(numberline.compressionOne,numberline.compressionTwo)
    this.x = this.anchorPoint
  }

  // D_POINTER_MOVE
  function draggerPointerMove() {

    let compression = numberline.getNumberLineFloatValueFromPosition(this.x)  
    let minCompression = Math.min(numberline.compressionOne,numberline.compressionTwo)
    let maxCompression = Math.max(numberline.compressionOne,numberline.compressionTwo)
    let maxCompressionX = numberline.getNumberLinePositionFromFloatValue(maxCompression)
    let origin = numberline.getNumberLinePositionFromFloatValue(0)

    let minX  = NUMBER_LINE_WIDTH/100 + numberline.getNumberLinePositionFromFloatValue(0)
    let maxX = origin + (numberline.getNumberLinePositionFromFloatValue(maxCompression) - origin)/2

    if (this.touching && this.x < maxCompressionX && (this.x-origin) > WINDOW_WIDTH/100){
      
      if (numberline.compressionOne == minCompression) {
        numberline.multiplier = numberline.compressionTwo/compression
        if (this.x < maxX){
          numberline.multiplierSquared = numberline.multiplier * numberline.multiplier;
          numberline.compressionOne = compression
          numberline.hundredsJumps.smallGraphic = false
          numberline.tensJumps.smallGraphic = true
        } else {
          numberline.multiplier = 2
          numberline.multiplierSquared = numberline.multiplier * numberline.multiplier;
          numberline.compressionOne = compression
        }
      } else {
        numberline.multiplier = numberline.compressionOne/compression
        if (this.x < maxX){
          numberline.multiplierSquared = numberline.multiplier * numberline.multiplier;
          numberline.compressionTwo = numberline.compressionOne/numberline.multiplier
          numberline.hundredsJumps.smallGraphic = true
          numberline.tensJumps.smallGraphic = false
        } else {
          numberline.multiplier = 2
          numberline.multiplierSquared = numberline.multiplier * numberline.multiplier;
          numberline.compressionTwo = numberline.compressionOne/numberline.multiplier
        }
      } 
      numberline.draw(numberline.min,numberline.max)
    }  else if (this.x-origin < WINDOW_WIDTH/100){
        this.x = origin + WINDOW_WIDTH/100
    }
  }

  function draggerPointerDown() {
    this.initialX = this.x;
    this.initialNumberlineLength = numberline.max
  }

  function draggerPointerUp(e) {
    console.log("draggerpointerup")
    let compression = numberline.getNumberLineFloatValueFromPosition(this.x)  
    let minCompression = Math.min(numberline.compressionOne,numberline.compressionTwo)
      
    if (numberline.compressionOne == minCompression) {
      let oldMultiplier = numberline.multiplier
      numberline.multiplier = Math.round(numberline.compressionTwo/compression)
      if (oldMultiplier > 2){
        numberline.multiplierSquared = numberline.multiplier * numberline.multiplier;
        numberline.compressionOne = numberline.compressionTwo/numberline.multiplier
      } else {
        numberline.multiplier = 2
        numberline.multiplierSquared = numberline.multiplier * numberline.multiplier
        numberline.compressionOne = numberline.compressionTwo/numberline.multiplier;
      }
    } else {
      let oldMultiplier = numberline.multiplier
      numberline.multiplier = Math.round(numberline.compressionOne/compression)
      if (oldMultiplier > 2){
        numberline.multiplierSquared = numberline.multiplier * numberline.multiplier;
        numberline.compressionTwo = numberline.compressionOne/numberline.multiplier
      } else {
        numberline.multiplier = 2
        numberline.multiplierSquared = numberline.multiplier * numberline.multiplier;
        numberline.compressionTwo = numberline.compressionOne/numberline.multiplier
      }
    }
    numberline.draw(numberline.min,numberline.max)
    this.x = numberline.getNumberLinePositionFromFloatValue(Math.min(numberline.compressionOne,numberline.compressionTwo))
    draggerMin.x = numberline.getNumberLinePositionFromFloatValue(Math.max(numberline.compressionOne,numberline.compressionTwo))
    this.initialX = 0;

    if (Math.abs(NUMBER_LINE_Y - e.data.global.y)< DRAGGER_WIDTH && numberline.minorStep > 0.005){
      console.log("zooming")
      const onComplete = () => {
        this.x = numberline.getNumberLinePositionFromFloatValue(Math.min(numberline.compressionOne,numberline.compressionTwo))
        draggerMin.x = numberline.getNumberLinePositionFromFloatValue(Math.max(numberline.compressionOne,numberline.compressionTwo))
        this.touching = false
      }
      numberline.zoomTo(minCompression-2*numberline.minorStep,minCompression+2*numberline.minorStep,1,onComplete,onComplete)
    }
  }

  function draggerMinPointerMove() {
    let min = numberline.getNumberLinePositionFromFloatValue(0) + numberline.minorDX

    if (this.touching && this.x > min){
      let maxCompression = numberline.getNumberLineFloatValueFromPosition(this.x)
      let minCompression = Math.min(numberline.compressionOne,numberline.compressionTwo)
        if (numberline.compressionOne == minCompression) {
          numberline.compressionTwo = maxCompression
          numberline.compressionOne = maxCompression/numberline.multiplier
        } else {
          numberline.compressionOne = maxCompression
          numberline.compressionTwo = maxCompression/numberline.multiplier
        }
      numberline.draw(numberline.min,numberline.max)
      dragger.x = numberline.getNumberLinePositionFromFloatValue(minCompression)
    } else if (this.x < min){
      this.outOfRange = true 
      this.x = min
    }
}

  function draggerMinPointerUp(e) {
    let roundedPosition = Math.round(numberline.getNumberLineFloatValueFromPosition(this.x)/numberline.minorStep)*numberline.minorStep
    let maxCompression = roundedPosition
    let minCompression = Math.min(numberline.compressionOne,numberline.compressionTwo)

      if (numberline.compressionOne == minCompression) {
        numberline.compressionTwo = maxCompression
        numberline.compressionOne = maxCompression/numberline.multiplier
      } else {
        numberline.compressionOne = maxCompression
        numberline.compressionTwo = maxCompression/numberline.multiplier
      }

    numberline.draw(numberline.min,numberline.max)
    this.initialX = 0;
    this.x = numberline.getNumberLinePositionFromFloatValue(Math.max(numberline.compressionOne,numberline.compressionTwo))
    dragger.x = numberline.getNumberLinePositionFromFloatValue(Math.min(numberline.compressionOne,numberline.compressionTwo))

    if (Math.abs(NUMBER_LINE_Y - e.data.global.y) < DRAGGER_WIDTH && numberline.minorStep > 0.005){
      const onComplete = () => {
        dragger.x = numberline.getNumberLinePositionFromFloatValue(Math.min(numberline.compressionOne,numberline.compressionTwo))
        this.x = numberline.getNumberLinePositionFromFloatValue(Math.max(numberline.compressionOne,numberline.compressionTwo))
        this.touching = false
      }
      numberline.zoomTo(maxCompression-2*numberline.minorStep,maxCompression+2*numberline.minorStep,1,onComplete,onComplete)
    }
  }

  function draggerMinPointerDown() {
    this.initialX = this.x;
    this.initialNumberlineLength = numberline.min
  }


function groundPointerMove(e) {
  if (this.touching) {

    let delta = e.data.global.x - this.initialX
    let minCompression = Math.min(numberline.compressionOne,numberline.compressionTwo)
    let maxCompression = Math.max(numberline.compressionOne,numberline.compressionTwo)
    let roundedMinCompression = Math.round(minCompression/numberline.minorStep)*numberline.minorStep
    let roundedMaxCompression = Math.round(maxCompression/numberline.minorStep)*numberline.minorStep

    let numberlineRange = numberline.max - numberline.min
    let N = (delta / NUMBER_LINE_WIDTH) * numberlineRange
    let left = this.initialX < WINDOW_WIDTH/2 ? true : false
    let range = numberlineRange - N

    let newNumberLineMaxValue = numberline.getNumberLineMaxFromAnchor(this.initialValue,e.data.global.x)
    let newNumberLineMinValue = numberline.getNumberLineMinFromAnchor(this.initialValue,e.data.global.x)
    if (range > numberline.lowerRange && range < numberline.upperRange) {
      if (left){
           numberline.draw(newNumberLineMinValue,numberline.max);
        } else if (!left){
            numberline.draw(numberline.min,newNumberLineMaxValue);
      }
    }
    dragger.x = numberline.getNumberLinePositionFromFloatValue(minCompression)
    draggerMin.x = numberline.getNumberLinePositionFromFloatValue(maxCompression)
  } 
}


function groundPointerDown(e) {
  const onComplete = ()=>{
    draggerMin.interactive = false
    dragger.interactive = false
  }
  //TweenLite.to([dragger,draggerMin],{alpha: 0,duration: 0.5,onComplete: onComplete})
  this.touching = true
  this.initialX = e.data.global.x 
  this.initialValue = numberline.getNumberLineFloatValueFromPosition(this.initialX)
  this.initialMax = numberline.maxFloat
  this.initialMin = numberline.minFloat
}

function groundPointerUp(e) {
  this.initialMax = numberline.maxFloat
  this.initialMin = numberline.minFloat
  let minCompression = Math.min(numberline.compressionOne,numberline.compressionTwo)
  let maxCompression = Math.max(numberline.compressionOne,numberline.compressionTwo)
  const onComplete = ()=>{
    draggerMin.interactive = true
    dragger.interactive = true
  }

  const onComplete2 = ()=> {
    draggerMin.x = numberline.getNumberLinePositionFromFloatValue(maxCompression)
    dragger.x = numberline.getNumberLinePositionFromFloatValue(minCompression)
    TweenLite.to([dragger,draggerMin],{alpha: 1,duration: 0.5,onComplete: onComplete})
  }

  // FEATURES
  if (features.spaceShips){
      if (draggerMin.x > WINDOW_WIDTH){
        //let draggerMinXVal = numberline.getNumberLineFloatValueFromPosition(draggerMin.x)
        //numberline.zoomTo(numberline.min,numberline.max + (draggerMinXVal-numberline.max)*2,0.3,onComplete2)
        onComplete2()
      } else if (dragger.x < 0) {
        //let min = numberline.getNumberLineFloatValueFromPosition(dragger.x)
        //numberline.zoomTo(-min/2,numberline.max,0.3,onComplete2)
      } else {
        onComplete2()
      }
  }

  this.touching = false
  this.initialX = this.x  
}



  // Helllooo

  class Jumps extends PIXI.Container {
    constructor(n) {
      super();
      this.n = n;
      this.jumps = [];
      this.jumpGraphic = new PIXI.Graphics();
      this.colorOne = 0x75acff
      this.colorTwo = 0xff3bd8
      this.jumpGraphic.lineStyle(NUMBER_LINE_WIDTH / 300, 0x75acff);
      this.jumpGraphic.beginFill(0xffffff)
      this.jumpGraphic._fillStyle.alpha = 0.15
      this.jumpGraphic.arc(0, 0, 50, -Math.PI, 0); // cx, cy, radius, startAngle, endAngle
      this.jumpGraphic.endFill()
      this.smallGraphic = false
      this.jumpTexture = app.renderer.generateTexture(this.jumpGraphic);

      this.dummyGraphic = new PIXI.Graphics()
      this.dummyGraphic.drawCircle(0,0,1)
      this.dummyTexture = app.renderer.generateTexture(this.dummyGraphic)
      this.init();
    }

    init() {
      for (let i = 0; i < this.n; i++) {
        let newJump = new PIXI.Sprite();
        newJump.texture = this.jumpTexture
        this.jumps.push(newJump);
        this.addChild(newJump);
      }
      this.draw();
    }

    draw(size) {
      this._size = size

      if (size < 0.5*WINDOW_WIDTH && size > 0.005*WINDOW_WIDTH){
        this.jumpGraphic.clear();
        if (this.smallGraphic == true) {
          this.jumpGraphic.lineStyle(NUMBER_LINE_WIDTH / 300, this.colorOne);
        } else {
          this.jumpGraphic.lineStyle(NUMBER_LINE_WIDTH / 300, this.colorTwo);
        }
        this.jumpGraphic.beginFill(0xffffff)
        this.jumpGraphic._fillStyle.alpha = 0.15
        this.jumpGraphic.arc(0, 0, size, -Math.PI, 0);
        this.jumpGraphic.endFill()
        this.jumpTexture.destroy(true);
        this.jumpTexture = app.renderer.generateTexture(this.jumpGraphic);
        this.jumps.forEach((e, i) => {
          e.texture = this.jumpTexture;
          e.x = i * 2 * size;
          let _alpha = 1 - 1.8*size/NUMBER_LINE_WIDTH
          e.alpha = _alpha
      });
      } else {
        this.jumps.forEach((e, i) => {
          e.alpha = 0
      });
      }
    }
  }

  function panRegionPointerDown(e) {
    this.touching = true;
    this.anchorPoint = e.data.global.x;
    this.initialNumberlineMin = numberline.minFloat;
    this.initialNumberlineMax = numberline.maxFloat;
  }

  function panRegionPointerMove(e) {
    if (this.touching) {
      let x = e.data.global.x;
      let x1 = numberline.getNumberLineFloatValueFromPosition(x);
      let x2 = numberline.getNumberLineFloatValueFromPosition(
        this.anchorPoint
      );
      let delta = x2 - x1;
      let _min = this.initialNumberlineMin + delta;
      let _max = this.initialNumberlineMax + delta;
      numberline.draw(_min, _max);
      let minCompression = Math.min(numberline.compressionOne,numberline.compressionTwo)
      let maxCompression = Math.max(numberline.compressionOne,numberline.compressionTwo)
      dragger.x = numberline.getNumberLinePositionFromFloatValue(minCompression)
      draggerMin.x = numberline.getNumberLinePositionFromFloatValue(maxCompression)
    }
  }

  function panRegionPointerUp(e) {
    this.touching = false;
  }

  // Classes

  class NumberLine extends PIXI.Container {
    constructor(min, max, width) {
      super();
      this.pin = new Draggable();
      this.pin.lockY = true;
      this.pin.texture = SHARP_PIN_TEXTURE;
      this.pin.anchor.set(0.5, 0);
      //this.addChild(this.pin)

      this.lineUp = new PIXI.Graphics();
      this.lineUp.lineStyle(NUMBER_LINE_WIDTH / 300, 0x000000);
      this.lineUp.lineTo(0, -WINDOW_HEIGHT);
      this.lineUp.x = this.pin.x;
      //this.addChild(this.lineUp)

      this.pin.width = width / 10;
      this.pin.height = width / 10;
      this.pin.index = 0;

      this.pinText = new PIXI.Text();
      this.pinText.width = this.pin.width;
      this.pinText.height = this.pin.height;
      this.pinText.anchor.set(0.5);
      this.pinText.x = 0;
      this.pinText.y = 500;
      //this.pin.addChild(this.pinText)
      this.pinText.text = this.pin.index;
      this.pin.on("pointerup", this.pinPointerUp);
      this.pin.on("pointermove", this.pinPointerMove);
      this.ticks = [];
      this.tensJumps = new Jumps(100);
      this.hundredsJumps = new Jumps(100);
      this.hundredsJumps.smallGraphic = false
      this.tensJumps.smallGraphic = true
      this.labels = [];
      this.min = min;
      this.max = max;
      this.minFloat = min;
      this.maxFloat = max;
      this._width = width;
      this.lineThickness = width / 300;

      this.upperLimit = 10000
      this.lowerLimit = -10000
      this.upperRange = 20000
      this.lowerRange  = 0.0005

      this.setLayoutParams(min, max);

      this.majorTick = new PIXI.Graphics();
      this.majorTick.lineStyle(this.majorTickThickness, NL_COLOR);
      this.majorTick.lineTo(0, this.majorTickHeight);
      this.majorTickTexture = app.renderer.generateTexture(this.majorTick);

      this.minorTick = new PIXI.Graphics();
      this.minorTick.lineStyle(this.minorTickThickness, NL_COLOR);
      this.minorTick.lineTo(0, this.minorTickHeight);
      this.minorTickTexture = app.renderer.generateTexture(this.minorTick);

      this.line = new PIXI.Graphics();
      this.line.lineStyle(this.lineThickness, NL_COLOR);
      this.line.lineTo(width, 0);
      this.line.y = this.line.y + this.lineThickness/2

      this.addChild(this.tensJumps);
      this.addChild(this.hundredsJumps);
      this.addChild(this.line);

      this.dot = new PIXI.Sprite.from(CONST.ASSETS.BLUE_CIRCLE);
      this.dot.width = width / 50;
      this.dot.height = width / 50;
      this.dot.anchor.set(0.5);
      //this.addChild(this.dot)

      this.dot2 = new PIXI.Sprite.from(CONST.ASSETS.BLUE_CIRCLE);
      this.dot2.width = width / 50;
      this.dot2.height = width / 50;
      this.dot2.anchor.set(0.5);
      //this.addChild(this.dot2)

      this.multiplier = 10;
      this.multiplierSquared = this.multiplier * this.multiplier;

      this.compressionOne = 10;
      this.compressionTwo = this.compressionOne * this.multiplier;

      this.on('pointerdown',this.pointerDown)
      this.on('pointerup',this.pointerUp)
      this.on('pointerupoutside',this.pointerUp)
      this.on('pointermove',this.pointerMove)

      this.flexPoint = 0

      this.init();

      this.hitArea = new PIXI.Rectangle(0,0,this.width,3*this.digitHeight)


    }

    setColorState(multicolored){
        if (multicolored){
          // Do nothing
        } else {
          this.hundredsJumps.colorTwo = this.hundredsJumps.colorOne
          this.tensJumps.colorTwo = this.hundredsJumps.colorOne
        }
    }

    pointerUp(){
      this.touching = false
    }
  
    pointerDown(e){
      this.touching = true
      let pA = e.data.getLocalPosition(this).x
      this.vA = this.getNumberLineFloatValueFromPosition(pA)
    }
  
    pointerMove(e){
      if(this.touching){
        let pA = e.data.getLocalPosition(this).x
        let bounds = this.getBoundsFrom(pA,this.vA)
        this.draw(bounds.min,bounds.max)
        let minCompression = Math.min(numberline.compressionOne,numberline.compressionTwo)
        let maxCompression = Math.max(numberline.compressionOne,numberline.compressionTwo)
        dragger.x = numberline.getNumberLinePositionFromFloatValue(minCompression)
        draggerMin.x = numberline.getNumberLinePositionFromFloatValue(maxCompression)
      }
    }

    getBoundsFrom(x,value){
      let pM = this._width 
      let pm = 0
      let pC = this.getNumberLinePositionFromFloatValue(this.flexPoint)
      let vC = this.flexPoint
      let pA = x
      let vA = value
      let vM = vC + (pM-pC)/(pA-pC)*(vA-vC)
      let vMin = vM - (pM-pm)/(pM-pC)*(vM-vC) 
  
      return {min: vMin,max: vM}
    }


    // Only responsible for setting labels to the rightful location.
    placeLabels(labels, values, dx, digitHeight) {
      labels.forEach((l) => {
        let currentValue = l.value;
        // If the value of this label isn't null, we know it's already active and on the number line.
        let activeLabel = currentValue != null;
        let needsToBeSet = activeLabel && values[currentValue];
        delete values[currentValue];
        // If the label is active and still a value that needs to be set, reposition it.
        if (needsToBeSet) {
          l.text = l.value;
          l.x = (l.value - numberline.min) * dx;
          l.style.fontSize = digitHeight;
          l.alpha = 1;

          // If it's active, but not part of the new active labels, remove it and set value null.
        } else if (activeLabel) {
          // Hide / remove
          l.value = null;
          l.alpha = 0;
        }
      });

      let empties = labels.filter((l) => l.value == null);

      //console.log("empties length",empties.length)

      let valueKeys = Object.keys(values);

      valueKeys.forEach((k) => {
        if (empties.length != 0) {
          let newActiveLbl = empties.pop();
          newActiveLbl.value = k;
          newActiveLbl.text = k;
          newActiveLbl.x = (k - this.min) * dx;
          newActiveLbl.alpha = 1;
        }
      });
    }

    placeTicks(ticks, values, dx, textures, majorStep) {

      ticks.forEach((l, i) => {
        let currentValue = l.value;
        let activeLabel = currentValue != null;
     
        let needsToBeSet = activeLabel && values[currentValue];
        //console.log("currentValue,needsToBeSet",currentValue,needsToBeSet)
        delete values[currentValue];

        // If the label is active and still a value that needs to be set, reposition it.
        if (needsToBeSet) {
          l.text = l.value;
          l.x = dx * (l.value - this.min);
          l.y = 0;
          l.alpha = 1;
          //console.log('majorStep,l.value,l.value % majorStep,l.value',majorStep,l.value,l.value%majorStep)
          let mod = Math.abs(l.value%majorStep/majorStep)
          if (mod < 0.01 || mod > 0.99) {
            //console.log("Major Texture!")
            l.texture = textures[0];
          } else {
            l.texture = textures[1];
          }

          // If it's active, but not part of the new active labels, remove it and set value null.
        } else if (activeLabel) {
          l.value = null;
          l.alpha = 0;
        }
      });

      let empties = ticks.filter((l) => l.value == null);

      let valueKeys = Object.keys(values);

      valueKeys.forEach((k) => {
        if (empties.length != 0) {
          let newActiveTick = empties.pop();
          newActiveTick.value = k;
          newActiveTick.x = (k - this.min) * dx;
          newActiveTick.alpha = 1;


          // Why was this here?
          /*
          if (newActiveTick.value % majorStep == 0) {
            newActiveTick.texture = textures[0];
          } else {
            newActiveTick.texture = textures[1];
          }
          */

        }
      });
    }


    zoomTo(min,max,duration,onComplete,onUpdate){
      const update = ()=>{
        onUpdate()
        this.draw(this.min,this.max)
      }
      TweenLite.to(this,{max: max,min: min,duration: duration,onUpdate: update,onComplete: onComplete})
    }

    getNumberLineFloatValueFromPosition(pos) {
      return (pos * this.minorStep) / this.minorDX + this.minFloat;
    }

    getNumberLineMaxFromAnchor(anchor,position) {

      let center = this.getNumberLineFloatValueFromPosition(this._width/2)
      console.lg
      let max = center + (anchor - center)/position*this._width
      return max
    }

    
    getNumberLineMaxFromAnchor(anchor,position) {
      let max = this.minFloat + (anchor - this.minFloat)/position*this._width
      return max
    }

    getNumberLineMinFromAnchor(anchor,position) {


      let min = this.maxFloat - (this.maxFloat - anchor)/(1-position/this._width)

      return min
    }

   getNumberLinePositionFromFloatValue(val){
      let pos = (val-this.minFloat)/this.minorStep*this.minorDX
      let pos1 = (val - this.minFloat)/(this.maxFloat-this.minFloat)*this._width
      return pos1
   }

    pinPointerMove() {
      if (this.touching) {
        this.value = this.parent.getNumberLineFloatValueFromPosition(this.x);
        this.index = Math.round(this.value);
        this.parent.drawDescriptors();
      }
    }

    pinPointerUp() {
      this.index = Math.round(
        (this.x * this.parent.minorStep) / this.parent.minorDX +
          this.parent.minFloat
      );
      this.parent.draw(numberline.min, numberline.max);
      this.parent.lineUp.x = this.x;
      this.parent.addChild(this.parent.dot);
      this.parent.addChild(this.parent.dot2);

      // Move this shit elsewhere

      let floatValue = this.parent.getNumberLineFloatValueFromPosition(this.x);
      let nearestTen = Math.round(floatValue / 10) * 10;
      let nearestHundred = Math.round(floatValue / 100) * 100;

      let position =
        ((nearestHundred - this.parent.minFloat) / this.parent.minorStep) *
        this.parent.minorDX;

      let position2 =
        ((nearestTen - this.parent.minFloat) / this.parent.minorStep) *
        this.parent.minorDX;

      const onUpdate = () => {
        let r1 = this.compressionTwo / 2;
        let k =
          ((this.parent.dot.x * this.parent.minorStep) / this.parent.minorDX +
            this.parent.minFloat) %
          this.multiplier;
        let jumpRadius = (this.parent.minorDX / this.parent.minorStep) * r1;
        let to = Math.sqrt(1 - ((k - r1) * (k - r1)) / (r1 * r1)) * jumpRadius;
        this.parent.dot.y = -to;
      };
      TweenMax.to(this.parent.dot, 1, { x: position, onUpdate: onUpdate });

      const onUpdate2 = () => {
        let k =
          (((this.parent.dot2.x * this.parent.minorStep) / this.parent.minorDX +
            this.parent.minFloat) %
            this.multiplier) *
          10;
        let jumpRadius = (this.parent.minorDX / this.parent.minorStep) * 5;
        let to = Math.sqrt(1 - ((k - 5) * (k - 5)) / 25) * jumpRadius;
        this.parent.dot2.y = -to;
      };
      TweenMax.to(this.parent.dot2, 1, { x: position2, onUpdate: onUpdate2 });
    }

    drawDescriptors() {
      let value = this.getNumberLineFloatValueFromPosition(this.pin.x);

      let jumpRadius =
        ((this.minorDX / this.minorStep) * this.compressionOne) / 2;
      let k = value % this.compressionOne;
      let to = Math.sqrt(1 - ((k - 50) * (k - 50)) / 2500) * jumpRadius;

      let jumpRadius2 =
        ((this.minorDX / this.minorStep) * this.compressionTwo) / 2;
      let k2 = value % this.compressionTwo;
      let to2 = Math.sqrt(1 - ((k2 - 5) * (k2 - 5)) / 25) * jumpRadius2;

      this.dot.x = this.pin.x;
      this.dot.y = -to;
      this.dot2.x = this.pin.x;
      this.dot2.y = -to2;

      this.lineUp.clear();
      this.lineUp.lineStyle(2, 0x000000);
      this.lineUp.lineTo(0, -to);

      this.lineUp.x = this.pin.x;
    }

    setLayoutParams(min, max) {
      this.params = numberLineParameters(min, max, this._width);
      this.majorStep = this.params.MAJOR_STEP;
      this.minorStep = this.params.MINOR_STEP;
      this.digitHeight = this.params.DIGIT_HEIGHT;

      this.majorDX =
        (this._width / (this.maxFloat - this.minFloat)) * this.majorStep;
      this.minorDX =
        (this._width / (this.maxFloat - this.minFloat)) * this.minorStep;

      this.dx = this._width / (this.maxFloat - this.minFloat);

      this.minorTickHeight = this._width / 60;
      this.majorTickHeight = 1.5 * this.minorTickHeight;

      this.minorTickThickness = Math.min(this.majorDX / 3, this.lineThickness);
      this.majorTickThickness = this.minorTickThickness * 1.25;
    }

    // NLD_DRAW
    draw(min, max) {

    let range = max - min


    if (max < this.upperLimit && min > this.lowerLimit && range > this.lowerRange && range < this.upperRange ) {
      this.min = min;
      this.max = max;
      this.minFloat = min;
      this.maxFloat = max;

      this.setLayoutParams(min, max);

      let numbersNeededForLabels = getNumbersNeeded(max, min, this.majorStep);
      let numbersNeededForTicks = getNumbersNeeded(max, min, this.minorStep);

      this.placeLabels(
        this.labels,
        numbersNeededForLabels,
        this.dx,
        this.digitHeight
      );

      this.placeTicks(
        this.ticks,
        numbersNeededForTicks,
        this.dx,
        [this.majorTickTexture, this.minorTickTexture],
        this.majorStep
      );

      if (this.nestMe){
          if (
            (this.minorDX / this.minorStep) * this.compressionOne >
            this._width * 1.3
          ) {
            this.compressionOne = this.compressionOne / this.multiplierSquared;
          } else if (
            (this.minorDX / this.minorStep) * this.compressionOne <
            this._width / this.multiplierSquared
          ) {
            this.compressionOne = this.compressionOne * this.multiplierSquared;
          }
    
          if (
            (this.minorDX / this.minorStep) * this.compressionTwo >
            this._width * 1.3
          ) {
            this.compressionTwo = this.compressionTwo / this.multiplierSquared;
          } else if (
            (this.minorDX / this.minorStep) * this.compressionTwo <
            this._width / this.multiplierSquared
          ) {
            this.compressionTwo = this.compressionTwo * this.multiplierSquared;
          }
      }  

      this.hundredsJumps.draw(
        ((this.minorDX / this.minorStep) * this.compressionOne) / 2
      );

      
      this.hundredsJumps.x = 
        ((0 - this.minFloat%this.compressionOne - this.compressionOne) / this.minorStep) * this.minorDX - this.lineThickness/2

      this.hundredsJumps.y =
        ((-this.minorDX / this.minorStep) * this.compressionOne) / 2

      this.tensJumps.draw(
        ((this.minorDX / this.minorStep) * this.compressionTwo) / 2
      );
      this.tensJumps.x = ((0 - this.minFloat%this.compressionTwo - this.compressionTwo) / this.minorStep) * this.minorDX - this.lineThickness/2
      this.tensJumps.y =
        ((-this.minorDX / this.minorStep) * this.compressionTwo) / 2;

      }
    }

    init() {
      for (let i = 0; i <= 100; i++) {
        let newTick = new PIXI.Sprite(this.majorTickTexture);
        newTick.anchor.set(0.5, 0);
        newTick.value = null;
        newTick.alpha = 0;
        this.addChild(newTick);
        this.ticks.push(newTick);

        let newLabel = new PIXI.Text();
        newLabel.style.fontSize = this.digitHeight;
        newLabel.style.fontFamily = "Chalkboard SE";
        newLabel.style.fill = NL_COLOR;
        newLabel.anchor.set(0.5, 0);
        newLabel.text = i;
        newLabel.value = null;
        newLabel.alpha = 0;
        this.addChild(newLabel);
        this.labels.push(newLabel);
        newLabel.y = 1.1 * this.majorTickHeight;
      }
      this.draw(this.min, this.max);
    }
  }

  function digitCount(n) {
    var count = 1;

    if (n >= 1) {
      while (n / 10 >= 1) {
        n /= 10;
        ++count;
      }
      return count;
    } else {
      ++count;
      while (n % 1 != 0) {
        n *= 10;
        ++count;
      }
      return count - 1;
    }
  }

  function numberLineParameters(min, max, width) {
    let majorSteps = [
      0.00001,
      0.00005,
      0.0001,
      0.0005,
      0.001,
      0.005,
      0.01,
      0.05,
      0.1,
      0.5,
      1,
      5,
      10,
      50,
      100,
      500,
      1000,
      5000,
      10000,
      50000,
      100000,
    ];
    let minorSteps = [
      0.00001,
      0.00005,
      0.0001,
      0.0005,
      0.001,
      0.005,
      0.01,
      0.1,
      1,
      5,
      10,
      50,
      100,
      500,
      1000,
      5000,
      10000,
      50000,
      100000,
    ];
    let minorStepIndex = 0;
    let majorStepIndex = -1;
    let digitHeight = 0;
    let ticksNeeded = (max - min) / minorSteps[minorStepIndex];
    let majorStep = 0.0001;
    let minorStep = 0.0001;

    while (digitHeight < width / 50) {
      majorStepIndex += 1;
      let numberOfIncrements = Math.round(
        (max - min) / majorSteps[majorStepIndex]
      );
      let maxDigits = 1;
      if (majorSteps[majorStepIndex] >= 1) {
        if (min < 0){
          maxDigits = digitCount(Math.floor(Math.abs(min))) + 1
        } else {
          maxDigits = digitCount(Math.ceil(max));
        }
      } else {
        if (min < 0){
          maxDigits = digitCount(Math.abs(Math.floor(min)))+digitCount(majorSteps[majorStepIndex]) + 1
        } else {
          maxDigits = digitCount(Math.ceil(max))+digitCount(majorSteps[majorStepIndex]);
        }

      }

      let numberOfDigitWidths = (maxDigits + 1) * (numberOfIncrements - 1);

      let digitWidth = width / numberOfDigitWidths;
      digitHeight = (6 / 5) * digitWidth;
      minorStep = minorSteps[majorStepIndex - 1];
      majorStep = majorSteps[majorStepIndex];
    }

    while (ticksNeeded >= 100) {
      minorStepIndex += 1;
      ticksNeeded = (max - min) / minorSteps[minorStepIndex];
      minorStep = minorSteps[minorStepIndex];
    }

    digitHeight = width / 50;

    const params = {
      MAJOR_STEP: majorStep,
      MINOR_STEP: minorStep,
      DIGIT_HEIGHT: digitHeight,
    };
    return params;
  }

  function getNumbersNeeded(max, min, step) {
    let numbersNeeded = {};
    let start = Math.ceil(min / step) * step;
    let currentNumber = start;
    let digits = digitCount(step);

    while (currentNumber <= max && currentNumber >= start) {
      let cleanNumber = Math.round(currentNumber / step) * step;
      if (cleanNumber % 1 != 0) {
        cleanNumber = currentNumber.toFixed(digits - 1);
      }
      // Add this number to the list of numbers needed.
      numbersNeeded[cleanNumber] = true;
      currentNumber += step;
    }
    return numbersNeeded;
  }

  // Constructors
  function makeBackground() {
    // Setup Background
    this.sprite = new PIXI.Sprite.from(nightBackground);
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
   function makeCurtains() {
    // Setup Background
    this.sprite = new PIXI.Sprite.from(nightBackground);
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
  
      app.stage.addChild(this.sprite);
  
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

  // Loading Script
  function load() {
    if (setup.props.features) {
      features = setup.props.features;
    }

    numberline = new NumberLine(-10, 155, NUMBER_LINE_WIDTH);

    app.stage.addChild(numberline);
    numberline.x = WINDOW_WIDTH / 2 - NUMBER_LINE_WIDTH / 2;
    numberline.y = NUMBER_LINE_Y

    let sprite = new PIXI.Sprite.from(blueGradient);
    sprite.width = 0.9 * numberline.x;
    sprite.height = WINDOW_HEIGHT;
    sprite.x = 0;
    sprite.y = 0;
    //app.stage.addChild(sprite)

    let sprite2 = new PIXI.Sprite.from(blueGradient);
    sprite2.anchor.set(1, 0);
    sprite2.width = 0.9 * numberline.x;
    sprite2.height = WINDOW_HEIGHT;
    sprite2.x = WINDOW_WIDTH;
    sprite2.y = 0;
    //app.stage.addChild(sprite2)

    focalPoint.x = numberline.x;
    focalPoint.y = numberline.y;

    let atanThis = focalPoint.y / (WINDOW_WIDTH - focalPoint.x);
    anchorAngle = Math.atan(atanThis);

    for (let i = 0; i < 100; i++) {
      let _angle = -Math.random() * angle;
      let radius = WINDOW_WIDTH + WINDOW_WIDTH * Math.random();
      let newEmitter = new Emitter(radius, _angle);
      newEmitter.texture = BLUE_CIRCLE;
      emitters.push(newEmitter);
      //app.stage.addChild(newEmitter)
      newEmitter.update((1 / 8) * dragger.ds);
    }

    for (let i = 0; i < 100; i++) {
      let _angle = -Math.random() * angle;
      let radius = WINDOW_WIDTH + WINDOW_WIDTH * Math.random();
      let newEmitter = new Emitter(radius, _angle);
      newEmitter.texture = BLUE_CIRCLE;
      emitters2.push(newEmitter);
      //app.stage.addChild(newEmitter)
      newEmitter.update((1 / 6) * dragger.ds);
    }

    homeButton = new PIXI.Sprite.from(BUTTONS.HOME)
    homeButton.width = HOME_BUTTON_WIDTH
    homeButton.height = HOME_BUTTON_WIDTH
    homeButton.x = HOME_BUTTON_WIDTH/4
    homeButton.y = HOME_BUTTON_WIDTH/4
    homeButton.interactive = true
    homeButton.on('pointerdown',()=>app.goHome())
    app.stage.addChild(homeButton)

    windowButton = new PIXI.Sprite.from(spaceShipWindow)
    windowButton.width = HOME_BUTTON_WIDTH
    windowButton.height = HOME_BUTTON_WIDTH
    windowButton.x = WINDOW_WIDTH - HOME_BUTTON_WIDTH - HOME_BUTTON_WIDTH/4
    windowButton.y = HOME_BUTTON_WIDTH/4
    windowButton.interactive = true
    windowButton.on('pointerdown',zoomToShips)
    //app.stage.addChild(windowButton)


    ground.sprite.on('pointerdown',panRegionPointerDown)
    ground.sprite.on('pointerup',panRegionPointerUp)
    ground.sprite.on('pointerupoutside',panRegionPointerUp)
    ground.sprite.on('pointermove',panRegionPointerMove)


    // FRACTION FRAME TEST


    // FEATURES
    if (features.spaceShips){
      app.stage.addChild(dragger)
      app.stage.addChild(draggerMin)
      app.stage.addChild(windowButton)
    }

    // FEATURES
    if (features.spaceBubbles){
      numberline.nestMe =  true
      // Not multicolored
      numberline.setColorState(false)
    }

    // START HERE BY ADDING LOGIC FROM THE DRAGGER CENTER FUNCTIONS TO SYNCH WITH PAN REGION POINTER MOVEMENTS
    //app.stage.addChild(draggerCenter)
    

    numberline.draw(numberline.min,numberline.max)
    numberline.interactive = true

    let minCompression = Math.min(numberline.compressionOne,numberline.compressionTwo)
    let maxCompression = Math.max(numberline.compressionOne,numberline.compressionTwo)
    dragger.x = numberline.getNumberLinePositionFromFloatValue(minCompression)
    draggerMin.x = numberline.getNumberLinePositionFromFloatValue(maxCompression)

  }

  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);
  // app.resizable = true




};
