import * as PIXI from "pixi.js";
import blueGradient from "../assets/Clouds.png";
import spaceGround from "../assets/SpaceGround.png";
import CheckMark from "../assets/CheckMark.png";

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
  Draggable,
  HorizontalNumberLine,
  VerticalNumberLine,
  Strip,
  rangeBubbleSelector,
  RangeBubbleSelector,
  MathFactPrompt,
  NumberBubble,
  BrickGrid,
  digitCount
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
  let NUMBER_LINE_WIDTH = WINDOW_WIDTH * 0.8;
  let SLIDER_DIM = NUMBER_LINE_WIDTH / 15;
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
  let whiskers = new PIXI.Graphics()

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


  function drawWhiskers(x,y){
    let d = slider.height/2
    whiskers.clear()
    whiskers.lineStyle(2,0x000000)
    whiskers.moveTo(x-d,y)
    whiskers.lineTo(vnumberline.x,y)
    whiskers.moveTo(x,y+d)
    whiskers.lineTo(x,hnumberline.y)
    app.stage.addChild(whiskers)
  }

  function sliderPointerDown() {
    whiskers.alpha = 1
  }

  function sliderPointerMove(e) {
    if (this.touching) {
      console.log(
        "hello"
      )
    
      drawWhiskers(this.x,this.y)
    }

  }
  


  function sliderPointerUp() {
    let _x = this.x - hnumberline.x
    let _y = vnumberline.y - this.y
    console.log('_x,_y',_x,_y)
    let roundedX = hnumberline.roundPositionToNearestTick(_x)
    let roundedY = vnumberline.roundPositionToNearestTick(_y)
    let vX = hnumberline.getNumberLineFloatValueFromPosition(roundedX)
    let vY = vnumberline.getNumberLineFloatValueFromPosition(roundedY)

    vX = Math.round(vX/(hnumberline.minorStep))*hnumberline.minorStep
    vY = Math.round(vY/(vnumberline.minorStep))*vnumberline.minorStep



    if (hnumberline.minorStep < 1){
      let c = digitCount(hnumberline.minorStep) - 1
      vX = vX.toFixed(c)
      vY = vY.toFixed(c)
    }

    this.x = hnumberline.x+roundedX 
    this.y = vnumberline.y-roundedY

    whiskers.alpha = 0

    const config = {
      xNumerator: Math.round(vX/0.1),
      xDenominator: Math.round(1/vnumberline.minorStep),
      yNumerator: Math.round(vY/0.1),
      yDenominator: Math.round(1/hnumberline.minorStep),
      oneDim: hnumberline.getOne()
    }


    brickGrid.draw(config)

    console.log("config vs brickvconfig",config,brickGrid.config)

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

    submitButton = new PIXI.Sprite.from(BUTTONS.HOME);
    submitButton.width = HOME_BUTTON_WIDTH;
    submitButton.height = HOME_BUTTON_WIDTH;
    submitButton.x = HOME_BUTTON_WIDTH / 4;
    submitButton.y = HOME_BUTTON_WIDTH / 4;
    submitButton.interactive = true;
    submitButton.on("pointerdown", () => app.goHome());
    app.stage.addChild(submitButton);

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

    slider = new Draggable(PURE_GLASS_BUBBLE_TEXTURE);
    slider.anchor.set(0.5);
    slider.maxX = rangeBubbleSelector.x + rangeBubbleSelector._width;
    slider.minX = rangeBubbleSelector.x;
    slider.interactive = true;

    slider.width = SLIDER_DIM/2;
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
    hnumberline.y = 0.9 * WINDOW_HEIGHT;
    app.stage.addChild(hnumberline);

    vnumberline = new VerticalNumberLine(0, 3.5, width, app);
    vnumberline.draw(0, 3.2);
    vnumberline.x = WINDOW_WIDTH / 2 - width / 2;
    vnumberline.y = 0.9 * WINDOW_HEIGHT;
    app.stage.addChild(vnumberline);

    vnumberline.onUpdate = () => {
      let { min, max } = vnumberline;
      hnumberline.draw(min, max);
      let one = vnumberline.getOne();
      brickGrid.resize(one);
      slider.x = hnumberline.x + brickGrid.width
      slider.y = vnumberline.y - brickGrid.height
    };

    hnumberline.onUpdate = () => {
      let { min, max } = hnumberline;
      vnumberline.draw(min, max);
      let one = vnumberline.getOne();
      brickGrid.resize(one);
      slider.x = hnumberline.x + brickGrid.width
      slider.y = vnumberline.y - brickGrid.height
    };

    hnumberline.onUpdateComplete = () => {
      brickGrid.draw(brickGrid.config);
      let one = hnumberline.getOne();
      brickGrid.resize(one);
      drawWhiskers(slider.x,slider.y)
    };

    vnumberline.onUpdateComplete = () => {
      brickGrid.draw(brickGrid.config);
      let one = vnumberline.getOne();
      brickGrid.resize(one);
      drawWhiskers(slider.x,slider.y)
    };

    const brickGridConfig = {
      xNumerator: 10,
      xDenominator: 10,
      yNumerator: 10,
      yDenominator: 10,
      oneDim: hnumberline.getOne(),
    };

    brickGrid = new BrickGrid(brickGridConfig, app);
    brickGrid.x = vnumberline.x;
    brickGrid.y = vnumberline.y;
    app.stage.addChild(brickGrid);

    slider.x = hnumberline.x + brickGrid.width
    slider.y = vnumberline.y - brickGrid.height


    hnumberline.setBoundaries(-1,5.5,1)
    vnumberline.setBoundaries(-1,5.5,1)
  }

  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);
  // app.resizable = true
};
