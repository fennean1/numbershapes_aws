import * as PIXI from "pixi.js";
import blueGradient from "../assets/Clouds.png";
import spaceGround from "../assets/SpaceGround.png";
import spaceShipWindow from "../assets/SpaceShipWindow.png";
import nightBackground from "../assets/NightBackground.png";
import pinkPin from "../assets/PinkPin.png";
import greyPin from "../assets/Pin.png";
import {
  BLUE,
  RED,
  GREEN,
  ORANGE,
  PURPLE,
  PINK,
  NUMERAL,
  BALLS,
  BUTTONS,
} from "../AssetManager.js";
import * as CONST from "./const.js";
import {
  Fraction,
  Draggable,
  distance,
  FractionFrame,
  UltimateNumberLine,
  NumberLine,
} from "./api.js";
import { HorizontalNumberLine, NumberLineEstimator, MathFactPrompt, VPAdditionStrips } from "./api_kh.js";
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
import * as PROBLEM_SETS from "./problemSets.js"

export const init = (app, setup) => {
  let features = {}
  let viewPort = new PIXI.Container();
  let backGround;
  let homeButton;
  let ground;
  let ultimateNumberLine;
  let pins = [];
  let additionProof = {}


  // CONSTANTS

  // Colors
  const NL_COLOR = 0x000000;

  // Textures
  const MOVER_DOT = new PIXI.Texture.from(CONST.ASSETS.MOVER_DOT);
  const SPACE_SHIP_WINDOW = new PIXI.Texture.from(spaceShipWindow);
  const PIN_TEXTURE_2 = new PIXI.Texture.from(CONST.ASSETS.BLUE_SPACE_SHIP);
  const PIN_TEXTURE = new PIXI.Texture.from(pinkPin);
  const BLUE_CIRCLE = new PIXI.Texture.from(CONST.ASSETS.STAR);
  const SHARP_PIN_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.SHARP_PIN);
  const GREY_PIN_TEXTURE = new PIXI.Texture.from(greyPin);

  // Problem Set
  const problemSet = PROBLEM_SETS.EST_ADDITION_IN_100
  let problemNumber = 1
  let currentProblem = problemSet[problemNumber]


  // Layout Parameters
  let WINDOW_WIDTH = setup.width;
  let WINDOW_HEIGHT = setup.height;
  let HOME_BUTTON_WIDTH = WINDOW_WIDTH / 15;
  let H_W_RATIO = setup.height / setup.width;
  let NUMBER_LINE_WIDTH = WINDOW_WIDTH;
  let NUMBER_LINE_Y = (5 / 8) * WINDOW_HEIGHT;
  let DRAGGER_Y = NUMBER_LINE_Y;

  backGround = new makeBackground();
  app.stage.addChild(backGround.sprite)
  ground = new makeGround();


  // VARS 

  // OBJECTS
  let numberline;
  let prompt;
  let numberlineEstimator;


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

  let dragger = new Draggable(PIN_TEXTURE);
  dragger.lockY = true;
  dragger.anchor.x = 0.5;
  dragger.interactive = true;
  dragger.val = 0;
  dragger.anchorPoint = dragger.x;
  dragger.y = WINDOW_HEIGHT - dragger.height;
  dragger.x = WINDOW_WIDTH / 2;

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

  dragger.on("pointermove", draggerPointerMove);
  dragger.on("pointerdown", draggerPointerDown);
  dragger.on("pointerup", draggerPointerUp);
  dragger.on("pointerupoutside", draggerPointerUp);

  backGround.sprite.on("pointermove", panRegionDownPointerMove);
  backGround.sprite.on("pointerdown", panRegionDownPointerDown);
  backGround.sprite.on("pointerup", panRegionDownPointerUp);
  backGround.sprite.on("pointerupoutside", panRegionDownPointerUp);

  function dropPin(x) {
    let newPin = new Draggable(GREY_PIN_TEXTURE);
    newPin.on("pointerup", pinPointerUp);
    newPin.on("pointerupoutside", pinPointerUp);
    newPin.anchor.x = 0.5;
    newPin.width = WINDOW_WIDTH / 20;
    newPin.height = newPin.width * 3.2;
    let roundedX = ultimateNumberLine.roundPositionToNearestTick(x);
    newPin.value = ultimateNumberLine.getNumberLineFloatValueFromPosition(
      roundedX
    );
    newPin.x = roundedX;
    let targetY = ultimateNumberLine.y - newPin.height;
    newPin.originalY = targetY;
    pins.push(newPin);

    TweenLite.to(newPin, { duration: 1, y: targetY, ease: "bounce" });
    app.stage.addChild(newPin);
  }

  function pinPointerUp() {
    if (this.y <= 0.2 * ultimateNumberLine.y) {
      const onComplete = () => {
        app.stage.removeChild(this);
      };
      TweenLite.to(this, { y: -this.height, onComplete: onComplete });
    } else {
      let _x = ultimateNumberLine.roundPositionToNearestTick(this.x);
      this.value = ultimateNumberLine.getNumberLineFloatValueFromPosition(_x);
      TweenLite.to(this, {
        duration: 1,
        x: _x,
        y: this.originalY,
        ease: "bounce",
      });
    }
  }

  function panRegionDownPointerDown(e) {
    this.touching = true;
    this.anchorPoint = e.data.global.x;
    this.initialNumberlineMin = ultimateNumberLine.minFloat;
    this.initialNumberlineMax = ultimateNumberLine.maxFloat;
  }

  function panRegionDownPointerMove(e) {
    if (this.touching) {
      let x = e.data.global.x;
      let x1 = ultimateNumberLine.getNumberLineFloatValueFromPosition(x);
      let x2 = ultimateNumberLine.getNumberLineFloatValueFromPosition(
        this.anchorPoint
      );
      let delta = x2 - x1;
      let _min = this.initialNumberlineMin + delta;
      let _max = this.initialNumberlineMax + delta;
      ultimateNumberLine.draw(_min, _max);

      pins.forEach((p) => {
        p.x = ultimateNumberLine.getNumberLinePositionFromFloatValue(p.value);
      });

      dragger.x = ultimateNumberLine.getNumberLinePositionFromFloatValue(
        dragger.val
      );

      if (dragger.x < 0) {
        dragger.x = 0;
        dragger.val = ultimateNumberLine.getNumberLineFloatValueFromPosition(0);
      } else if (dragger.x > WINDOW_WIDTH) {
        dragger.x = WINDOW_WIDTH;
        dragger.val = ultimateNumberLine.getNumberLineFloatValueFromPosition(
          WINDOW_WIDTH
        );
      }
    }
  }

  function panRegionDownPointerUp(e) {
    this.touching = false;

    if (dragger.x <= 0) {
      dragger.x = ultimateNumberLine.roundPositionUpToNearestTick(0);
      dragger.val = ultimateNumberLine.getNumberLineFloatValueFromPosition(
        dragger.x
      );
    } else if (dragger.x >= WINDOW_WIDTH) {
      dragger.x = ultimateNumberLine.roundPositionDownToNearestTick(
        WINDOW_WIDTH
      );
      dragger.val = ultimateNumberLine.getNumberLineFloatValueFromPosition(
        dragger.x
      );
    } else {
      dragger.x = ultimateNumberLine.getNumberLinePositionFromFloatValue(
        dragger.val
      );
    }

    ultimateNumberLine.flexPoint = dragger.val;
  }

  // D_POINTER_MOVE
  function draggerPointerMove() {}

  function draggerPointerDown() {}

  function draggerPointerUp(e) {
    let roundedX = ultimateNumberLine.roundPositionToNearestTick(this.x);
    ultimateNumberLine.flexPoint = ultimateNumberLine.getNumberLineFloatValueFromPosition(
      roundedX
    );
    this.val = ultimateNumberLine.getNumberLineFloatValueFromPosition(roundedX);
    this.x = roundedX;
  }

  // Constructors
  function makeBackground() {
    // Setup Background
    let backGroundGraphics = new PIXI.Graphics();
    backGroundGraphics.beginFill(0xffffff);
    backGroundGraphics.drawRoundedRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
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

  // Numberline A
  function numberlinePointerDown(e) {
    this.moved = false;
    this.touching = true;
  }

  function numberlinePointerMove(e) {
    if (this.touching) {
      this.moved = true;
      /*
      pins.forEach((p) => {
        p.x = ultimateNumberLine.getNumberLinePositionFromFloatValue(p.value);
      });
      */
    }
  }

  function nextProblem(){
    //additionProof.prepareFeedback(currentProblem.FIRST,currentProblem.SECOND)
    problemNumber++
    currentProblem = problemSet[problemNumber] ? problemSet[problemNumber] : false 
    if (currentProblem){
      numberlineEstimator.nextProblem(currentProblem)
      prompt.nextProblem(currentProblem)
    } else {
      problemNumber = 1
      currentProblem = problemSet[problemNumber]
      numberlineEstimator.nextProblem(currentProblem)
      prompt.nextProblem(currentProblem)
    }
    //additionProof.play()
  }

  function numberlinePointerUp(e) {
    let x = e.data.getLocalPosition(this).x;
    if (!this.moved) {
      dropPin(x);
    }
  }

  // Loading Script
  function load() {
    if (setup.props.features) {
      features = setup.props.features;
    }

    

    app.stage.interactive = true;

    ultimateNumberLine = new HorizontalNumberLine(
      -22,
      22,
      NUMBER_LINE_WIDTH,
      app
    );
    ultimateNumberLine.setBoundaries(-100000, 100000, 0.005);
    ultimateNumberLine.x = 0;
    ultimateNumberLine.y = NUMBER_LINE_Y;
    //app.stage.addChild(ultimateNumberLine);
    ultimateNumberLine.on("pointerdown", numberlinePointerDown);
    ultimateNumberLine.on("pointermove", numberlinePointerMove);
    ultimateNumberLine.on("pointerup", numberlinePointerUp);

    homeButton = new PIXI.Sprite.from(BUTTONS.HOME);
    homeButton.width = HOME_BUTTON_WIDTH;
    homeButton.height = HOME_BUTTON_WIDTH;
    homeButton.x = HOME_BUTTON_WIDTH / 4;
    homeButton.y = HOME_BUTTON_WIDTH / 4;
    homeButton.interactive = true;
    homeButton.on("pointerdown", () => app.goHome());
    app.stage.addChild(homeButton);

    numberlineEstimator = new NumberLineEstimator(0.8*WINDOW_WIDTH,currentProblem.MIN,currentProblem.MAX,currentProblem.PARTITIONS,currentProblem.TARGET,1,app)
    app.stage.addChild(numberlineEstimator)
    numberlineEstimator.y = 2/3*WINDOW_HEIGHT
    numberlineEstimator.x = WINDOW_WIDTH/2  - numberlineEstimator._width/2
    numberlineEstimator.onComplete = nextProblem

    prompt = new MathFactPrompt(problemSet)
    prompt.Height = Math.min(WINDOW_HEIGHT,WINDOW_WIDTH)/20
    prompt.x = WINDOW_WIDTH/2 - prompt.width/2
    prompt.y = 1/4*WINDOW_HEIGHT
    app.stage.addChild(prompt)

    //app.stage.addChild(panRegionDown)

    dragger.height = WINDOW_HEIGHT - NUMBER_LINE_Y - ultimateNumberLine.height;
    dragger.width = dragger.height * 0.31;
    dragger.y = NUMBER_LINE_Y + ultimateNumberLine.height;
    dragger.x = WINDOW_WIDTH / 2;


    const vpConfig = {
      height: numberlineEstimator.stripHeight,
      aColor: 0x4287f5,
      bColor: 0xfc035a,
      pixelsPerUnit: numberlineEstimator._width/numberlineEstimator.range
    }

    additionProof = new VPAdditionStrips(30,40,vpConfig)
    additionProof.x = numberlineEstimator.x
    additionProof.y = numberlineEstimator.y - vpConfig.height
    app.stage.addChild(additionProof)

  }

  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);
  // app.resizable = true
};
