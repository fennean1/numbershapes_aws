import * as PIXI from "pixi.js-legacy";
import blueGradient from "../assets/blue-gradient.png";
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
  Strip,
  RangeBubbleSelector,
  MathFactPrompt,
  NumberBubble,
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

    console.log("targets",currentProblem.MIN, currentProblem.TARGET)

    let target = Math.round(rangeBubbleSelector.leftStripGraphic.value)+Math.round(currentProblem.MIN)

    console.log("target",target)

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
      timeline.to(slider, { y: prompt.y + prompt.height / 2,onComplete: onComplete });

    }

    timeline.play();

    TweenLite.to(checkMark, { duration: 0.5, alpha: 0 });
  }

  function sliderPointerDown() {
    checkMark.alpha = 0;
    //rangeBubbleSelector.leftStripGraphic.label.alpha = 0
    //rangeBubbleSelector.rightStripGraphic.label.alpha = 0
  }

  function sliderPointerMove(e) {
    if (this.touching) {
      rangeBubbleSelector.drawStrips(this.x - rangeBubbleSelector.x);
      checkMark.x = this.x;
      lineUp.x = this.x
    }
  }

  function sliderPointerUp() {
    checkMark.alpha = 1;
    //rangeBubbleSelector.leftStripGraphic.label.alpha = 1
    //rangeBubbleSelector.rightStripGraphic.label.alpha = 1
    rangeBubbleSelector.roundStrips(slider);
    rangeBubbleSelector.roundStrips(checkMark);
    rangeBubbleSelector.roundStrips(lineUp);
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

    let sliderX = rangeBubbleSelector.leftStripGraphic.width + rangeBubbleSelector.x

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

    app.stage.addChild(rangeBubbleSelector);

    slider = new Draggable(PURE_GLASS_BUBBLE_TEXTURE);
    slider.anchor.set(0.5);
    slider.lockY = true;
    slider.maxX = rangeBubbleSelector.x + rangeBubbleSelector._width;
    slider.minX = rangeBubbleSelector.x;
    slider.interactive = true;


    slider.width = SLIDER_DIM
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
    app.stage.addChild(checkMark);
    checkMark.on("pointerdown", onSubmitAnswer);


    lineUp.lineStyle(2,GREY)
    lineUp.lineTo(0,(slider.y - slider.height/2)-SELECTOR_Y)
    app.stage.addChild(lineUp)
    lineUp.x = slider.x
    lineUp.y = SELECTOR_Y

    const numberBubbleConfig = {
      text: 456,
      width: SLIDER_DIM,
    };

    prompt = new NumberBubble(numberBubbleConfig);
    prompt.x = WINDOW_WIDTH / 2 - prompt.width / 2;
    prompt.y = (1 / 4) * WINDOW_HEIGHT;
    prompt.lblText = currentProblem.TARGET;
    app.stage.addChild(prompt);
  }

  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);
  // app.resizable = true
};
