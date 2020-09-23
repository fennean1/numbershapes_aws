import * as PIXI from "pixi.js";
import blueGradient from "../assets/blue-gradient.png";
import plusButton from "../assets/PlusButton.png";
import minusButton from "../assets/MinusButton.png";
import spaceGround from "../assets/SpaceGround.png";
import CheckMark from "../assets/CheckMark.png";
import * as CONST from "./const.js";
import {
  Draggable,
  HorizontalNumberLine,
  VerticalNumberLine,
  Strip,
  rangeBubbleSelector,
  RangeBubbleSelector,
  MathFactPrompt,
  NumberBubble,
  BrickGrid,
  digitCount,
} from "./api_kh.js";
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
import * as PROBLEM_SETS from "./problemSets.js";

export const init = (app, setup) => {
  let features = {};
  let viewPort = new PIXI.Container();
  let backGround;
  let submitButton;
  let checkMark;
  let lineUp = new PIXI.Graphics();

  // CONSTANTS
  // Colors
  const NL_COLOR = 0x000000;
  const GREY = 0xa6a6a6;

  // Textures
  const PURE_GLASS_BUBBLE_TEXTURE = new PIXI.Texture.from(
    CONST.ASSETS.PURE_GLASS_BUBBLE
  );

  // Problem Set
  const problemSet = PROBLEM_SETS.BBS_ADDITION_IN_100;
  let problemNumber = 1;
  let currentProblem = problemSet[problemNumber];

  // Layout Parameters
  let WINDOW_WIDTH = setup.width;
  let WINDOW_HEIGHT = setup.height;
  let HOME_BUTTON_WIDTH = WINDOW_WIDTH / 15;
  let H_W_RATIO = setup.height / setup.width;
  let NUMBER_LINE_WIDTH = Math.max(WINDOW_WIDTH, WINDOW_HEIGHT) * 0.8;
  let SLIDER_DIM = NUMBER_LINE_WIDTH / 8;
  let SELECTOR_Y = (2 / 3) * WINDOW_HEIGHT;


  const SLIDER_START = {
    x: WINDOW_WIDTH / 2,
    y: SELECTOR_Y + 2 * SLIDER_DIM,
  };

  backGround = new makeBackground();
  app.stage.addChild(backGround.sprite);

  // VARS

  // OBJECTS
  let prompt;
  let rangeBubbleSelector;
  let slider;
  let vnumberline;
  let hnumberline;
  let brickGrid;
  let whiskers = new PIXI.Graphics();

  let incYDenominator = new PIXI.Sprite.from(plusButton);
  incYDenominator.interactive = true;
  incYDenominator.on("pointerdown", inc);
  app.stage.addChild(incYDenominator);
  let decYDenominator = new PIXI.Sprite.from(minusButton);
  decYDenominator.interactive = true;
  decYDenominator.on("pointerdown", inc);
  app.stage.addChild(decYDenominator);
  let incXDenominator = new PIXI.Sprite.from(plusButton);
  incXDenominator.interactive = true;
  incXDenominator.on("pointerdown", inc);
  app.stage.addChild(incXDenominator);
  let decXDenominator = new PIXI.Sprite.from(minusButton);
  decXDenominator.interactive = true;
  decXDenominator.on("pointerdown", inc);
  app.stage.addChild(decXDenominator);

  function inc() {

    console.log('incing')

    switch (this) {
      case incYDenominator:
        if (vnumberline.denominator < 12){
          vnumberline.denominator = vnumberline.denominator+1
        } else {
          console.log("incY failed")
        }
        break;
      case decYDenominator:
        if (vnumberline.denominator > 1){
          vnumberline.denominator = vnumberline.denominator-1
        }else {
          console.log("decY failed")
        }
        break;
      case incXDenominator:
        if (hnumberline.denominator < 12){
          hnumberline.denominator = hnumberline.denominator+1
        }else {
          console.log("incX failed")
        }
        break;
      case decXDenominator:
        if (hnumberline.denominator > 1){
         hnumberline.denominator = hnumberline.denominator-1
        }else {
          console.log("decX failed")
        }
        break;
      default:
        console.log("Oops! That object does not exist.");
    }

    if (hnumberline.denominator == 10){
      hnumberline.fractionTicks = false
    } else {
      hnumberline.fractionTicks = true
    }

    if (vnumberline.denominator == 10){
      vnumberline.fractionTicks = false
    } else {
      vnumberline.fractionTicks = true
    }

    let {minFloat,maxFloat}  = hnumberline

    hnumberline.draw(minFloat,maxFloat)
    vnumberline.draw(minFloat,maxFloat)


    /*

    let xParts = brickGrid.config.xNumerator%brickGrid.config.xDenominator
    let wholeXs = (brickGrid.config.xNumerator - xParts)/brickGrid.config.xDenominator

    let yParts = brickGrid.config.yNumerator%brickGrid.config.yDenominator
    let wholeYs = (brickGrid.config.yNumerator - yParts)/brickGrid.config.yDenominator

    let newXNumerator = wholeXs*hnumberline.denominator + xParts 
    let newYNumerator = wholeYs*vnumberline.denominator + yParts 

    const config = {
      xNumerator: newXNumerator,
      xDenominator: hnumberline.denominator,
      yNumerator: newYNumerator,
      yDenominator: vnumberline.denominator,
      oneDim: brickGrid.config.oneDim,
    };

    //brickGrid.draw(config)
    //brickGrid.resize(config.oneDim)

    slider.x = hnumberline.x + brickGrid.width
    slider.y = vnumberline.y - brickGrid.height

    */
  }

  // Called on resize
  function resize(newFrame, flex) {
    // Make sure all layout parameters are up to date.
    updateLayoutParams(newFrame);
    app.renderer.resize(WINDOW_WIDTH, WINDOW_HEIGHT);
  }

  // Constructors
  function makeBackground() {
    // Setup Background
    let backGroundGraphics = new PIXI.Graphics();
    backGroundGraphics.beginFill(0xffffff);
    backGroundGraphics.drawRoundedRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    this.sprite = new PIXI.Sprite.from(blueGradient);
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

  function updateLayoutParams(newFrame) {
    let frame;
    if (newFrame) {
      frame = newFrame;
    } else {
      frame = { width: WINDOW_WIDTH, height: WINDOW_HEIGHT };
    }
  }

  function onSubmitAnswer() {
    const onComplete = () => {
      nextProblem();
    };

    let timeline = new TimelineLite({ paused: true });
    let targetX = rangeBubbleSelector.getPositionFromValue(
      currentProblem.TARGET
    );
    timeline.to(prompt, {
      x: rangeBubbleSelector.x + targetX - prompt.width / 2,
    });

    console.log("targets", currentProblem.MIN, currentProblem.TARGET);

    let target =
      Math.round(rangeBubbleSelector.leftStripGraphic.value) +
      Math.round(currentProblem.MIN);

    console.log("target", target);

    if (target == currentProblem.TARGET) {
      timeline.to(slider, { y: prompt.y + prompt.height / 2 });
      timeline.to(slider, {
        width: prompt.height * 1.2,
        height: prompt.height * 1.2,
        ease: "bounce",
      });
      timeline.to(slider, {
        width: prompt.height,
        height: prompt.height,
        ease: "bounce",
        onComplete: onComplete,
      });
    } else {
      timeline.to(slider, {
        y: prompt.y + prompt.height / 2,
        onComplete: onComplete,
      });
    }

    timeline.play();

    TweenLite.to(checkMark, { duration: 0.5, alpha: 0 });
  }

  function drawWhiskers(x, y) {
    let d = slider.height / 2;
    whiskers.clear();
    whiskers.lineStyle(2, 0x000000);
    whiskers._fillStyle.alpha = 0.1;
    whiskers.moveTo(x - d, y);
    whiskers.lineTo(vnumberline.x, y);
    whiskers.moveTo(x, y + d);
    whiskers.lineTo(x, hnumberline.y);
    app.stage.addChild(whiskers);
  }

  function sliderPointerDown() {
    whiskers.alpha = 1;
  }

  function sliderPointerMove(e) {
    if (this.touching) {
      drawWhiskers(this.x, this.y);
    }
  }

  function sliderPointerUp() {

    let one = hnumberline.getOne();

    let _x = this.x - hnumberline.x;
    let _y = vnumberline.y - this.y;

    let vX = hnumberline.getNumberLineFloatValueFromPosition(_x);
    let vY = vnumberline.getNumberLineFloatValueFromPosition(_y);

    let _xD = hnumberline.denominator;
    let _yD = vnumberline.denominator;
    let _xN = Math.round(vX * _xD);
    let _yN = Math.round(vY * _yD);

    let _xPos = (one * _xN) / _xD;
    let _yPos = (one * _yN) / _yD;

    this.x = hnumberline.x + _xPos;
    this.y = vnumberline.y - _yPos;


    vX = Math.round(vX / hnumberline.minorStep) * hnumberline.minorStep;
    vY = Math.round(vY / vnumberline.minorStep) * vnumberline.minorStep;

    const config = {
      xNumerator: Math.round(vX * hnumberline.denominator),
      xDenominator: hnumberline.denominator,
      yNumerator: Math.round(vY * vnumberline.denominator),
      yDenominator: vnumberline.denominator,
      oneDim: one,
    };

    brickGrid.draw(config);
    brickGrid.resize(one);

    whiskers.alpha = 0;

  }

  function nextProblem() {
    problemNumber++;
    currentProblem = problemSet[problemNumber]
      ? problemSet[problemNumber]
      : false;
    if (currentProblem) {
      rangeBubbleSelector.loadProblem(currentProblem);
      prompt.lblText = currentProblem.TARGET;
    } else {
      problemNumber = 1;
      currentProblem = problemSet[problemNumber];
      rangeBubbleSelector.loadProblem(currentProblem);
      prompt.lblText = currentProblem.TARGET;
    }

    let sliderX =
      rangeBubbleSelector.leftStripGraphic.width + rangeBubbleSelector.x;

    TweenLite.to(slider, { x: sliderX, y: SLIDER_START.y, duration: 1 });
    TweenLite.to(prompt, { x: SLIDER_START.x - prompt.width / 2, duration: 1 });
    TweenLite.to(lineUp, { x: sliderX, duration: 1 });
  }

  // Loading Script
  function load() {
    if (setup.props.features) {
      features = setup.props.features;
    }

    rangeBubbleSelector = new RangeBubbleSelector(
      0.8 * WINDOW_WIDTH,
      currentProblem.MIN,
      currentProblem.MAX,
      currentProblem.PARTITIONS,
      currentProblem.TARGET,
      1,
      app
    );
    rangeBubbleSelector.y = (2 / 3) * WINDOW_HEIGHT;
    rangeBubbleSelector.x = WINDOW_WIDTH / 2 - rangeBubbleSelector._width / 2;
    rangeBubbleSelector.drawStrips(rangeBubbleSelector._width / 2);

    //app.stage.addChild(rangeBubbleSelector);

    let sliderGraphics = new PIXI.Graphics();
    sliderGraphics.beginFill(0x000000);
    sliderGraphics.drawCircle(0, 0, SLIDER_DIM);
    let sliderGraphicsTexture = app.renderer.generateTexture(sliderGraphics);

    slider = new Draggable();
    slider.texture = sliderGraphicsTexture;
    slider.anchor.set(0.5);
    slider.alpha = 0.5;
    slider.hitArea = new PIXI.Circle(0, 0, SLIDER_DIM * 4, SLIDER_DIM * 4);
    console.log("sliderhit", slider.hitArea);
    slider.maxX = rangeBubbleSelector.x + rangeBubbleSelector._width;
    slider.minX = rangeBubbleSelector.x;
    slider.interactive = true;

    slider.width = SLIDER_DIM / 4;
    slider.height = slider.width;
    slider.y = rangeBubbleSelector.y + 2 * slider.height;
    slider.x = rangeBubbleSelector.x + rangeBubbleSelector._width / 2;
    app.stage.addChild(slider);

    slider.on("pointerdown", sliderPointerDown);
    slider.on("pointermove", sliderPointerMove);
    slider.on("pointerup", sliderPointerUp);
    slider.on("pointerupoutside", sliderPointerUp);

    checkMark = new PIXI.Sprite.from(CheckMark);
    checkMark.width = slider.width;
    checkMark.height = checkMark.width;
    checkMark.interactive = true;
    checkMark.anchor.set(0.5);
    checkMark.alpha = 0;
    checkMark.x = slider.x;
    checkMark.y = rangeBubbleSelector.y - 2 * checkMark.height;
    //app.stage.addChild(checkMark);
    checkMark.on("pointerdown", onSubmitAnswer);

    lineUp.lineStyle(2, GREY);
    lineUp.lineTo(0, slider.y - slider.height / 2 - SELECTOR_Y);
    //app.stage.addChild(lineUp)
    lineUp.x = slider.x;
    lineUp.y = SELECTOR_Y;

    const numberBubbleConfig = {
      text: 456,
      width: SLIDER_DIM,
    };

    prompt = new NumberBubble(numberBubbleConfig);
    prompt.x = WINDOW_WIDTH / 2 - prompt.width / 2;
    prompt.y = (1 / 4) * WINDOW_HEIGHT;
    prompt.lblText = currentProblem.TARGET;
    //app.stage.addChild(prompt);

    let width = 0.8 * Math.min(WINDOW_WIDTH, WINDOW_HEIGHT);

    hnumberline = new HorizontalNumberLine(0, 3.5, width, app);
    hnumberline.draw(0, 3.2);
    hnumberline.x = WINDOW_WIDTH / 2 - width / 2;
    hnumberline.y = WINDOW_HEIGHT / 2 + width / 2;
    app.stage.addChild(hnumberline);

    vnumberline = new VerticalNumberLine(0, 3.5, width, app);
    vnumberline.draw(0, 3.2);
    vnumberline.x = WINDOW_WIDTH / 2 - width / 2;
    vnumberline.y = WINDOW_HEIGHT / 2 + width / 2;
    app.stage.addChild(vnumberline);

    vnumberline.onUpdate = () => {
      let { min, max } = vnumberline;
      hnumberline.draw(min, max);
      let one = vnumberline.getOne();
      brickGrid.resize(one);
      slider.x = hnumberline.x + brickGrid.width;
      slider.y = vnumberline.y - brickGrid.height;
    };

    hnumberline.onUpdate = () => {
      let { min, max } = hnumberline;
      vnumberline.draw(min, max);
      let one = vnumberline.getOne();
      brickGrid.resize(one);
      slider.x = hnumberline.x + brickGrid.width;
      slider.y = vnumberline.y - brickGrid.height;
    };

    hnumberline.onUpdateComplete = () => {
      brickGrid.draw(brickGrid.config);
      let one = hnumberline.getOne();
      brickGrid.resize(one);
      drawWhiskers(slider.x, slider.y);
    };

    vnumberline.onUpdateComplete = () => {
      brickGrid.draw(brickGrid.config);
      let one = vnumberline.getOne();
      brickGrid.resize(one);
      drawWhiskers(slider.x, slider.y);
    };

    vnumberline.fractionTicks = true;
    vnumberline.denominator = 3;

    hnumberline.fractionTicks = true;
    hnumberline.denominator = 3;

    hnumberline.setBoundaries(-1, 5.5, 1);
    vnumberline.setBoundaries(-1, 5.5, 1);

    hnumberline.draw(0, 3.2);
    vnumberline.draw(0, 3.2);

    const brickGridConfig = {
      xNumerator: hnumberline.denominator,
      xDenominator: hnumberline.denominator,
      yNumerator: vnumberline.denominator,
      yDenominator: vnumberline.denominator,
      oneDim: hnumberline.getOne(),
    };

    brickGrid = new BrickGrid(brickGridConfig, app);
    brickGrid.x = vnumberline.x;
    brickGrid.y = vnumberline.y;
    app.stage.addChild(brickGrid);

    slider.x = hnumberline.x + brickGrid.width;
    slider.y = vnumberline.y - brickGrid.height;

    let incDim = SLIDER_DIM/3.5

    incYDenominator.width = incDim
    incYDenominator.height = incDim
    incYDenominator.x = vnumberline.x 
    incYDenominator.y = vnumberline.y - vnumberline.length - incDim

    decYDenominator.width = incDim
    decYDenominator.height = incDim
    decYDenominator.x = vnumberline.x - incDim
    decYDenominator.y = vnumberline.y - vnumberline.length - incDim

    incXDenominator.width = incDim 
    incXDenominator.height = incDim 
    incXDenominator.x = hnumberline.x + hnumberline.length
    incXDenominator.y = hnumberline.y - incDim

    decXDenominator.width = incDim 
    decXDenominator.height = incDim 
    decXDenominator.x = hnumberline.x + hnumberline.length 
    decXDenominator.y = hnumberline.y

    app.stage.addChild(incYDenominator);
    app.stage.addChild(decYDenominator);
    app.stage.addChild(incXDenominator);
    app.stage.addChild(decXDenominator);

  }

  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);
  // app.resizable = true
};
