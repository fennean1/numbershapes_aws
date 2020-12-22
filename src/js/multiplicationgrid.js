import * as PIXI from "pixi.js-legacy";
import blueGradient from "../assets/blue-gradient.png";
import plusButton from "../assets/PlusButton.png";
import minusButton from "../assets/MinusButton.png";
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
  BinomialGrid,
  digitCount,
} from "./api_kh.js";
import {
  TweenLite,
} from "gsap";
import * as PROBLEM_SETS from "./problemSets.js";




export const init = (app, setup) => {
  let features = {};
  let viewPort = new PIXI.Container();
  let backGround;
  let lineUp = new PIXI.Graphics();

  // CONSTANTS
  // Colors
  const GREY = 0xa6a6a6;


  const BACKGROUND_TEXTURE = new PIXI.Texture.from(
    blueGradient
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
  let SLIDER_DIM = NUMBER_LINE_WIDTH / 30;
  let SELECTOR_Y = (2 / 3) * WINDOW_HEIGHT;


  const SLIDER_START = {
    x: WINDOW_WIDTH / 2,
    y: SELECTOR_Y + 2 * SLIDER_DIM,
  };



  // VARS

  // OBJECTS
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

    console.log('incrementinging')

    switch (this) {
      case incYDenominator:
        if (vnumberline.denominator < 10){
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
        if (hnumberline.denominator < 10){
          hnumberline.denominator = hnumberline.denominator+1
        }else {
          console.log("incX failed")
        }
        break;
      case decXDenominator:
        if (hnumberline.denominator > 1){
         hnumberline.denominator = hnumberline.denominator-1
        } else {
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


  }



  function updateLayoutParams(newFrame) {
    let frame;
    if (newFrame) {
      frame = newFrame;
    } else {
      frame = { width: WINDOW_WIDTH, height: WINDOW_HEIGHT };
    }
    SLIDER_DIM = Math.min(newFrame.width,newFrame.height)/30
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

    let one = hnumberline.getOne()

    let _x = this.x - hnumberline.x;
    let _y = vnumberline.y - this.y;

    let xNum = Math.round(_x/hnumberline.minorDX)
    let yNum = Math.round(_y/vnumberline.minorDX)

    let vPartitionsPerMajorTick = Math.round(one/vnumberline.minorDX)
    let hPartitionsPerMajorTick = Math.round(one/hnumberline.minorDX)


    let _xPos = (one * xNum) / hPartitionsPerMajorTick;
    let _yPos = (one * yNum) / vPartitionsPerMajorTick;

    this.x = hnumberline.x + _xPos;
    this.y = vnumberline.y - _yPos;

    const config = {
      xNumerator: xNum,
      xDenominator: hPartitionsPerMajorTick,
      yNumerator: yNum,
      yDenominator: vPartitionsPerMajorTick,
      oneDim: one,
    };

    brickGrid.draw(config);
    brickGrid.resize(one);

    whiskers.alpha = 0;

  }


    // Called on resize
    function resize(newFrame) {
      // Make sure all layout parameters are up to date.
      updateLayoutParams(newFrame);
      backGround.width = newFrame.width
      backGround.height = newFrame.height
      app.renderer.resize(newFrame.width, newFrame.height);
  
      let frameDim  = 0.8*Math.min(newFrame.width,newFrame.height)
  
      let adjustedNewFrame = {width: frameDim,height: frameDim}
      vnumberline.redraw(adjustedNewFrame )
      hnumberline.redraw(adjustedNewFrame )

      const numberlineX = newFrame.width/ 2 - frameDim / 2;
      const numberlineY = newFrame.height / 2 + frameDim / 2;
  
      hnumberline.x = numberlineX
      hnumberline.y = numberlineY

      vnumberline.x = numberlineX
      vnumberline.y = numberlineY

      let one = vnumberline.getOne()
      brickGrid.resize(one)
      brickGrid.x = hnumberline.x 
      brickGrid.y = hnumberline.y

      slider.x = hnumberline.x + brickGrid.width;
      slider.y = vnumberline.y - brickGrid.height;
      slider.width = SLIDER_DIM
      slider.height = SLIDER_DIM

      incYDenominator.width = SLIDER_DIM
      incYDenominator.height = SLIDER_DIM
      incYDenominator.x = vnumberline.x 
      incYDenominator.y = vnumberline.y - vnumberline.length - SLIDER_DIM

      decYDenominator.width = SLIDER_DIM
      decYDenominator.height = SLIDER_DIM
      decYDenominator.x = vnumberline.x - SLIDER_DIM
      decYDenominator.y = vnumberline.y - vnumberline.length - SLIDER_DIM
  
      incXDenominator.width = SLIDER_DIM
      incXDenominator.height = SLIDER_DIM
      incXDenominator.x = hnumberline.x + hnumberline.length
      incXDenominator.y = hnumberline.y - SLIDER_DIM
  
      decXDenominator.width = SLIDER_DIM
      decXDenominator.height = SLIDER_DIM
      decXDenominator.x = hnumberline.x + hnumberline.length 
      decXDenominator.y = hnumberline.y
  
    }

  // Loading Script
  function load() {
    if (setup.props.features) {
      features = setup.props.features;
    }

    backGround = new PIXI.Sprite()
    backGround.alpha = 0
    app.stage.addChild(backGround)


    setTimeout(()=>{
      backGround.texture = BACKGROUND_TEXTURE
      backGround.width = WINDOW_WIDTH
      backGround.height = WINDOW_HEIGHT
      TweenLite.to(backGround,{alpha: 1})
    },500)


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

    slider.width = SLIDER_DIM;
    slider.height = slider.width;
    slider.y = rangeBubbleSelector.y + 2 * slider.height;
    slider.x = rangeBubbleSelector.x + rangeBubbleSelector._width / 2;
    app.stage.addChild(slider);

    slider.on("pointerdown", sliderPointerDown);
    slider.on("pointermove", sliderPointerMove);
    slider.on("pointerup", sliderPointerUp);
    slider.on("pointerupoutside", sliderPointerUp);

    lineUp.lineStyle(2, GREY);
    lineUp.lineTo(0, slider.y - slider.height / 2 - SELECTOR_Y);
    //app.stage.addChild(lineUp)
    lineUp.x = slider.x;
    lineUp.y = SELECTOR_Y;

    const numberBubbleConfig = {
      text: 456,
      width: SLIDER_DIM,
    };


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
      let one = vnumberline.getOne()
      brickGrid.resize(one);
      slider.x = hnumberline.x + brickGrid.width;
      slider.y = hnumberline.y - brickGrid.height;
    };

    vnumberline.onUpdateComplete = () => {
      brickGrid.draw(brickGrid.config);
      let one = vnumberline.getOne()
      brickGrid.resize(one);
      drawWhiskers(slider.x, slider.y);
    };

    hnumberline.onUpdate = () => {
      let { min, max } = hnumberline;
      vnumberline.draw(min, max);
      let one = hnumberline.getOne()
      brickGrid.resize(one);
      slider.x = hnumberline.x + brickGrid.width;
      slider.y = vnumberline.y - brickGrid.height;
    };

    hnumberline.onUpdateComplete = () => {
      brickGrid.draw(brickGrid.config);
      let one = hnumberline.getOne()
      brickGrid.resize(one);
      drawWhiskers(slider.x, slider.y);
    };

    vnumberline.fractionTicks = true;
    vnumberline.denominator = 2;

    hnumberline.fractionTicks = true;
    hnumberline.denominator = 2;

    hnumberline.setBoundaries(-1, 16, 1);
    vnumberline.setBoundaries(-1, 16, 1);

    hnumberline.draw(0, 3.2);
    vnumberline.draw(0, 3.2);

    const brickGridConfig = {
      xNumerator: hnumberline.denominator,
      xDenominator: hnumberline.denominator,
      yNumerator: vnumberline.denominator,
      yDenominator: vnumberline.denominator,
      oneDim: hnumberline.majorDX
    };

    brickGrid = new BinomialGrid(brickGridConfig, app);
    brickGrid.x = vnumberline.x;
    brickGrid.y = vnumberline.y;
    app.stage.addChild(brickGrid);

    slider.x = hnumberline.x + brickGrid.width;
    slider.y = vnumberline.y - brickGrid.height;

    let incDim = SLIDER_DIM

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


    if (features.type == "k2"){
      hnumberline.hideLabels()
      vnumberline.hideLabels()
      console.log("hiding")
    } else {
      app.stage.addChild(incYDenominator);
      app.stage.addChild(decYDenominator);
      app.stage.addChild(incXDenominator);
      app.stage.addChild(decXDenominator);
    }

  }

  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);
  // app.resizable = true
};
