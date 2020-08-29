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
import { snap } from "gsap/gsap-core";
import Apps from "../Apps";

export const init = (app, setup) => {
  let features = {}
  let viewPort = new PIXI.Container();
  let snapIndicator = new PIXI.Graphics()
  let backGround;
  let homeButton;
  let ground;
  let numberlineA;
  let numberlineB;
  let pins = [];

  const NL_COLOR = 0x000000;
  const MOVER_DOT = new PIXI.Texture.from(CONST.ASSETS.MOVER_DOT);
  const SPACE_SHIP_WINDOW = new PIXI.Texture.from(spaceShipWindow);
  const PIN_TEXTURE_2 = new PIXI.Texture.from(CONST.ASSETS.BLUE_SPACE_SHIP);
  const PIN_TEXTURE = new PIXI.Texture.from(pinkPin);
  const BLUE_CIRCLE = new PIXI.Texture.from(CONST.ASSETS.STAR);
  const SHARP_PIN_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.SHARP_PIN);
  const GREY_PIN_TEXTURE = new PIXI.Texture.from(greyPin);

  // Layout Parameters
  let WINDOW_WIDTH = setup.width;
  let WINDOW_HEIGHT = setup.height;
  let HOME_BUTTON_WIDTH = WINDOW_WIDTH / 15;
  let H_W_RATIO = setup.height / setup.width;
  let NUMBER_LINE_WIDTH = WINDOW_WIDTH;
  let NUMBER_LINE_Y = (5 / 8) * WINDOW_HEIGHT;
  let DRAGGER_Y = NUMBER_LINE_Y;

  let focalPoint = { x: 0, y: 0 };

  backGround = new makeBackground();
  ground = new makeGround();

  let numberline;

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
    let roundedX = numberlineA.roundPositionToNearestTick(x);
    newPin.value = numberlineA.getNumberLineFloatValueFromPosition(
      roundedX
    );
    newPin.x = roundedX;
    let targetY = numberlineA.y - newPin.height;
    newPin.originalY = targetY;
    pins.push(newPin);

    TweenLite.to(newPin, { duration: 1, y: targetY, ease: "bounce" });
    app.stage.addChild(newPin);
  }

  function pinPointerUp() {
    if (this.y <= 0.2 * numberlineA.y) {
      const onComplete = () => {
        app.stage.removeChild(this);
      };
      TweenLite.to(this, { y: -this.height, onComplete: onComplete });
    } else {
      let _x = numberlineA.roundPositionToNearestTick(this.x);
      this.value = numberlineA.getNumberLineFloatValueFromPosition(_x);
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


      pins.forEach((p) => {
        p.x = numberlineA.getNumberLinePositionFromFloatValue(p.value);
      });

      dragger.x = numberlineA.getNumberLinePositionFromFloatValue(dragger.val)

      if (dragger.x < 0) {
        dragger.x = 0
        dragger.val = numberlineA.getNumberLineFloatValueFromPosition(0)
      } else if (dragger.x > WINDOW_WIDTH) {
        dragger.x = WINDOW_WIDTH
        dragger.val = numberlineA.getNumberLineFloatValueFromPosition(WINDOW_WIDTH)
      }
    }
  }

  function panRegionDownPointerUp(e) {
    this.touching = false;

    if (dragger.x <= 0) {
      dragger.x = numberlineA.roundPositionUpToNearestTick(0)
      dragger.val = numberlineA.getNumberLineFloatValueFromPosition(dragger.x)
    } else if (dragger.x >= WINDOW_WIDTH) {
      dragger.x = numberlineA.roundPositionDownToNearestTick(WINDOW_WIDTH)
      dragger.val = numberlineA.getNumberLineFloatValueFromPosition(dragger.x)
    } else {
      dragger.x = numberlineA.getNumberLinePositionFromFloatValue(dragger.val)
    }
  
    //numberlineA.numberlineAPoi = dragger.val
  }

  // D_POINTER_MOVE
  function draggerPointerMove() {}

  function draggerPointerDown() {}

  function draggerPointerUp(e) {
    let roundedX = numberlineA.roundPositionToNearestTick(this.x);
    this.val = numberlineA.getNumberLineFloatValueFromPosition(roundedX);
    this.x = roundedX;
  }

  // Constructors
  function makeBackground() {
    // Setup Background
    let backGroundGraphics = new PIXI.Graphics();
    backGroundGraphics.beginFill(0xffffff);
    backGroundGraphics.drawRoundedRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    this.sprite = backGroundGraphics;
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
    numberlineB.pointerVal = numberlineB.getNumberLineFloatValueFromPosition(x)
  }

  function numberlinePointerMove(e) {
    if (this.touching) {
      this.moved = true;
      pins.forEach((p) => {
        p.x = numberlineA.getNumberLinePositionFromFloatValue(p.value);
      });
      let x = e.data.getLocalPosition(this).x
      let bounds = numberlineB.getBoundsFrom(x,numberlineB.pointerVal)
      numberlineB.draw(bounds.min,bounds.max)
    }

  }

  function numberlinePointerUp(e) {
    let x = e.data.getLocalPosition(this).x;
    if (!this.moved) {
      dropPin(x);
    }

     //this.synchLines(numberlineB,x)
  }


  // Numberline B
  function numberlineBPointerDown(e) {

  }

  function numberlineBPointerMove(e) {
    if (this.touching) {
      this.moved = true;
      let x = e.data.getLocalPosition(this).x;
      snapIndicator.x = this.roundPositionToNearestTick(x)
    }
  }

  function numberlineBPointerUp(e) {
    let x = e.data.getLocalPosition(this).x;
    if (!this.moved) {
      // A click only logic here.
    }

    this.synchLines(numberlineA,x)
    let roundedX = this.roundPositionToNearestTick(x)
    snapIndicator.x = roundedX
  }

  // Loading Script
  function load() {
    if (setup.props.features) {
      features = setup.props.features;
    }

    app.stage.interactive = true;


    // NUMBERLINE A
    numberlineA = new UltimateNumberLine(
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
      WINDOW_HEIGHT - NUMBER_LINE_Y
    );


    // NUMBERLINE B
    numberlineB = new UltimateNumberLine(
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

    homeButton = new PIXI.Sprite.from(BUTTONS.HOME);
    homeButton.width = HOME_BUTTON_WIDTH;
    homeButton.height = HOME_BUTTON_WIDTH;
    homeButton.x = HOME_BUTTON_WIDTH / 4;
    homeButton.y = HOME_BUTTON_WIDTH / 4;
    homeButton.interactive = true;
    homeButton.on("pointerdown", () => app.goHome());
    app.stage.addChild(homeButton);

    app.stage.addChild(numberlineA);

    // FEATURES
    if (features.spaceShips) {
      app.stage.addChild(dragger);
      //app.stage.addChild(draggerMin)
      //app.stage.addChild(windowButton)
    }

    // FEATURES
    if (features.spaceBubbles) {
      numberline.nestMe = true;
      // Not multicolored
      numberline.setColorState(false);
    }

    //app.stage.addChild(panRegionDown)

    dragger.height = WINDOW_HEIGHT - NUMBER_LINE_Y - numberlineA.height;
    dragger.width = dragger.height * 0.31;
    dragger.y = NUMBER_LINE_Y + numberlineA.height;
    dragger.x = WINDOW_WIDTH / 2;


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
  }

  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);
  // app.resizable = true
};
