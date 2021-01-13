import * as PIXI from "pixi.js";
import blueGradient from "../assets/blue-gradient.png";
import greyPin from "../assets/Pin.png";
import * as CONST from "./const.js";
import { TweenLite } from "gsap";
import {
  DraggableGraphics,
  HorizontalNumberLine,
  BlockRow,
  AdjustableStrip,
  FractionStrip,
} from "./api_kh.js";

export const init = (app, setup) => {
  let features;

  // Layout Parameters 
  let WINDOW_WIDTH = window.innerWidth
  let WINDOW_HEIGHT = window.innerHeight



  // State
  let arr = []
  let subArr = []
  let curr; 
  let timeout;
  let startColor = 0xed1f30
  let endColor = 0x000000
  let strokeWidth = Math.min(WINDOW_WIDTH,WINDOW_HEIGHT)/200



  // UI
  let background;
  

  // START
  const V = {drawings: []}
  const S = {
    startColor: 0xed1f30,
    endColor: 0x000000,
    strokeWidth: Math.min(WINDOW_WIDTH,WINDOW_HEIGHT)/200,
    prev: {},
    curr: {}
  }

  function drawingPointerUp(){
    arr.push(subArr)
    subArr = []
    background.touching = false

    if (!this.drawn){
    
    timeout = setTimeout(()=>{

    V.currentCtx.alpha = 1
    V.currentCtx.state.points = arr
    let yS = []

    let xS = []

    arr.forEach(s=>{
      s.forEach(p=>{
        xS.push(p.x)
      })
    })

    arr.forEach(s=>{
      s.forEach(p=>{
        yS.push(p.y)
      })
    })


    let minY = Math.min(...yS)
    let minX = Math.min(...xS)
    let maxY = Math.max(...yS)
    let maxX = Math.max(...xS)

    V.currentCtx.state.bounds ={
      minX: minX,
      maxX: maxX,
      minY: minY,
      maxY: maxY
    }

    V.currentCtx.drawn = true
    V.currentCtx.draw()



    V.drawings.push(V.currentCtx)

    V.currentCtx.drawn = true

    let newDrawingCtx = new DraggableGraphics()
    newDrawingCtx.on('pointerup',drawingPointerUp)
    newDrawingCtx.state.strokeWidth = strokeWidth
    newDrawingCtx.state.strokeColor= endColor
    V.currentCtx = newDrawingCtx
    V.drawings.push(newDrawingCtx )
    app.stage.addChild(newDrawingCtx)

    arr = []
    subArr = []
    },1000)

  }

  }

  function backgroundPointerDown(e) {
    clearTimeout(timeout)
    this.touching = true
    S.prev = {x: e.data.global.x,y: e.data.global.y}
    subArr.push(S.prev)
    V.currentCtx.moveTo(S.prev.x,S.prev.y)
    V.currentCtx.beginFill(startColor)
    V.currentCtx.lineStyle(0,startColor,1,0.5)
    V.currentCtx.drawCircle(S.prev.x,S.prev.y,strokeWidth/2.1)

  }


  function backgroundPointerMove(e) {
    if (this.touching){
      S.curr = {x: e.data.global.x,y: e.data.global.y}
      V.currentCtx.moveTo(S.prev.x,S.prev.y)
      V.currentCtx.lineStyle(0,startColor,1,0.5)
      V.currentCtx.drawCircle(S.curr.x,S.curr.y,strokeWidth/2.1)
      V.currentCtx.lineStyle(strokeWidth,startColor,1,0.5)
      V.currentCtx.quadraticCurveTo(S.prev.x,S.prev.y,S.curr.x,S.curr.y)
      S.prev = S.curr
      subArr.push(S.curr)
    }
  }

  // END



  // Called on resize
  function resize(newFrame) {
    // Make sure all layout parameters are up to date.
    updateLayoutParams(newFrame);
    app.renderer.resize(WINDOW_WIDTH, WINDOW_HEIGHT);
    background.width = WINDOW_WIDTH
    background.height = WINDOW_HEIGHT
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
  function load(state) {
    if (setup.props.features) {
      features = setup.props.features;
    }

    background = new PIXI.Sprite()
    background.texture = new PIXI.Texture.from(CONST.ASSETS.BLUE_GRADIENT)
    background.interactive = true 
    background.on('pointerdown',backgroundPointerDown)
    background.on('pointermove',backgroundPointerMove)
    app.stage.addChild(background)


    V.currentCtx= new DraggableGraphics()
    V.currentCtx.on('pointerup',drawingPointerUp)
    V.currentCtx.state.strokeWidth = strokeWidth
    V.currentCtx.state.strokeColor= endColor

    V.drawings.push(...V.currentCtx)
    app.stage.addChild(V.currentCtx)



    resize()
  }

  // Call load script
  load();

};
