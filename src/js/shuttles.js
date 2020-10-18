import * as PIXI from "pixi.js";
import blueGradient from "../assets/blue-gradient.png";
import greyPin from "../assets/Pin.png";
import * as CONST from "./const.js";
import {
  TweenLite,
} from "gsap";
import {Draggable,HorizontalNumberLine,BlockRow,AdjustableStrip,FractionStrip} from "./api_kh.js";

export const init = (app, setup) => {
  let features;

  const WINDOW_WIDTH = setup.width
  const WINDOW_HEIGHT = setup.height


  // Objects
  let numberline;
  let sliderA;
  let sliderB;
  let blockRowA;
  let backGround;
  let strips = [];
  let activeStrip;

  let whiskerMin = new PIXI.Graphics()
  let whiskerMax = new PIXI.Graphics()

  //CONST 

  const BLUE_PIN_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.GREEN_CIRCLE_PIN)
  const PINK_PIN_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.PINK_SQUARE_PIN)
  const BLUE_GRADIENT_TEXTURE = new PIXI.Texture.from(blueGradient)



  function drawWhiskers(){

    app.stage.addChild(whiskerMax)
    whiskerMax.clear()
    whiskerMax.lineStyle(2,activeStrip.color)
    whiskerMax.moveTo(activeStrip.max-1,activeStrip.y)
    whiskerMax.lineTo(activeStrip.max-1,numberline.y)
    whiskerMax.alpha = 0.75

    app.stage.addChild(whiskerMin)
    whiskerMin.clear()
    whiskerMin.lineStyle(2,activeStrip.color)
    whiskerMin.moveTo(activeStrip.min+1,activeStrip.y)
    whiskerMin.lineTo(activeStrip.min+1,numberline.y)
    whiskerMin.alpha = 0.75

  }

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
    let deltaZero = this.x - zero

    if (Math.abs(deltaZero) < numberline.minorDX) {
      if (deltaZero > 0){
        roundedPosition = numberline.roundPositionUpToNearestTick(this.x)
      } else {
        roundedPosition = numberline.roundPositionDownToNearestTick(this.x)
      }
    }

    let blockVal = numberline.getNumberLineFloatValueFromPosition(roundedPosition)
    let blockWidth = roundedPosition - zero

    blockRowA.value = blockVal*blockRowA.n
    blockRowA.draw(blockRowA.n,blockWidth)
    blockRowA.resize()

    this.x = roundedPosition
    sliderA.x = zero + blockWidth*blockRowA.n

    if (blockWidth < 0){
      sliderA.maxX = this.x
      sliderA.minX = null
    } else {
      sliderA.minX = this.x
      sliderA.maxX = null
    }
    
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
      strips.forEach(s=> {s.synch()})
      drawWhiskers()
    } 
  }

  function backgroundPointerUp(e){
    this.touching = false


    sliderA.minX && (sliderA.minX = sliderB.x)
    sliderA.maxX && (sliderA.maxX = sliderB.x)
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

    backGround = new PIXI.Sprite()
    backGround.interactive = true
    backGround.alpha = 0
    backGround.on('pointerdown',backgroundPointerDown)
    backGround.on('pointermove',backgroundPointerMove)
    backGround.on('pointerup',backgroundPointerUp)
    backGround.on('pointerupoutside',backgroundPointerUp)
    app.stage.addChild(backGround)


    setTimeout(()=>{
      backGround.texture = BLUE_GRADIENT_TEXTURE
      backGround.width = WINDOW_WIDTH
      backGround.height = WINDOW_HEIGHT
      TweenLite.to(backGround,{alpha: 1})
    },500)


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
    sliderB = new Draggable(PINK_PIN_TEXTURE)

    const sliderAspect = sliderA.width/sliderA.height

    sliderB.anchor.set(0.5,1)
    sliderB.height = WINDOW_HEIGHT/4
    sliderB.width = sliderAspect*sliderB.height
    sliderB.lockY = true
    sliderB.angle = 180
    sliderB.x = blockRowA.x + blockRowA.width
    sliderB.y = numberline.y
    sliderB.on('pointerdown',sliderBPointerDown)
    sliderB.on('pointermove',sliderBPointerMove)
    sliderB.on('pointerup',sliderBPointerUp)
    sliderB.on('pointerupoutside',sliderBPointerUp)


    sliderA.anchor.set(0.5,1)
    sliderA.height = WINDOW_HEIGHT/4
    sliderA.width = sliderAspect*sliderA.height
    sliderA.lockY = true
    sliderA.angle = 180
    sliderA.x = blockRowA.x + blockRowA.width
    sliderA.y = numberline.y
    sliderA.on('pointerdown',sliderAPointerDown)
    sliderA.on('pointermove',sliderAPointerMove)
    sliderA.on('pointerup',sliderAPointerUp)
    sliderA.on('pointerupoutside',sliderAPointerUp)

    app.stage.addChild(numberline)
    //app.stage.addChild(sliderB)
    //app.stage.addChild(sliderA)
    //app.stage.addChild(blockRowA)


    numberline.onUpdate = () => {
      let zeroDistance = numberline.getDistanceFromZeroFromValue(blockRowA.value)
      let blockEndPoint = numberline.getNumberLinePositionFromFloatValue(blockRowA.value)
      let zeroX = numberline.getNumberLinePositionFromFloatValue(0)
      blockRowA.resize(zeroDistance/blockRowA.n)
      sliderA.x = blockEndPoint
      sliderB.x = zeroX + zeroDistance/blockRowA.n

      strips.forEach(s=> {s.synch()})
      drawWhiskers()
    } 

    numberline.onUpdateComplete = () => {
      let blockEndPoint = numberline.getNumberLinePositionFromFloatValue(blockRowA.value)
      let zeroX = numberline.getNumberLinePositionFromFloatValue(0)
      let width = blockEndPoint - zeroX
      blockRowA.draw(blockRowA.n,width/blockRowA.n)
      blockRowA.width = Math.abs(width)

      sliderA.minX && (sliderA.minX = sliderB.x)
      sliderA.maxX && (sliderA.maxX = sliderB.x)
    } 
  
    for (let i=0;i<4;i++){
      let strip = new AdjustableStrip(WINDOW_HEIGHT/20,app,numberline)
      strip.x = 0
      strip.y = numberline.y - WINDOW_HEIGHT/20*1.1*(i+1)
      strip.onUpdate = ()=> {
        drawWhiskers()
      }
      //strip.alpha = 0.75
      strip.on("pointerdown",()=>{activeStrip = strip})
      strips.push(strip)
      app.stage.addChild(strip)
    }

    activeStrip = strips[0]

  }


  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);

};
