import * as PIXI from "pixi.js";
import blueGradient from "../assets/blue-gradient.png";
import greyPin from "../assets/Pin.png";
import * as CONST from "./const.js";
import { TweenLite } from "gsap";
import {
  Draggable,
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
  let prev;
  let timeout;
  let startColor = 0x404040
  let endColor = 0x000000
  let strokeWidth = 3

  // UI
  let background;
  let drawingCtx;

  


  function redraw(){
    drawingCtx.clear()
    drawingCtx.lineStyle(strokeWidth,endColor,1,0.5)
    drawingCtx.beginFill(endColor)


    
    arr.forEach((s,i)=>{


      let prev = s[0]
      let curr;



      s.forEach(p=>{
        curr = p
        drawingCtx.moveTo(prev.x,prev.y)
        drawingCtx.lineStyle(0,endColor,1,0.5)
        drawingCtx.drawCircle(curr.x,curr.y,0.8)
        drawingCtx.lineStyle(strokeWidth,endColor,strokeWidth,0.5)
        drawingCtx.quadraticCurveTo(prev.x,prev.y,curr.x,curr.y)
        prev = p

      })

    })

    getTextureFromCtx()
    arr = []
  }


  function getTextureFromCtx() {
    let t = app.renderer.generateTexture(drawingCtx)
    let s = new PIXI.Sprite()
    s.width = t.width
    s.height = t.height
    s.texture = t
    let c = new PIXI.Container()
    //c.addChild(s)
    app.stage.addChild(s)

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

  
    console.log("texturewidth",t.x)
    console.log("texturewidth",t.y)

    console.log("texturewidth",s.width)
    console.log("texturewidth",s.height)


    let minY = Math.min(...yS)
    let minX = Math.min(...xS)


    s.x = minX - strokeWidth/2 
    s.y = minY - strokeWidth/2
    drawingCtx.clear()
  }

  function backgroundPointerDown(e) {
    clearTimeout(timeout)
    this.touching = true
    prev = {x: e.data.global.x,y: e.data.global.y}
    drawingCtx.lineStyle(2,startColor,1,0.5)
    drawingCtx.beginFill(startColor)
  }


  function backgroundPointerMove(e) {
    if (this.touching){
      curr = {x: e.data.global.x,y: e.data.global.y}
      drawingCtx.moveTo(prev.x,prev.y)
      drawingCtx.lineStyle(0,startColor,1,0.5)
      drawingCtx.drawCircle(curr.x,curr.y,strokeWidth/2.1)
      drawingCtx.lineStyle(strokeWidth,startColor,1,0.5)
      drawingCtx.quadraticCurveTo(prev.x,prev.y,curr.x,curr.y)
    

      prev = curr
      subArr.push(curr)
    }
  }

  function backgroundPointerUp(e) {
    this.touching = false;
    arr.push(subArr)
    subArr = []
    
    timeout = setTimeout(redraw,500)
    //getTextureFromCtx()
    arr = []
    //drawingCtx.clear()

    console.log("drawing Context Hit Area",drawingCtx.hitArea)
  }


  function drawNodes(arr){
    arr.forEach(e=>{
      drawingCtx.lineTo(e.x,e.y)
      drawingCtx.moveTo(e.x,e.y)
    })
  }

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
    background.on('pointerup',backgroundPointerUp)
    app.stage.addChild(background)


    drawingCtx = new PIXI.Graphics()
    app.stage.addChild(drawingCtx)



    resize()
  }

  // Call load script
  load();

};
