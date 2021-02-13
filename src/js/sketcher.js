import * as PIXI from "pixi.js-legacy";
import blueGradient from "../assets/blue-gradient.png";
import MagnifyingGlass from "../assets/MagnifyingGlass.png";
import * as CONST from "./const.js";
import {
  TweenLite,TimelineLite
} from "gsap";
import {ArrayModel, Draggable, Axis, digitCount, KHNumberline, MathFactPrompt,DraggableGraphics,EditableTextField} from "./api_kh.js";
import { TransferWithinAStationOutlined } from "@material-ui/icons";


export class Sketcher extends PIXI.Container {
  constructor(state,App){
    super()

    console.log(
      "window",window)

    this.App = App
    this.state = state
    this.interactive = true
    this.backGround = new PIXI.Sprite(App.T.backGround)
    this.backGround.interactive = true
    this.on('pointerdown',this.backGroundPointerDown)
    this.on('pointermove',this.backGroundPointerMove)
    this.on('pointerup',this.backGroundPointerUp)

    this.addChild(this.backGround)

    // Local Attributes (not required for reconstruction)
    this.ctx = new PIXI.Graphics()

    this.accumulatorSprite = new PIXI.Sprite()
    this.accumulatorSprite.paths = []
    this.addChild(this.accumulatorSprite)

    this.prev = {}
    this.subArr = []
    this.paths = []
    this.timeout;

    this.addChild(this.ctx)
    
  }



  drawPaths(paths,ctx){

    const strokeColor = 0x000000
    const strokeWidth = this.state.strokeWidth
  
    paths.forEach((s,j)=>{
  
  
      let prev = s[0]
      let curr = s.length > 1 ? s[1] : s[0]
  
  
      s.forEach((p,i)=>{
        curr = i != 0 ? p : s[1]
  
        curr = !curr ? prev : curr
  
  
        ctx.moveTo(prev.x,prev.y)
        ctx.beginFill(0x000000)
        
        if (i == 0){
          ctx.lineStyle(0,strokeColor,1,0.5)
          ctx.drawCircle(prev.x,prev.y,strokeWidth/2.1)
          ctx._fillStyle.alpha = 0.001
          ctx.drawCircle(curr.x,curr.y,1.5*strokeWidth)
        } else {
          ctx.lineStyle(0,strokeColor,1,0.5)
          ctx.drawCircle(curr.x,curr.y,strokeWidth/2.1)
          ctx._fillStyle.alpha = 0.001
          ctx.drawCircle(curr.x,curr.y,1.5*strokeWidth)
        }
  
        ctx.lineStyle(strokeWidth,strokeColor,1,0.5)
        ctx.lineTo(curr.x,curr.y)
  
        prev = p
      })
  
    })
  }

  finishPath(){
    this.drawPaths(this.accumulatorSprite.paths,this.ctx)
    const t = this.App.R.generateTexture(this.ctx)
    let {x,y} = this.ctx.getBounds()
    
    const d = new Draggable(t)
    d.x = x 
    d.y = y
    d.type = 'PATH'

    this.accumulatorSprite.destroy()
    this.accumulatorSprite = new PIXI.Sprite()
    this.addChild(this.accumulatorSprite)
    this.accumulatorSprite.paths = []

    this.App.C.addAnnotation(d)
    this.ctx.clear()
  }

  backGroundPointerDown(e) {

    clearTimeout(this.timeout)
    this.App.V.annotations.forEach(a=>{a.interactive = false})
    this.touching = true
    this.prev = {x: e.data.global.x,y: e.data.global.y}
    this.subArr.push(this.prev)
    this.ctx.moveTo(this.prev.x,this.prev.y)
    this.ctx.beginFill(this.state.startColor)
    this.ctx.lineStyle(0,this.state.startColor,1,0.5)
    this.ctx.drawCircle(this.prev.x,this.prev.y,this.state.strokeWidth/2.1)
    this.ctx._fillStyle.alpha = 0.001
    this.ctx.drawCircle(this.prev.x,this.prev.y,3*this.strokeWidth)

  }

  backGroundPointerMove(e) {

    if (this.touching){
      this.curr = {x: e.data.global.x,y: e.data.global.y}
      this.ctx._fillStyle.alpha = 1
      this.ctx.moveTo(this.prev.x,this.prev.y)
      this.ctx.lineStyle(0,this.startColor,1,0.5)
      this.ctx.drawCircle(this.curr.x,this.curr.y,this.state.strokeWidth/2.1)
      this.ctx.lineStyle(this.state.strokeWidth,this.state.startColor,1,0.5)
      this.ctx.lineTo(this.curr.x,this.curr.y)
      this.prev = this.curr
      this.subArr.push(this.curr)
    }
  }

  backGroundPointerUp(){
    this.touching = false
    this.App.V.annotations.forEach(a=>{a.interactive = true})
    this.ctx.lineStyle(0,this.state.startColor,1,0.5)
    this.ctx.drawCircle(this.prev.x,this.prev.y,this.state.strokeWidth/2.1)
    this.ctx._fillStyle.alpha = 0.001
    this.ctx.drawCircle(this.prev.x,this.prev.y,1.5*this.state.strokeWidth)

    const t = this.App.R.generateTexture(this.ctx)
    const b = this.ctx.getBounds()
    
    
    // b.width > this.state.strokeWidth*6 || b.height > this.state.strokeWidth*6
 
    if (true){
      const s = new PIXI.Sprite(t)
      s.x = b.x 
      s.y = b.y
      this.ctx.clear()
      this.accumulatorSprite.addChild(s)
      this.accumulatorSprite.paths.push(this.subArr)
    } else {
      this.ctx.clear()
      t.destroy()
    }
    this.subArr = []
    this.timeout = setTimeout(()=>this.finishPath(),800)
  }


}
