import * as PIXI from "pixi.js";
import blueGradient from "../assets/blue-gradient.png";
import MagnifyingGlass from "../assets/MagnifyingGlass.png";
import * as CONST from "./const.js";
import {
  TweenLite,
} from "gsap";
import {Draggable,HorizontalNumberLine,BlockRow,AdjustableStrip,FractionStrip, Pin, MultiplicationStrip} from "./api_kh.js";

export const init = (app, setup) => {
  let features;

  const WINDOW_WIDTH = setup.width
  const WINDOW_HEIGHT = setup.height
  const BTN_DIM = Math.min(WINDOW_WIDTH,WINDOW_HEIGHT)/10
  const NEW_OBJ_Y = WINDOW_HEIGHT/4
  const FRACTION_BAR_ICON_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.FRACTION_BAR_ICON)
  const STRIP_ICON_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.STRIP_ICON)
  const ARROW_ICON_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.ARROW_ICON)
  const MOVER_DOT_TEXTURE = new PIXI.Texture.from(MagnifyingGlass)
  const ZOOM_BUTTON_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.ZOOM_BUTTION)
  
  const BLUE_GRADIENT_TEXTURE = new PIXI.Texture.from(blueGradient)



  // Objects
  let numberline;
  let sliderA;
  let sliderB;
  let blockRowA;
  let backGround;
  let strips = [];
  let activeStrip = null
  let dragger;
  let stripGeneratorBtn;
  let fractionBarGeneratorBtn;
  let arrowGeneratorBtn;
  let zoomWindowBtn;
  let magnifyingPin;

  let fractionBars = []
  let arrows = []

  let whiskerMin = new PIXI.Graphics()
  let whiskerMax = new PIXI.Graphics()

  //CONST 
  function createStrip(){

    const v1 = numberline.getNumberLineFloatValueFromPosition(WINDOW_HEIGHT/4)
    const v2 = numberline.getNumberLineFloatValueFromPosition(3*WINDOW_HEIGHT/4)

    const initialState = {
      minValue: v1,
      maxValue: v2,
      height: WINDOW_HEIGHT/20,
      direction: 'right'
    }

    let strip = new AdjustableStrip(app,numberline,initialState)
    strip.TYPE = strip.TYPES.SHUTTLE
    strip.x = 0
    strip.y = 1.1*WINDOW_HEIGHT
    strip.onUpdate = ()=> {
      drawWhiskers()
    }
    //strip.alpha = 0.75
    strip.on("pointerdown",onStripDown)
    strip.on("pointerup",checkForDeletion)
    strip.on("pointerupoutside",checkForDeletion)
    strips.push(strip)
    TweenLite.to(strip,{y: NEW_OBJ_Y})
    strip.drawBetween()
    app.stage.addChild(strip)
    activeStrip = strip
    console.log("strips",strips)
  }

  function createFractionStrip(){

    const x1 = numberline.getNumberLineFloatValueFromPosition(WINDOW_HEIGHT/4)
    const x2 = numberline.getNumberLineFloatValueFromPosition(3*WINDOW_HEIGHT/4)

    const initialState = {
      xMin: x1,
      xMax: x2,
      height: WINDOW_HEIGHT/20,
      denominator: 2,
      numerators: [1,0,0,0,0,0,0,0,0,0,0,0]
    }

    let strip = new FractionStrip(app,numberline,initialState)
    strip.x =  0
    strip.y = 1.1*WINDOW_HEIGHT
    strip.onUpdate = ()=> {
      drawWhiskers()
    }
    //strip.alpha = 0.75
    strip.on("pointerdown",onStripDown)
    strip.on("pointerup",checkForDeletion)
    strip.on("pointerupoutside",checkForDeletion)
    strips.push(strip)
    TweenLite.to(strip,{y: NEW_OBJ_Y})
    app.stage.addChild(strip)
        activeStrip = strip
        console.log("strips",strips)
  }


  function createMultiplicationStrip(){

    const v1 = numberline.getNumberLineFloatValueFromPosition(WINDOW_WIDTH/4)
    const v2 = numberline.getNumberLineFloatValueFromPosition(3*WINDOW_WIDTH/4)


    const initialState = {
      minValue: v1,
      xMax: v2,
      numberOfBlocks: 3,
      blockValue: numberline.majorStep,
      heightRatio: 1/20,
      frame: {width: WINDOW_WIDTH,height: WINDOW_HEIGHT},
      height: WINDOW_HEIGHT/20,
    }

    const nitialState = {
      minValue: v1,
      xMax: v2,
      height: WINDOW_HEIGHT/20,
      denominator: 2,
      numerators: [1,3,5,6]
    }

    let strip = new MultiplicationStrip(app,numberline,initialState)
    strip.x =  0
    strip.y = 1.1*WINDOW_HEIGHT
    strip.onUpdate = ()=> {
      drawWhiskers()
    }
    //strip.alpha = 0.75
    strip.on("pointerdown",onStripDown)
    strip.on("pointerup",checkForDeletion)
    strip.on("pointerupoutside",checkForDeletion)
    strips.push(strip)
    TweenLite.to(strip,{y: NEW_OBJ_Y})
    app.stage.addChild(strip)
        activeStrip = strip
        console.log("strips",strips)
  }

  function createArrow(){

    const v1 = numberline.getNumberLineFloatValueFromPosition(WINDOW_HEIGHT/4)
    const v2 = numberline.getNumberLineFloatValueFromPosition(3*WINDOW_HEIGHT/4)

    const initialState = {
      minValue: v1,
      maxValue: v2,
      height: WINDOW_HEIGHT/20,
      direction: 'right'
    }

    let strip = new AdjustableStrip(app,numberline,initialState)
    strip.x = 0
    strip.y = 1.1*WINDOW_HEIGHT
    strip.onUpdate = ()=> {
      drawWhiskers()
    }
    //strip.alpha = 0.75
    strip.on("pointerdown",onStripDown)
    strip.on("pointerup",checkForDeletion)
    strip.on("pointerupoutside",checkForDeletion)
    strips.push(strip)
    TweenLite.to(strip,{y: NEW_OBJ_Y})
    app.stage.addChild(strip)
    activeStrip = strip

    console.log("strips",strips)

    strips.forEach(s=>{
      console.log("hello",strips.indexOf(s))
    })
  }

  function checkForDeletion(){
    if (this.y < BTN_DIM){
      deleteObject(this)
    }
  }

  function deleteObject(obj){
    activeStrip = null
    whiskerMax.clear()
    whiskerMin.clear()
    let i = strips.indexOf(obj)
    console.log("removing index",i)
    strips.splice(i,1)

    console.log("strips",strips)

    const onComplete = () => {
      app.stage.removeChild(obj)
      obj.destroy()
    } 
    TweenLite.to(obj,{y: -WINDOW_HEIGHT/2,onComplete: onComplete})
  }

  function onStripDown(){
    activeStrip = this 
    app.stage.addChild(this)
    console.log("index",strips.indexOf(this))
  }


  function drawWhiskers(){

    if (activeStrip != null){

      whiskerMax.clear()
      whiskerMin.clear()
      whiskerMax.lineStyle(2,0xffffff)
      whiskerMax.moveTo(activeStrip.max-1,activeStrip.y)
      whiskerMax.lineTo(activeStrip.max-1,numberline.y)
      whiskerMax.alpha = 0.75

      whiskerMin.lineStyle(2,0xffffff)
      whiskerMin.moveTo(activeStrip.min+1,activeStrip.y)
      whiskerMin.lineTo(activeStrip.min+1,numberline.y)
      whiskerMin.alpha = 0.75
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


      strips.forEach(s=> {s.synch()})
      magnifyingPin.synch()
      drawWhiskers()
    } 
  }

  function backgroundPointerUp(e){
    this.touching = false
  }


  function zoomFit(){

    if (strips.length !=0){

    let minXs = strips.map(s=>{
        return s.minDragger.getGlobalPosition().x
      })
      let maxXs = strips.map(s=>{
        return s.maxDragger.getGlobalPosition().x
      })
    let xMax = Math.max(...maxXs)
    let xMin = Math.min(...minXs)
    xMin = xMin > 0 ? 0.8*xMin : 1.2*xMin
    let vMin = numberline.getNumberLineFloatValueFromPosition(xMin+0.1*xMin)
    let vMax = numberline.getNumberLineFloatValueFromPosition(xMax*1.1)
    const centerVal = (vMin+vMax)/2
    numberline.flexPoint = centerVal 
    magnifyingPin.value = centerVal
    numberline.zoomTo(vMin,vMax,2)
    }
  }

  // Called on resize
  function resize(newFrame) {
    // Make sure all layout parameters are up to date.
    updateLayoutParams(newFrame);
    strips[0].redraw(newFrame)
    drawWhiskers()

    backGround.width = newFrame.width 
    backGround.height = newFrame.height
    numberline.redraw(newFrame)

    app.renderer.resize(newFrame.width,newFrame.height);
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


    app.stage.addChild(numberline)


    numberline.onUpdate = () => {
      strips.forEach(s=> {s.synch()})
      magnifyingPin.synch()
      drawWhiskers()
    } 



    stripGeneratorBtn = new PIXI.Sprite(STRIP_ICON_TEXTURE)
    stripGeneratorBtn.interactive = true 
    stripGeneratorBtn.x = WINDOW_WIDTH - (BTN_DIM/3 + BTN_DIM)
    stripGeneratorBtn.y = BTN_DIM/8
    stripGeneratorBtn.height = BTN_DIM
    stripGeneratorBtn.width = stripGeneratorBtn.height
    stripGeneratorBtn.on('pointerdown',createMultiplicationStrip)
    app.stage.addChild(stripGeneratorBtn)

    arrowGeneratorBtn = new PIXI.Sprite(ARROW_ICON_TEXTURE)
    arrowGeneratorBtn.interactive = true 
    arrowGeneratorBtn.x = WINDOW_WIDTH - (BTN_DIM/3 + 2*BTN_DIM)
    arrowGeneratorBtn.y = BTN_DIM/8
    arrowGeneratorBtn.height = BTN_DIM
    arrowGeneratorBtn.width = arrowGeneratorBtn.height
    arrowGeneratorBtn.on('pointerdown',createArrow)
    app.stage.addChild(arrowGeneratorBtn)

    fractionBarGeneratorBtn = new PIXI.Sprite(FRACTION_BAR_ICON_TEXTURE)
    fractionBarGeneratorBtn.interactive = true 
    fractionBarGeneratorBtn.x = WINDOW_WIDTH - (BTN_DIM/3 + 3*BTN_DIM)
    fractionBarGeneratorBtn.y = BTN_DIM/8
    fractionBarGeneratorBtn.height = BTN_DIM
    fractionBarGeneratorBtn.width = fractionBarGeneratorBtn.height
    fractionBarGeneratorBtn.on('pointerdown',createFractionStrip)
    app.stage.addChild(fractionBarGeneratorBtn)

    zoomWindowBtn = new PIXI.Sprite(ZOOM_BUTTON_TEXTURE)
    zoomWindowBtn.interactive = true 
    zoomWindowBtn.x = WINDOW_WIDTH - (BTN_DIM/3 + 4*BTN_DIM)
    zoomWindowBtn.y = BTN_DIM/8
    zoomWindowBtn.height = BTN_DIM
    zoomWindowBtn.width = zoomWindowBtn.height
    zoomWindowBtn.on('pointerdown',zoomFit)
    app.stage.addChild(zoomWindowBtn)

    app.stage.addChild(whiskerMin)
    app.stage.addChild(whiskerMax)

    const pinState = {
      height: BTN_DIM/1.5,
      width: BTN_DIM/1.5,
      texture: MOVER_DOT_TEXTURE,
    }

    magnifyingPin = new Pin(numberline,pinState)
    magnifyingPin.x = numberline.getNumberLinePositionFromFloatValue(0)
    magnifyingPin.y = numberline.y + WINDOW_HEIGHT/4
    magnifyingPin.drawWhisker()
    magnifyingPin.value = 0
    app.stage.addChild(magnifyingPin)


  }




  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);

};
