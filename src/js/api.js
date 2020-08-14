// Problem que setup
import * as PIXI from "pixi.js";
import { TweenMax, TimelineLite, Power2, Elastic, CSSPlugin, TweenLite, TimelineMax } from "gsap";
import {NUMBERS} from "../AssetManager.js"
import * as CONST from "./const.js";
import { timers } from "jquery";
import { Rect } from "react-konva";


export class Row extends PIXI.Container{
  constructor(){
    super()
  }
}


export class Vector extends PIXI.Sprite {
  constructor(){
    super()

  }

  draw(){

  }
}


export class Cannon extends PIXI.Container {
  constructor(length){
    super()

    this._defaultLength = length

    this.tip = new PIXI.Graphics()
    this.tip.beginFill(0x000000)
    this.tip.lineTo(5,10)
    this.tip.lineTo(-5,10)
    this.tip.lineTo(0,0)
    this.tip.endFill()
    //this.tip.hitArea = new PIXI.Rectangle(0,0,1,1)
    this.addChild(this.tip)

    this.arrow = new PIXI.Graphics()
    this.arrow.lineStyle(2,0x000000)
    this.arrow.lineTo(0,length)
    this.addChild(this.arrow)

    this.on('pointerdown',this.pointerDown)
    this.on('pointerup',this.pointerUp)
    this.on('pointerupoutside',this.pointerUp)
    this.on('pointermove',this.pointerMove)
    this.interactive = true


    this._width = this.width
    this._height = this.height
    this.pivot.x = this._width/2 
    this.pivot.y = this._height
    this.hitArea = new PIXI.Rectangle(0,0,3*this._width,this._height)

    this.angle = 45
  }


  reset() {
    this.draw(this._defaultLength)
    this.angle = 45
    this.x = this.cannonAnchor.x
    this.y = this.cannonAnchor.y
  }

  draw(length){

    this.tip.clear()
    this.tip.beginFill(0x000000)
    this.tip.lineTo(5,10)
    this.tip.lineTo(-5,10)
    this.tip.lineTo(0,0)
    this.tip.endFill()
    this.addChild(this.tip)

    this.arrow.clear()
    this.arrow.lineStyle(2,0x000000)
    this.arrow.lineTo(0,length)
    this.addChild(this.arrow)

    this.pivot.x = this._width/2 
    this.pivot.y = this._height
    this._width = this.width
    this._height = this.height

  }

  pointerDown(e){
    this.touching = true
  }

  pointerUp(e){
    this.touching = false
    this.hitArea = new PIXI.Rectangle(-1.5*this._width,0,3*this._width,this._height)
  }

  pointerMove(e){
    let deltaX = e.data.global.x - this.cannonAnchor.x
    let deltaY = e.data.global.y - this.cannonAnchor.y
    this.velocity = Math.sqrt(deltaX*deltaX+deltaY*deltaY)

    let length = Math.sqrt(deltaX*deltaX+deltaY*deltaY)
    let angle = Math.atan(deltaY/deltaX)
    if (this.touching){
      this.draw(length)
      this.angle = angle*180/Math.PI + 90
    }
  }
}

export class Timer extends PIXI.Container{
  constructor(totalTime,width,height,app) {
    super()
    this.timeLine = new TimelineLite({paused: true})
    this.progress = new PIXI.Graphics()
    this.outline = new PIXI.Graphics()
    this.tick = new PIXI.Graphics()
    this.tickTexture;
    this.ticks = []
    this.totalTime = totalTime
    this.dx = width/this.totalTime
    this.app = app
    this.currentTime = 0


    this.init(width,height)
  }

  init(width,height){
    this.strokeWidth = height/10
    this._width = width 
    this._height = height
    this.outline.lineStyle(this.strokeWidth,0x000000)
    this.outline.drawRoundedRect(0,0,this._width,this._height,this.strokeWidth/10)
    this.addChild(this.progress)
    this.addChild(this.outline)

    this.tick.lineStyle(this.strokeWidth,0x000000)
    this.tick.lineTo(0,this._height/3)
    this.tickTexture = this.app.renderer.generateTexture(this.tick)

    for (let i = 0;i<this.totalTime;i++) {
      let newTick = new PIXI.Sprite()
      newTick.texture = this.tickTexture 
      newTick.x = (i)*this.dx - this.strokeWidth/2
      newTick.y = 0
      this.addChild(newTick)
      this.ticks.push(newTick)
    }
    
  }

  draw() {
    let progressPercentage = this.currentTime/this.totalTime
    let progressWidth = progressPercentage*this._width
    this.progress.clear()
    this.progress.beginFill(0xff3b55)
    this.progress.drawRoundedRect(0,0,progressWidth,this._height,this.strokeWidth/10)
    this.progress.x = 0
    this.progress.y = 0
    this.progress.endFill()

  }

  pause() {

  }

  go(){

  }

  reset(){
    this.currentTime = 0
    this.draw()
  }
}






export class FractionFrame extends PIXI.Container {
  constructor(width,height,den,app,vertical,secondColor,descriptor){

   super()
     // State
     this.value = 0
     // Placeholders
     this.BAR_HEIGHT = height
     this.LINE_WIDTH = 4
     this.BTN_WIDTH = height
     this.DESCRIPTOR_WIDTH = width/3
     this.autoRecolor = false

     // Default values
     this.numerator = 0
     this.denominator = den
     this._width = width
     this._height = height
     this.app = app
     this.sprites = []
     this.vertical = vertical
     this.blockDim = this.vertical ?  height / this.denominator :  width / this.denominator
     this.activated = true
     this.interactive = true
     this.color = secondColor ? secondColor : 0xFFFFFF

     this.descriptor = new Fraction(1,2,this.DESCRIPTOR_WIDTH)
     this.descriptor.interactive = false
     this.descriptor.x = this._width/2 - this.descriptor.width/2
     this.descriptor.y = -1.2*this.descriptor.height
     this.descriptor.on('pointerdown', this.grabberPointerDown)
     this.descriptor.on('pointermove', this.grabberPointerMove)
     this.descriptor.on('pointerup', this.grabberPointerUp)
     this.descriptor.on('pointerupoutside', this.grabberPointerUp)
     this.descriptor.draw(this.numerator,this.denominator,this.DESCRIPTOR_WIDTH)

    if (descriptor){
      this.addChild(this.descriptor)
    }

 
     this.plusBtn = new PIXI.Sprite.from(CONST.ASSETS.PLUS_SQUARE)
     this.plusBtn.anchor.set(0.5)
     this.plusBtn.interactive = true
     this.plusBtn.width = this.BTN_WIDTH
     this.plusBtn.height = this.plusBtn.width
     this.plusBtn.x = this._width + 1.2*this.BTN_WIDTH/2
     this.plusBtn.y = this.BAR_HEIGHT/2
     this.plusBtn.on('pointerdown', () => {
       if (this.denominator < 12){
        this.incDenominator(1)
       }
     })
     this.addChild(this.plusBtn)
 
     this.minusBtn = new PIXI.Sprite.from(CONST.ASSETS.MINUS_SQUARE)
     this.minusBtn.anchor.set(0.5)
     this.minusBtn.interactive = true
     this.minusBtn.width = this.BTN_WIDTH
     this.minusBtn.height = this.minusBtn.width
     this.minusBtn.x = -this.BAR_HEIGHT/2*1.2
     this.minusBtn.y = this.BAR_HEIGHT/2
     this.minusBtn.anchor.set(0.5)
     this.minusBtn.on('pointerdown', () => {
       this.incDenominator(-1)
      })
     this.addChild(this.minusBtn)

     let w = this.vertical ? this._width : this.blockDim
     let h = this.vertical ? this.blockDim : this._height

     this.blockA = new PIXI.Graphics()
     this.blockA.lineStyle(3,0x000000) 
     this.blockA.drawRoundedRect(0,0,w,h,1)
     this.myA = this.app.renderer.generateTexture(this.blockA)
   
     this.blockB = new PIXI.Graphics()
     this.blockB.beginFill(this.color)
     this.blockB.lineStyle(3,0x000000) 
     this.blockB.drawRoundedRect(0,0,w,h,1)
     this.myB = this.app.renderer.generateTexture(this.blockB)
   
     this.g = new PIXI.Graphics()
     
       //  Attached methods
    this.on('pointerdown',this.containerPointerDown)
    this.on('pointerup',this.containerPointerUp)
    this.on('pointerupoutside',this.containerPointerUp)
    this.on('pointermove',this.containerPointerMove)
  
    for (let i = 0;i<this.denominator;i++) {
      let s = new PIXI.Sprite.from(this.myA)
      s.on('pointerdown',this.spritePointerDown)
      s.on('pointerup',this.spritePointerUp)
      s.on('pointermove',this.spritePointerMoved)
      s.interactive = true
      s.active = false
      s.x = i*this.LINE_WIDTH/this.denominator
      this.sprites.push(s)
      this.addChild(s)
    }
      
      this.draw()
  } 

    colorTo(n){
      this.sprites.forEach((s,i)=>{
        if (i<n){
          s.active = true 
        } else {
          s.active = false
        }
      })
      this.draw()
    }

    hideButtons = ()=>{
      this.plusBtn.alpha = 0 
      this.minusBtn.alpha = 0
      this.removeChild(this.plusBtn)
      this.removeChild(this.minusBtn)
    }

  
    incDenominator = (inc) => {
    if (this.denominator + inc >= 1) {
      this.g.clear()
      this.g.lineStyle(3,0x000000) 
      this.g.drawRoundedRect(0,0,this._width,this._height,1)
      let R = this.app.renderer.generateTexture(this.g)
      this.plusBtn.interactive = false
      this.minusBtn.interactive = false
      let newSprites = []
      for (let i = 0;i<Math.abs(inc);i++){
        let s = new PIXI.Sprite()
        this.addChild(s)
        s.texture = R
        s.x  = 0
        newSprites.push(s)
      }


  
      if (inc > 0){
        const onComplete = ()=>{
          newSprites.forEach(s=>{
          s.on('pointerdown',this.spritePointerDown)
          s.on('pointerup',this.spritePointerUp)
          s.on('pointermove',this.spritePointerMoved)
          s.interactive = true
          this.sprites.push(s)
          })
          this.draw()
          this.plusBtn.interactive = true
          this.minusBtn.interactive = true
        }
        TweenMax.to(this, 0.1, {denominator: this.denominator+inc,onUpdate: this.draw,onComplete: onComplete})
      } else if (inc < 0) {
        for (let i = 0;i<Math.abs(inc);i++){
          let removeme  = this.sprites.pop()
          this.removeChild(removeme)
        }
        const onComplete = ()=>{
          this.draw()
          newSprites.forEach(s=>{
            this.removeChild(s)})
          this.plusBtn.interactive = true
          this.minusBtn.interactive = true
        }
        TweenMax.to(this, 0.1, {denominator: this.denominator+inc,onUpdate: this.draw,onComplete: onComplete})
      }
     }
     setTimeout(()=>{
      this.numerator = this.sprites.reduce((acc,s)=>{
     let count = s.active ? 1 : 0 
     return count+acc},0)
    this.denominator = Math.round(this.denominator)
    this.descriptor.draw(this.numerator,this.denominator,this.DESCRIPTOR_WIDTH)
    },300)

    }
  
    draw = (width) => {
      if (width) {
        this._width = width
      }
      this.blockDim =  this.vertical ?  this._height / this.denominator :  this._width / this.denominator

      let w = this.vertical ? this._width : this.blockDim
      let h = this.vertical ? this.blockDim : this._height

      this.blockA.clear()
      this.blockA.lineStyle(3,0x000000) 
      this.blockA.drawRoundedRect(0,0,w,h,1)
      this.myA = this.app.renderer.generateTexture(this.blockA)
    
      this.blockB.clear()
      this.blockB.beginFill(this.color)
      this.blockB.lineStyle(3,0x000000) 
      this.blockB.drawRoundedRect(0,0,w,h,1)
      this.myB = this.app.renderer.generateTexture(this.blockB)

  
      for (let i = 0;i<this.sprites.length;i++){
        this.sprites[i].myA = this.myA
        this.sprites[i].myB = this.myB
        if (this.sprites[i].active){
          this.blockB.clear()
          this.blockB.beginFill(this.sprites[i].myColor)
          this.blockB.lineStyle(3,0x000000) 
          this.blockB.drawRoundedRect(0,0,w,h,1)
          let thisB = this.app.renderer.generateTexture(this.blockB)
          this.sprites[i].texture = thisB
        } else {
          this.sprites[i].myColor = this.color
          this.sprites[i].texture = this.myA
        }
  
        if (this.vertical){
          this.sprites[i].x = 0
          this.sprites[i].y = this._height - this.blockDim*(i+1)
        } else {
          this.sprites[i].x = this.blockDim*i
          this.sprites[i].y = 0
        }

      }
    }

    grabberPointerDown(){

    }
  
    grabberPointerMove(){
      
    }
  
    grabberPointerUp(){
      
    }
  
  
    spritePointerDown(event){
      this.touched = true
      this.dragged = false
    }
  
    spritePointerMoved(event) {
  
      if (this.touched){
        this.dragged = true
      }
    }
  
    spritePointerUp(event){
     if (!this.parent.dragged && this.touched && this.parent.activated) {
        this.dragged = false
        this.active = !this.active
        this.alpha = 0.2
        this.texture = this.active ? this.myB : this.myA
        this.myColor = this.parent.color
        TweenLite.to(this,0.1,{alpha: 1})
        if (this.active){
          this.parent.numerator +=1
        } else {
          this.parent.numerator -=1
        }
       }
       this.parent.descriptor.draw(this.parent.numerator,this.parent.denominator,this.parent.DESCRIPTOR_WIDTH)
       this.touched = false
    }
  
  
    containerPointerDown(event) {
      this.data = event.data
      this.startWidth = this.width
      this.dragged = false
      this.dragStartY = event.data.global.y
      this.dragStartX = event.data.global.x
      this.touching = true
      this.deltaTouch = {
        x: this.x - event.data.global.x,
        y: this.y - event.data.global.y
      }
    }
  
    containerPointerUp(event) {
      this.touching = false
      this.activated = true
    }
  
    containerPointerMove(event) {
  
      if (this.touching){
        this.y = this.lockY ? this.y : event.data.global.y + this.deltaTouch.y
        this.x = event.data.global.x + this.deltaTouch.x
        if (Math.abs(this.x - this.dragStartX-this.deltaTouch.x) > 100){
           this.dragged = true
        }
      }
    }
  }
  
  
  
 
export function VerticalRow(num,den,width,app){

  // Internal Params
  let touching = true   
  let containerMoving = false
  let activated = true
  this.value = 0

  // Placeholders
  let BAR_HEIGHT = 50
  let LINE_WIDTH = 4
  let LINE_MAX = 20
  let LINE_START = 0

  // Default values
  this.numerator = num
  this.denominator = den
  this.width = width

  this.container = new PIXI.Container()
  this.container.width = width
  this.container.interactive = true
  this.container.y = 0
  this.container.x = 0
  this.sprites = []


  this.blockWidth = width / this.denominator

  this.blockA = new PIXI.Graphics()
  this.blockA.lineStyle(3,0x000000) 
  this.blockA.drawRoundedRect(0,0,this.blockWidth,BAR_HEIGHT,1)
  let myA = app.renderer.generateTexture(this.blockA)

  this.blockB = new PIXI.Graphics()
  this.blockB.beginFill(0xff4772)
  this.blockB.lineStyle(3,0x000000) 
  this.blockB.drawRoundedRect(0,0,this.blockWidth,BAR_HEIGHT,1)
  let myB = app.renderer.generateTexture(this.blockB)

  let g = new PIXI.Graphics()    

  this.incDenonimator = (inc) => {
  if (this.denominator + inc >= 1) {
    console.log("shouldn't exectuve if this.denominator is equal to 1",this.denominator)
    g.clear()
    g.lineStyle(3,0x000000) 
    g.drawRoundedRect(0,0,this.width,BAR_HEIGHT,1)
    let R = app.renderer.generateTexture(g)
    let s = new PIXI.Sprite()
    this.container.addChild(s)
    s.texture = R
    s.x  = 0

    if (inc > 0){
      const onComplete = ()=>{
        s.on('pointerdown',spritePointerDown)
        s.on('pointerup',spritePointerUp)
        s.on('pointermove',spritePointerMoved)
        s.interactive = true
        s.active = false
        this.sprites.push(s)
        this.draw()
      }
      TweenMax.to(this, 0.25, {denominator: this.denominator+1,onUpdate: this.draw,onComplete: onComplete})
    } else if (inc < 0) {
      let removeme  = this.sprites.pop()
      this.container.removeChild(removeme)
      const onComplete = ()=>{
        this.draw()
        this.container.removeChild(s)
      }
      TweenMax.to(this, 0.25, {denominator: this.denominator-1,onUpdate: this.draw,onComplete: onComplete})
    }
   }
  }

  this.setValue = ()=> {
    //this.value = Math.round(this.width/LINE_WIDTH*state.lineMax)
    console.log("this.value",this.value)
  }

  this.draw = (width) => {

    if (width) {
      this.width = width
    }
    this.blockWidth = this.width/this.denominator

    this.blockA.clear()
    this.blockA.lineStyle(3,0x000000) 
    this.blockA.drawRoundedRect(0,0,this.blockWidth,BAR_HEIGHT,1)
    myA = app.renderer.generateTexture(this.blockA)

    this.blockB.clear()
    this.blockB.beginFill(0xff4772)
    this.blockB.lineStyle(3,0x000000) 
    this.blockB.drawRoundedRect(0,0,this.blockWidth,BAR_HEIGHT,1)
    myB = app.renderer.generateTexture(this.blockB)

    for (let i = 0;i<this.sprites.length;i++){
      if (this.sprites[i].active){
        this.sprites[i].texture = myB
      } else {
        this.sprites[i].texture = myA
      }

      this.sprites[i].x = this.blockWidth*i
      this.sprites[i].y = 0
    }
  }

  for (let i = 0;i<this.denominator;i++) {
    let s = new PIXI.Sprite.from(myA)
    s.on('pointerdown',spritePointerDown)
    s.on('pointerup',spritePointerUp)
    s.on('pointermove',spritePointerMoved)
    s.interactive = true
    s.active = false
    s.x = i*LINE_WIDTH/this.denominator
    this.sprites.push(s)
    this.container.addChild(s)
  }
    

  //  Attached methods
  this.container.on('pointerdown',containerPointerDown)
  this.container.on('pointerup',containerPointerUp)
  this.container.on('pointermove',containerPointerMove)

  // Add children
  app.stage.addChild(this.container)
  this.width = this.container.width


  function spritePointerDown(event){
    this.touched = true
    this.dragged = false
  }

  function spritePointerMoved(event) {

    if (this.touched){
      this.dragged = true
    }
  }

  function spritePointerUp(event){
   if (!this.dragged && activated && this.touched) {
      this.dragged = false
      this.active = !this.active
      this.alpha = 0.2
      this.texture = this.active ? myB : myA
      TweenLite.to(this,0.1,{alpha: 1})
     }
     this.touched = false
  }


 function containerPointerDown(event) {
    app.stage.addChild(this)
    this.data = event.data
    this.startWidth = this.width
    this.dragStartY = event.data.global.y
    this.touching = true
    touching = true
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y
    }
  }

 function containerPointerUp(event) {
    this.touching = false
    touching = false
  }

  function containerPointerMove(event) {

    if (this.touching){
      this.y = event.data.global.y + this.deltaTouch.y
      this.x = event.data.global.x + this.deltaTouch.y
      this.dragged = true
    }
  }
  this.draw(width)
}


export class FeedBlocks extends PIXI.Container {
  constructor(app,width){
    super()
    this.blocks = []
    this.width = width
    this.height = width/30
    this.app = app
    this.denominator = 1
    this.feedBlockTimeline = new TimelineLite({paused: true})
    this.init()
  }



  init(){
    for (let i = 0;i<100;i++){
      let newFeedBlock = new PIXI.Graphics()
      newFeedBlock.beginFill(CONST.COLORS.BLUE)
      this.currentFillColor = CONST.COLORS.BLUE
      newFeedBlock.drawRect(0,0,100,30)
      this.blocks.push(newFeedBlock)
      this.addChild(newFeedBlock)
    }
  }

  showTo(n){
    this.blocks.forEach((b,i)=>{
      if (i<n){
        b.alpha = 1
      } else {
        b.alpha = 0
      }
    })
  }

  resize(whole,den,color) {
    if (color){
      let c = color ? color : CONST.COLORS.BLUE
      let lineColor = (den%2 == 0 && den <= 12) ? 0xffffff : 0x000000
      this.currentFillColor = c 
      this.currentLineColor = lineColor
    } 

    let _width
    if (den){
      _width = whole/den
      this.denominator = den
    } else {
      _width = whole/this.denominator
    }

    this.blocks.forEach(b=>{
      b.clear()
      b.lineStyle(1,this.currentLineColor)
      b.beginFill(this.currentFillColor)
      b.drawRect(0,0,_width,30)
    })


    this.blocks.forEach((b,i)=>{
      b.width = _width
      b.x = i*_width
    })
  }

  flash(num,den,whole,duration){ 
    this.hide()
    let width = whole/den
    this.denominator = den
    for (let i = 0;i<num;i++){
      let block = this.blocks[i]
      block.width = width 
      block.x = i*width
      TweenLite.to(block,1,{alpha: 1})
      setTimeout(()=>{TweenLite.to(block,1,{alpha: 0})},duration)
    }
  }

  hide(){
    this.blocks.map(b=>{b.alpha = 0})
  }

}

export class Draggable extends PIXI.Sprite {
  constructor(texture){
    super()
    this.dragged = false
    this.touching = false
    this.interactive = true
    this.lockX = false 
    this.lockY = false
    this.texture = texture
    this.on('pointerdown',this.pointerDown)
    this.on('pointermove',this.pointerMove)
    this.on('pointerup',this.pointerUp)
    this.on('pointerupoutside',this.pointerUpOutside)
  }

  pointerDown(event){
    console.log("Draggable Pointer Down")
    this.touching = true
    this.dragged = false
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y
    }
  }

  
  pointerMove(event){
    if (this.touching){
      if (!this.lockX){
        this.x = event.data.global.x + this.deltaTouch.x
      } 
      if (!this.lockY){
        this.y = event.data.global.y + this.deltaTouch.y
      }
      this.dragged = true
    }
  }

  pointerUp(event){
    this.touching = false
  }
  
  pointerUpOutside(event){
    this.touching = false
  }
}

export function distance(a,b){
  let dx = a[0] - b[0]
  let dy = a[1] - b[1]
  let dx2 = dx*dx 
  let dy2 = dy*dy
  return Math.sqrt(dx2+dy2)
}


export class FractionTag extends PIXI.Container{

  constructor(num,den,width){
    super()
    this.dragged = false
    this.touching = false
    this.tipped = true
    this.interactive = true
    this.lockX = false 
    this.lockY = false
    this.fraction = new Fraction(num,den,width)
    this.fraction.includeTag()
    this.whisker = new PIXI.Graphics()
    this.whisker.lineStyle(2,0x000000)
    this.whisker.lineTo(0,20)
    this.partitionIndicator = new PIXI.Graphics()
    this.partitionIndicator.beginFill(0x000000)
    this.partitionIndicator.drawRoundedRect(0,0,width/15,width/2,0)
    this.addChild(this.partitionIndicator)
    this.addChild(this.whisker)
    this.addChild(this.fraction)

    this.on('pointerdown',this.pointerDown)
    this.on('pointermove',this.pointerMove)
    this.on('pointerup',this.pointerUp)
    this.on('pointerupoutside',this.pointerUpOutside)

    this.partitionIndicator.x = this.width/2 - 1.5

  }

  redraw(width,height){
    this.partitionIndicator.clear()
    this.partitionIndicator.beginFill(0x000000)
    this.partitionIndicator.drawRoundedRect(0,0,width/10,height,0)
  }



  setTip(tip){
    
    if (tip){
      this.partitionIndicator.alpha = 1
    } else {
      this.partitionIndicator.alpha = 0
    }
    this.tipped = tip
  }

  pointerDown(event){
    console.log("pointerdown")
    this.touching = true
    this.dragged = false
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y
    }
  }

  whiskerTo(length,numberlineY,hide){
    this.partitionIndicator.x = this.width/2

    // FEATURE
    if (this.y < numberlineY){
      this.whisker.x = this.width/2
      this.whisker.y = this.fraction.height
      this.whisker.height = length - this.fraction.height
      this.partitionIndicator.x = this.width/2-this.partitionIndicator.width/2
      this.partitionIndicator.y = length - this.partitionIndicator.height/2
    } else {
      if (hide) {
        this.fraction.hide("")
      }
      this.partitionIndicator.y = -length - this.partitionIndicator.height/2
      this.partitionIndicator.x = this.width/2-this.partitionIndicator.width/2
      this.whisker.height = -length
      this.whisker.x = this.width/2
      this.whisker.y = 0
    }
  }

  
  pointerMove(event){
    if (this.touching){
      if (!this.lockX){
        this.x = event.data.global.x + this.deltaTouch.x
      } 
      if (!this.lockY){
        this.y = event.data.global.y + this.deltaTouch.y
      }
      this.dragged = true
    }
  }

  pointerUp(event){
    this.touching = false
  }
  
  pointerUpOutside(event){
    this.touching = false
  }
}

export class Fraction extends PIXI.Container {
  constructor(n,d,w,color){
    super()
    this._width = w
    this.numerator = n+""
    this.denominator = d+""
    this.makeWhole = false
    this.numDigits = this.numerator.length
    this.denDigits = this.denominator.length 
    this.maxDigits = 2
    this.fontSize = w/(this.maxDigits)
    this.compression = 0.9
    this.lineCompression = 20
    this.dragged = false
    this.touching = false
    this.interactive = true
    this.lockX = false 
    this.lockY = false
    this.tagColor = color ? color : "0xffffff"
    this.tag = new PIXI.Graphics()
    this.tag.beginFill(color)
    this.tag.drawRoundedRect(0,0,w,2*w,1)

    if (this.maxDigits == 3){
      this.compression = 1.5
      this.lineCompression = 30
    } else if (this.maxDigits == 2){
      this.compression = 1.3
      this.lineCompression = 25
    }

    // Numerator
    this.N = new PIXI.Text()
    this.N.anchor.x = 0.5
    this.N.x = this._width/2
    this.N.y = 0
    this.N.text = n
    this.N.style.fontSize = this.fontSize
    this.addChild(this.N)

    // Denominator
    this.D = new PIXI.Text()
    this.D.anchor.x = 0.5
    this.D.x = this._width/2
    this.D.y = this.height
    this.D.text = d
    this.D.style.fontSize = this.fontSize
    this.addChild(this.D)

    // Mid Line
    this.L = new PIXI.Graphics()
    this.L.lineStyle(this._width/this.lineCompression,0x000000)
    this.L.lineTo(this._width,0)
    this.L.y = this.height/2
    this.addChild(this.L)

    this.draw(n,d,w)
  }

  includeTag() {
      this.addChild(this.tag)
      this.addChild(this.L)
    }

  hide(mark){
    this.N.text = "?"
    this.D.text = "?"
  }

  makeDraggable() {
    this.on('pointerdown',this.pointerDown)
    this.on('pointermove',this.pointerMove)
    this.on('pointerup',this.pointerUp)
    this.on('pointerupoutside',this.pointerUpOutside)  
  }


  pointerDown(event){
    this.touching = true
    this.dragged = false
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y
    }
  }

  
  pointerMove(event){
    if (this.touching){
      if (!this.lockX){
        this.x = event.data.global.x + this.deltaTouch.x
      } 
      if (!this.lockY){
        this.y = event.data.global.y + this.deltaTouch.y
      }
      this.dragged = true
    }
  }

  pointerUp(event){
    this.touching = false
  }
  
  pointerUpOutside(event){
    this.touching = false
  }

  draw(n,d,_w){

    this.numerator = n+""
    this.denominator = d+""
    let drawingAWholeNumber = this.numerator%this.denominator == 0

    if (drawingAWholeNumber && this.makeWhole){
      this.numerator = this.numerator/this.denominator
      this.denominator = 1
    } 

    this.numDigits = this.numerator.length
    this.denDigits = this.denominator.length 
    this.maxDigits = Math.max(this.numDigits,this.denDigits)
    this.minDigits = Math.min(this.numDigits,this.denDigits)
    this.fontSize = _w/2
    this.compression = 0.9

    if (this.maxDigits == 3){
      this.compression = 1.5
      this.lineCompression = 30
    } else if (this.maxDigits == 2){
      this.compression = 1.3
      this.lineCompression = 25
    } else if (this.maxDigits == 1) {
      this.compression = 1.3
      this.lineCompression = 15
      _w = _w/1.5
    }

    if (this.hideDenominator == true){
      this.L.alpha = 0
      this.D.alpha = 0
      this.fontSize = _w
    } else {
      this.L.alpha = 1
      this.D.alpha = 1
    }
    
    let textColor = (this.denominator%2 == 0 && this.denominator <= 12) ? 0xffffff : 0x000000

    // Numerator
    this.N.x = _w/2
    this.N.y = 0
    this.N.style.fontSize = this.fontSize*this.compression
    this.N.style.fill = textColor
    this.N.text = this.numerator
    this.addChild(this.N)

    // Denominator
    this.D.x = _w/2
    this.D.y = this.N.height
    this.D.style.fill = textColor
    this.D.style.fontSize = this.fontSize*this.compression
    this.D.text = this.denominator
    this.addChild(this.D)

    // Line
    this.L.clear()
    this.L.lineStyle(_w/this.lineCompression,textColor)
    this.L.lineTo(_w,0)
    this.L.y = this.N.height

    this.tag.clear()
    let color = CONST.FRACTION_TAG_COLORS[this.denominator] ?  CONST.FRACTION_TAG_COLORS[this.denominator] : 0xffffff
    this.tag.beginFill(color)
    this.tag.drawRoundedRect(0,0,this.width,this.height,4)

  }
}


export class BasicFraction extends PIXI.Container {
  constructor(n,d,w,color){
    super()
    this._width = w
    this.numerator = n+""
    this.denominator = d+""
    this.makeWhole = false
    this.numDigits = this.numerator.length
    this.denDigits = this.denominator.length 
    this.maxDigits = 2
    this.fontSize = w/(this.maxDigits)
    this.compression = 0.9
    this.lineCompression = 20
    this.dragged = false
    this.touching = false
    this.interactive = true
    this.lockX = false 
    this.lockY = false
    this.tagColor = color ? color : "0xffffff"

    if (this.maxDigits == 3){
      this.compression = 1.5
      this.lineCompression = 30
    } else if (this.maxDigits == 2){
      this.compression = 1.3
      this.lineCompression = 25
    }

    // Numerator
    this.N = new PIXI.Text()
    this.N.anchor.x = 0.5
    this.N.x = this._width/2
    this.N.y = 0
    this.N.text = n
    this.N.style.fontSize = this.fontSize
    this.addChild(this.N)

    // Denominator
    this.D = new PIXI.Text()
    this.D.anchor.x = 0.5
    this.D.x = this._width/2
    this.D.y = this.height
    this.D.text = d
    this.D.style.fontSize = this.fontSize
    this.addChild(this.D)

    // Mid Line
    this.L = new PIXI.Graphics()
    this.L.lineStyle(this._width/this.lineCompression,0x000000)
    this.L.lineTo(this._width,0)
    this.L.y = this.height/2
    this.addChild(this.L)

    this.draw(n,d,w)
  }

  includeTag() {
      this.addChild(this.tag)
      this.addChild(this.L)
    }

  hide(mark){
    this.N.text = "?"
    this.D.text = "?"
  }

  makeDraggable() {
    this.on('pointerdown',this.pointerDown)
    this.on('pointermove',this.pointerMove)
    this.on('pointerup',this.pointerUp)
    this.on('pointerupoutside',this.pointerUpOutside)  
  }


  pointerDown(event){
    this.touching = true
    this.dragged = false
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y
    }
  }

  
  pointerMove(event){
    if (this.touching){
      if (!this.lockX){
        this.x = event.data.global.x + this.deltaTouch.x
      } 
      if (!this.lockY){
        this.y = event.data.global.y + this.deltaTouch.y
      }
      this.dragged = true
    }
  }

  pointerUp(event){
    this.touching = false
  }
  
  pointerUpOutside(event){
    this.touching = false
  }

  draw(n,d,_w){

    this.numerator = n+""
    this.denominator = d+""
    let drawingAWholeNumber = this.numerator%this.denominator == 0

    this.L.alpha = 1
    this.D.alpha = 1

    if (drawingAWholeNumber && this.makeWhole){
      this.numerator = Math.round(this.numerator/this.denominator)+""
      this.L.alpha = 0 
      this.D.alpha = 0
    } 

    this.numDigits = this.numerator.length
    this.denDigits = this.denominator.length 
    this.maxDigits = Math.max(this.numDigits,this.denDigits)
    this.minDigits = Math.min(this.numDigits,this.denDigits)
    this.fontSize = _w/2
    this.compression = 0.9

    if (this.maxDigits == 3){
      this.compression = 1.5
      this.lineCompression = 30
    } else if (this.maxDigits == 2){
      this.compression = 1.3
      this.lineCompression = 25
    } else if (this.maxDigits == 1) {
      this.compression = 1.3
      this.lineCompression = 15
      _w = _w/1.5
    }

    
    let textColor = (this.denominator%2 == 0 && this.denominator <= 12 && this.noAlternating) ? 0xffffff : 0x000000

    // Numerator
    this.N.x = _w/2
    this.N.y = 0
    this.N.style.fontSize = this.fontSize*this.compression
    this.N.style.fill = textColor
    this.N.text = this.numerator
    this.addChild(this.N)

    // Denominator
    this.D.x = _w/2
    this.D.y = this.N.height
    this.D.style.fill = textColor
    this.D.style.fontSize = this.fontSize*this.compression
    this.D.text = this.denominator
    this.addChild(this.D)

    // Line
    this.L.clear()
    this.L.lineStyle(_w/this.lineCompression,textColor)
    this.L.lineTo(_w,0)
    this.L.y = this.N.height


  }
}


export class DraggablePoly extends Draggable {
  constructor(points,app){


    let xS = points.map(p=> p[0])
    let yS = points.map(p=> p[1])
    let minX = Math.min(...xS)
    let minY = Math.min(...yS)

    let flatPolygon = []
    points.forEach(p=>{
      flatPolygon.push(p[0]-minX)
      flatPolygon.push(p[1]-minY)
    })
    let DUMMY = 100
    let a = polygonArea(points)/DUMMY
    let f = decimalToFrac(a)
   
    var graphics = new PIXI.Graphics();
    graphics.beginFill(0xff3b55);
    graphics._fillStyle.alpha = 0.85
    graphics.lineStyle(2,0xffffff)
    graphics.drawPolygon(flatPolygon);
    graphics.endFill();

    var graphicsB = new PIXI.Graphics();
    graphicsB.beginFill(0x1291db);
    graphicsB._fillStyle.alpha = 0.85
    graphicsB.lineStyle(2,0xffffff)
    graphicsB.drawPolygon(flatPolygon);
    graphicsB.endFill();

    let t = app.renderer.generateTexture(graphics)
    let tb = app.renderer.generateTexture(graphicsB)
 
    // Construct Super
    super(t)

    this.hitArea = new PIXI.Polygon(flatPolygon)
    this.points = points
    this.textureA = t
    this.textureB = tb
    this.rotated = false
    this.pivot.x = this.width/2
    this.pivot.y = this.height/2
    this.x = minX + this.width/2
    this.y = minY + this.height/2
    this.interactive = true
    this.on('pointerdown',this.polyPointerDown)
    this.on('pointerup',this.polyPointerUp)
    this.on('pointermove',this.polyPointerMove)
    this.on('pointerleave',this.polyPointerLeave)
  }

  polyPointerLeave(){
  }

  
  polyPointerDown(){
  
  }

  polyPointerMove(){
   
  }

  // Extracts the global location of the points from the hit area.
  getPolyPoints(){
    let w = this.width 
    let h = this.height
    let originX = this.x - this.width/2
    let originY = this.y - this.height/2
    let xS = []
    let yS = []

    // Extract x and y
    this.hitArea.points.forEach((e,i)=>{
    if (i%2 == 1){
        yS.push(e)
      } else {
        xS.push(e)
      }
    })

    // Zip x and y
    let polyPoints = xS.map((x,i) =>{
      return [x,yS[i]]
    })

    // Rotate
    polyPoints = polyPoints.map(p=>{return rotatePoint(p[0]-this.width/2,p[1]-this.height/2,this.rotation)})
    // Offset
    polyPoints = polyPoints.map(p=>{return [p[0]+originX+this.width/2,p[1]+originY+this.height/2]})

    return polyPoints
  }

  // I don't think I need this here.
  polyPointerUp(){
    this.getPolyPoints()
  }
}


// Helpers

function appxEq(a,b,t){
  return Math.abs(a-b) < t
}

export function decimalToFrac(dec) {
  for (let i=1;i<100;i++){
    for (let j=0;j<=i;j++){
      if (Math.abs(j/i - dec) < 0.001) {
        return [j,i]
      }
    }
  }
}

export function polygonArea(poly) {
  let xS = poly.map(p => p[0])
  let yS = poly.map(p => p[1])

   // Calculate value of shoelace formula 
   let n = poly.length
   let j = n - 1 
   let area = 0
   for (let i = 0; i < n; i++) { 
       area = area + (xS[j] + xS[i]) * (yS[j] - yS[i]);
       j = i;  // j is previous vertex to i 
   } 
 
   // Return absolute value (why over 2?)
   return Math.abs(area / 2)
} 

// Lines & Polygons

export function linesIntersect(l1,l2){
  let m1 = l1.m
  let m2 = l2.m 
  let b1 = l1.b
  let b2 = l2.b

  if (l1.vertical && l2.vertical){
    return false
  } else if (l1.horizontal && l2.horizontal){
    return false
  } else {

    let xIntersect = (b1 - b2)/(m2-m1)
    let yIntersect = null

    if (l1.vertical){ 
      yIntersect = l2.yOf(l1.x1)
      xIntersect = l1.x1
    } else if (l2.vertical){

      yIntersect = l1.yOf(l2.x1)
      xIntersect = l2.x1
    } else {
      yIntersect = l1.yOf(xIntersect)
    }

    // Chopping off decimals.
    yIntersect = Math.trunc(yIntersect*1000)/1000
    xIntersect = Math.trunc(xIntersect*1000)/1000


    // Padding 
    let p = -5
    let inYRange1 = l1.horizontal ? true : (yIntersect > l1.yMin+p) && (yIntersect < l1.yMax-p)
    let inXRange1 = l1.vertical ? true : (xIntersect > l1.xMin+p) && (xIntersect < l1.xMax-p)
    let inYRange2 = l2.horizontal ? true : (yIntersect > l2.yMin+p) && (yIntersect <= l2.yMax-p)
    let inXRange2 = l2.vertical ? true : (xIntersect > l2.xMin+p) && (xIntersect < l2.xMax-p)

    console.log("inYRange1,inXRange1,inYRange2,inXRange2",inYRange1,inXRange1,inYRange2,inXRange2)

    return (inXRange1 && inXRange2 && inYRange1 && inYRange2) && [xIntersect, yIntersect]
  } 
}

class Line {
  constructor(p1,p2){
    this.start = p1 
    this.end = p2
    this.x1  = p1[0]
    this.y1 = p1[1]
    this.x2  = p2[0]
    this.y2 = p2[1]

    this.yMax = Math.max(this.y1,this.y2)
    this.yMin = Math.min(this.y1,this.y2)
    this.xMax = Math.max(this.x1,this.x2)
    this.xMin = Math.min(this.x1,this.x2)

    this.p1 = p1
    this.p2 = p2

    this.m = (this.y2-this.y1)/(this.x2-this.x1)

    // Relaxed this criteria because its need for really steep lines (the ones for grid nodees were almost perfect so it didn't matter)
    this.vertical = Math.abs(this.m) > 100 ? true : false 
    this.horizontal = Math.abs(this.m) < 0.01 ? true : false

    this.b = this.vertical ? null : this.y1 - this.m*this.x1

  }

  yOf(x){
    return this.m*x+this.b
  }

  xOf(y){
    return (y-this.b)/this.m
  }
}

function lineContains(line,p){
  // Tolerance
  let x = p[0]
  let y = p[1]
  let t = 0.001
  if (line.vertical){
    if (appxEq(line.x1,x,t)){
      if (y>line.yMin && y < line.yMax) {
        return true
      }
    }
  } else if (line.horizontal){
    if (appxEq(line.y1,y,t)){
      if (x>line.xMin && x < line.xMax) {
        return true
      }
    }
  } else if (appxEq(line.yOf(x),y,t)) {
      console.log("calculating ranges")
      let inXRange = x > line.xMin && x < line.xMax
      let inYRange = y > line.yMin && y < line.yMax
      console.log("ranges",inXRange,inYRange)
      if (inXRange && inYRange){
        return true
      }
  } else {
    return false
  }
}

export function getIntersectionPoints(lineEndPoints,polyPoints){
  let line = new Line(lineEndPoints[0],lineEndPoints[1]) // Line
  let lines = getLinesFromPoly(polyPoints) // Array of Lines

  let intersectionPoints = []

  lines.forEach((l,i) => {
      let intersectionPoint = linesIntersect(l,line)
      intersectionPoints.push(intersectionPoint)
  })

  let filtered = intersectionPoints.filter(e=> e != false)
  let deduped = removeDuplicatePoints(filtered,5)
  
  return deduped
}

export function getLinesFromPoly(poly){
  let n = poly.length
  let lines = poly.map((p,i)=>{
   // console.log("making a line")
    return new Line(p,poly[(i+1)%n])
  })
  return lines
}

export function splitMultiplePolygons(line,polys){
  let newPolys  = []
  polys.forEach(p=>{
    // Returns original polygon if it can't be split.
    let splitPoly = splitPolygon(line,p)
    newPolys.push(...splitPoly)
  })
  return newPolys
}


export function pointsApproximatelyEqual(points,tolerance){
  return distance(points[0],points[1]) < tolerance
}

export function removeDuplicatePoints(points,tolerance){
  console.log("before removal",points.length)
  let removed = []
  points.forEach(p=>{
    let addMe = true
    removed.forEach(r=>{
      if (pointsApproximatelyEqual([p,r],tolerance)){
        addMe = false
      }
    })
    if (addMe){
      removed.push(p)
    }
  })
  console.log("after removal",removed.length)
  return removed
}


export function splitPolygon(line,poly) {
  console.log("calling split polygon")

  // Make the array of lines.
  let lines = getLinesFromPoly(poly)

  // Check to make sure it was a valid cut.
  let points = getIntersectionPoints(line,poly)
  if (points.length < 2){
    return [poly]
  }

  let primaryPoly = []
  let secondaryPoly = []
  let primary = true
  let cutter = new Line(line[0],line[1])

  lines.forEach((l,i) => {
      let intersect = linesIntersect(l,cutter)
       if (primary){
         primaryPoly.push(l.start)
       } else {
         secondaryPoly.push(l.start)
       }

       if (intersect){
         if (pointsApproximatelyEqual([intersect,l.end],5)){
         } else {
           primaryPoly.push(intersect)
           secondaryPoly.push(intersect)
           primary = !primary
         }
       }
  })
  let primaryPolyDeduped = removeDuplicatePoints(primaryPoly,5)
  let secondaryPolyDeduped = removeDuplicatePoints(secondaryPoly,5)

  return [primaryPolyDeduped,secondaryPolyDeduped]
}

export function distanceFromNearestNode(x,y,dxy){
  let deltaX = Math.abs(Math.round(x/dxy)*dxy-x)
  let deltaY = Math.abs(Math.round(y/dxy)*dxy-y)
  let distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY)
  console.log("distance",distance)
  return distance
}

export function rotatePoint(x,y,theta){
  let _x = x*Math.cos(theta) - y*Math.sin(theta)
  let _y = y*Math.cos(theta) + x*Math.sin(theta)
  return [_x,_y]
}

export function getIndexOfNearestVertice(vertices,dxy){
  console.log("verices",vertices)
  let distance = 100000
  let index = null
  vertices.forEach((v,i)=>{
    let x = v[0]
    let y = v[1]
    let newDistance = distanceFromNearestNode(x,y,dxy)
    if (newDistance <  distance){
      index = i
      distance = newDistance
    }
  })
  return index
}

export function getNearestNodeMetadata(nodes,point){
  let d = 1000000
  let nearestMetadata = {}
  nodes.forEach((n,i)=>{
    let x = n.x
    let y = n.y
    let newDistance = distance([x,y],point)
    //console.log("points",n.x,n.y,point[0],point[1])
    if (newDistance <  d){
      d = newDistance
      nearestMetadata.dx = point[0] - x 
      nearestMetadata.dy = point[1] - y
      nearestMetadata.distance = newDistance
    }
  })
  return nearestMetadata
}

// Number Line Helpers

function getNumbersNeeded(max, min, step) {
  let numbersNeeded = {};
  let start = Math.ceil(min / step) * step;
  let currentNumber = start;
  let digits = digitCount(step);

  while (currentNumber <= max && currentNumber >= start) {
    let cleanNumber = Math.round(currentNumber / step) * step;
    if (cleanNumber % 1 != 0) {
      cleanNumber = currentNumber.toFixed(digits - 1);
    }
    // Add this number to the list of numbers needed.
    numbersNeeded[cleanNumber] = true;
    currentNumber += step;
  }
  return numbersNeeded;
}

function digitCount(n) {
  var count = 1;

  if (n >= 1) {
    while (n / 10 >= 1) {
      n /= 10;
      ++count;
    }
    return count;
  } else {
    ++count;
    while (n % 1 != 0) {
      n *= 10;
      ++count;
    }
    return count - 1;
  }
}

// Number Line


export class UltimateNumberLine extends PIXI.Container {
  constructor(min, max, width,app) {
    super();
    this.labels = [];
    this.ticks = []
    this.min = min;
    this.max = max;
    this.minFloat = min;
    this.maxFloat = max;
    this._width = width;
    this.lineThickness = width / 300;
    this.interactive = true

    this.flexPoint = 0


    // Default values. Dictate how much you can zoom in and out.
    this.upperLimit = 50
    this.lowerLimit = -50
    this.upperRange = this.upperLimit - this.lowerLimit
    this.lowerRange  = 5

    this.setLayoutParams(min, max);

    this.majorTick = new PIXI.Graphics();
    this.majorTick.lineStyle(this.majorTickThickness, 0x000000);
    this.majorTick.lineTo(0, this.majorTickHeight);
    this.majorTickTexture = app.renderer.generateTexture(this.majorTick);

    this.minorTick = new PIXI.Graphics();
    this.minorTick.lineStyle(this.minorTickThickness, 0x000000);
    this.minorTick.lineTo(0, this.minorTickHeight);
    this.minorTickTexture = app.renderer.generateTexture(this.minorTick);

    this.line = new PIXI.Graphics();
    this.line.lineStyle(this.lineThickness, 0x000000);
    this.line.lineTo(width, 0);
    this.line.y = this.line.y + this.lineThickness/2
    this.addChild(this.line);

    this.on('pointerdown',this.pointerDown)
    this.on('pointerup',this.pointerUp)
    this.on('pointerupoutside',this.pointerUp)
    this.on('pointermove',this.pointerMove)

    this.init();
  
    //this.hitArea = new PIXI.Rectangle(0,0,this.width,this.height)

    this.draw(this.minFloat,this.maxFloat)

  }

  roundValueToNearestTick(xPos){
    let val = this.getNumberLineFloatValueFromPosition(xPos)
    let roundedVal = Math.round(val/this.minorStep)*this.minorStep
    return this.getNumberLinePositionFromFloatValue(roundedVal)
  }

  setBoundaries(lowerLimit,upperLimit,lowerRange){
    this.lowerLimit = lowerLimit
    this.upperLimit = upperLimit
    this.upperRange = this.upperLimit - this.lowerLimit
    this.lowerRange = lowerRange
  }

  centerZero(){
    return {x: this.x + this.getNumberLinePositionFromFloatValue(0),y: this.y}
  }

  numberLineParameters(min, max, width) {
    let majorSteps = [
      0.00001,
      0.00005,
      0.0001,
      0.0005,
      0.001,
      0.005,
      0.01,
      0.05,
      0.1,
      0.5,
      1,
      5,
      10,
      50,
      100,
      500,
      1000,
      5000,
      10000,
      50000,
      100000,
    ];
    let minorSteps = [
      0.00001,
      0.00005,
      0.0001,
      0.0005,
      0.001,
      0.005,
      0.01,
      0.1,
      1,
      5,
      10,
      50,
      100,
      500,
      1000,
      5000,
      10000,
      50000,
      100000,
    ];
    let minorStepIndex = 0;
    let majorStepIndex = -1;
    let digitHeight = 0;
    let ticksNeeded = (max - min) / minorSteps[minorStepIndex];
    let majorStep = 0.0001;
    let minorStep = 0.0001;

    while (digitHeight < width / 50) {
      majorStepIndex += 1;
      let numberOfIncrements = Math.round(
        (max - min) / majorSteps[majorStepIndex]
      );
      let maxDigits = 1;
      if (majorSteps[majorStepIndex] >= 1) {
        if (min < 0){
          maxDigits = digitCount(Math.floor(Math.abs(min))) + 1
        } else {
          maxDigits = digitCount(Math.ceil(max));
        }
      } else {
        if (min < 0){
          maxDigits = digitCount(Math.abs(Math.floor(min)))+digitCount(majorSteps[majorStepIndex]) + 1
        } else {
          maxDigits = digitCount(Math.ceil(max))+digitCount(majorSteps[majorStepIndex]);
        }

      }

      let numberOfDigitWidths = (maxDigits + 1) * (numberOfIncrements - 1);

      let digitWidth = width / numberOfDigitWidths;
      digitHeight = (6 / 5) * digitWidth;
      minorStep = minorSteps[majorStepIndex - 1];
      majorStep = majorSteps[majorStepIndex];
    }

    while (ticksNeeded >= 100) {
      minorStepIndex += 1;
      ticksNeeded = (max - min) / minorSteps[minorStepIndex];
      minorStep = minorSteps[minorStepIndex];
    }

    digitHeight = width / 50;

    const params = {
      MAJOR_STEP: majorStep,
      MINOR_STEP: minorStep,
      DIGIT_HEIGHT: digitHeight,
    };
    return params;
  }


  // Pasted from somewhere else - arguments not necessary, should access class variables.
  placeLabels(labels, values, dx, digitHeight) {
    labels.forEach((l) => {
      let currentValue = l.value;
      // If the value of this label isn't null, we know it's already active and on the number line.
      let activeLabel = currentValue != null;
      let needsToBeSet = activeLabel && values[currentValue];
      delete values[currentValue];
      // If the label is active and still a value that needs to be set, reposition it.
      if (needsToBeSet) {
        l.text = l.value;
        l.x = (l.value - this.min) * dx;
        l.style.fontSize = this.digitHeight;
        l.alpha = 1;

        // If it's active, but not part of the new active labels, remove it and set value null.
      } else if (activeLabel) {
        // Hide / remove
        l.value = null;
        l.alpha = 0;
      }
    });

    let empties = labels.filter((l) => l.value == null);

    let valueKeys = Object.keys(values);

    valueKeys.forEach((k) => {
      if (empties.length != 0) {
        let newActiveLbl = empties.pop();
        newActiveLbl.value = k;
        newActiveLbl.text = k;
        newActiveLbl.x = (k - this.min) * dx;
        newActiveLbl.alpha = 1;
      }
    });
  }

  placeTicks(ticks, values, dx, textures, majorStep) {

    this.ticks.forEach((l, i) => {
      let currentValue = l.value;
      let activeLabel = currentValue != null;
   
      let needsToBeSet = activeLabel && values[currentValue];
      delete values[currentValue];

      // If the label is active and still a value that needs to be set, reposition it.
      if (needsToBeSet) {
        l.text = l.value;
        l.x = dx * (l.value - this.min);
        l.y = 0;
        l.alpha = 1;
        let mod = Math.abs(l.value%majorStep/majorStep)
        if (mod < 0.01 || mod > 0.99) {
          l.texture = textures[0];
        } else {
          l.texture = textures[1];
        }

        // If it's active, but not part of the new active labels, remove it and set value null.
      } else if (activeLabel) {
        l.value = null;
        l.alpha = 0;
      }
    });

    let empties = ticks.filter((l) => l.value == null);

    let valueKeys = Object.keys(values);

    valueKeys.forEach((k) => {
      if (empties.length != 0) {
        let newActiveTick = empties.pop();
        newActiveTick.value = k;
        newActiveTick.x = (k - this.min) * dx;
        newActiveTick.alpha = 1;
      }
    });
  }

  pointerUp(){
    this.touching = false
  }

  pointerDown(e){
    this.touching = true
    let pA = e.data.getLocalPosition(this).x
    this.vA = this.getNumberLineFloatValueFromPosition(pA)
  }

  pointerMove(e){
    if(this.touching){
      let pM = this._width 
      let pm = 0
      let pC = this.getNumberLinePositionFromFloatValue(this.flexPoint)
      let pA = e.data.getLocalPosition(this).x
      let vC = this.flexPoint
      let vA = this.vA
      let vM = vC + (pM-pC)/(pA-pC)*(vA-vC)
      let vMin = vM - (pM-pm)/(pM-pC)*(vM-vC) 
      this.draw(vMin,vM)
    }
  }

  zoomTo(min,max,duration,onComplete,onUpdate){
    const update = ()=>{
      onUpdate()
      this.draw(this.min,this.max)
    }
    TweenLite.to(this,{max: max,min: min,duration: duration,onUpdate: update,onComplete: onComplete})
  }

  getNumberLineFloatValueFromPosition(pos) {
    return (pos * this.minorStep) / this.minorDX + this.minFloat;
  }

  getNumberLineMaxFromAnchor(anchor,position) {
    let max = this.minFloat + (anchor - this.minFloat)/position*this._width
    return max
  }

  getNumberLineMinFromAnchor(anchor,position) {

    let min = this.maxFloat - (this.maxFloat - anchor)/(1-position/this._width)
    return min
  }

 getNumberLinePositionFromFloatValue(val){
    let pos = (val-this.minFloat)/this.minorStep*this.minorDX
    let pos1 = (val - this.minFloat)/(this.maxFloat-this.minFloat)*this._width
    return pos1
 }

  pinPointerMove() {
    if (this.touching) {
      this.value = this.parent.getNumberLineFloatValueFromPosition(this.x);
      this.index = Math.round(this.value);
      this.parent.drawDescriptors();
    }
  }


  setLayoutParams(min, max) {
    this.params = this.numberLineParameters(min, max, this._width);
    this.majorStep = this.params.MAJOR_STEP;
    this.minorStep = this.params.MINOR_STEP;
    this.digitHeight = this.params.DIGIT_HEIGHT;

    this.majorDX =
      (this._width / (this.maxFloat - this.minFloat)) * this.majorStep;
    this.minorDX =
      (this._width / (this.maxFloat - this.minFloat)) * this.minorStep;

    this.dx = this._width / (this.maxFloat - this.minFloat);

    this.minorTickHeight = this._width / 60;
    this.majorTickHeight = 1.5 * this.minorTickHeight;

    this.minorTickThickness = Math.min(this.majorDX / 3, this.lineThickness);
    this.majorTickThickness = this.minorTickThickness * 1.25;
  }

  // NLD_DRAW
  draw(min, max) {


    let range = max - min

    if (max < this.upperLimit && min > this.lowerLimit && range > this.lowerRange && range < this.upperRange ) {


    this.min = min;
    this.max = max;
    this.minFloat = min;
    this.maxFloat = max;

    this.setLayoutParams(min, max);


    let numbersNeededForLabels = getNumbersNeeded(max, min, this.majorStep);
    let numbersNeededForTicks = getNumbersNeeded(max, min, this.minorStep);

    this.placeLabels(
      this.labels,
      numbersNeededForLabels,
      this.dx,
      this.digitHeight
    );

    this.placeTicks(
      this.ticks,
      numbersNeededForTicks,
      this.dx,
      [this.majorTickTexture, this.minorTickTexture],
      this.majorStep
    );

  }

  // Execute callback if it's available.
  this.onUpdate && this.onUpdate()
}

  init() {
    for (let i = 0; i <= 100; i++) {
      let newTick = new PIXI.Sprite(this.majorTickTexture);
      newTick.anchor.set(0.5, 0);
      newTick.value = null;
      newTick.alpha = 0;
      this.addChild(newTick);
      this.ticks.push(newTick);

      let newLabel = new PIXI.Text();
      newLabel.style.fontSize = this.digitHeight;
      newLabel.style.fontFamily = "Chalkboard SE";
      newLabel.style.fill = 0x000000;
      newLabel.anchor.set(0.5, 0);
      newLabel.text = i;
      newLabel.value = null;
      newLabel.alpha = 0;
      this.addChild(newLabel);
      this.labels.push(newLabel);
      newLabel.y = 1.1 * this.majorTickHeight;
    }
    this.draw(this.min, this.max);
  }
}




export class NumberLine extends PIXI.Container {
  constructor(width,height,max,denominator){
    super()

    this.onPinDrag = ()=>{}
    this.onIncrement = () => {}
    this.onDecrement = () => {}

    this.max = max
    this.hideFractions = false
    this.flipped = false
    this.everyOther = false
    this.denominator = denominator
    this.open = false

    // Layout parameters
    this._height = height
    this._width = width
    this.lineThickness = height/10
    this.minorTickHeight = height/1.25
    this.majorTickHeight = height
    this.dx = this._width/max
    this.whole = this.dx*this.denominator


    // Elements
    this.ticks = []
    this.labels = []

    this.line = new PIXI.Graphics()
    this.incDenominatorBtn = new PIXI.Sprite.from(CONST.ASSETS.PLUS)
    this.decDenominatorBtn = new PIXI.Sprite.from(CONST.ASSETS.MINUS)
    
    this.incDenominatorBtn.interactive = true
    this.incDenominatorBtn.on('pointerdown',()=>{this.incDenominator(1)})
    this.decDenominatorBtn.interactive = true
    this.decDenominatorBtn.on('pointerdown',()=>{this.incDenominator(-1)})

    const PIN_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.MOVER_DOT)
    this.pin = new Draggable(PIN_TEXTURE)
    this.pin.lockY = true
    this.pin.anchor.set(0.5,0.5)
    this.pin.width = this._height
    this.pin.height = this._height
    this.pin.on('pointermove',()=>{
      if (this.pin.touching){
        this.onPinDrag()
        console.log("this.max",this.max)
        if (this.pin.x >= this._width/(this.cap+0.1)){
          this.set(this.pin.x)
        } else {
          this.pin.x = this._width/(this.cap+0.1)
        }
      }
    })
    this.pin.on('pointerup',()=>{
      this.incDenominator(0)
      this.set(this.pin.x)
      this.addChild(this.pin)
    })
    this.pin.on('pointerupoutside',()=>{
      this.incDenominator(0)
      this.set(this.pin.x)
      this.addChild(this.pin)
    })

    /*
    this.feedBlocks = new FeedBlocks(app,this._width)
    this.addChild(feedBlocks)
    this.feedBlocks.x = this.x 
    this.feedBlocks.y = this.y - this.feedBlocks.height
    this.feedBlocks.hide()
    */


   this.addChild(this.pin)
   this.init()
  }

  hideButtons(){
    this.incDenominatorBtn.alpha = 0
    this.decDenominatorBtn.alpha = 0
  }

  init = () => {

    this.drawButtons()
    //this.incDenominatorBtn.anchor.set(0.5)
    this.addChild(this.incDenominatorBtn)

    //this.decDenominatorBtn.anchor.set(0.5)
    this.addChild(this.decDenominatorBtn)

     this.line.lineStyle(this.lineThickness,0x000000)
     this.line.x = 0
     this.line.y = 0
     this.line.lineTo(this._width,0)
     this.addChild(this.line)

     for (let i = 0;i<20;i++){
         let _x = i > this.max ? this.line.width : this.dx*i 
         let newTick = new PIXI.Graphics()
         newTick.lineStyle(this.lineThickness,0x000000)
  
         newTick.x = _x
         newTick.y = -this.minorTickHeight/2
         newTick.lineTo(0,this.minorTickHeight)
    
         this.addChild(newTick)
         this.ticks.push(newTick)

         let newLabel = new Fraction(i,this.denominator,this.dx/2)
         newLabel.makeWhole = true
         newLabel.interactive = false
         newLabel.hideDenominator = true

         this.labels.push(newLabel)
         newLabel.x = _x - newLabel.width/2
        
         newLabel.y = this.line.y + this.minorTickHeight
         this.addChild(newLabel)
     }
     this.pin.x = this.dx*this.denominator
     this.incDenominator(0)
  }

  redraw(width,height){
    // Update layout parameters.
    this.whole = this.whole/this._width*width
    this._height = height
    this._width = width
    this.lineThickness = height/10
    this.minorTickHeight = height/2
    this.majorTickHeight = height
    this.dx = this.whole/this.denominator

    this.line.clear()
    this.line.lineStyle(this.lineThickness,0x000000)
    this.line.x = 0
    this.line.y = 0
    this.line.lineTo(this._width,0)

    this.incDenominator(0)

    /*
    this.labels.forEach((l,i)=>{
      if (this.dx*6 > this._width){
        l.draw(i,this.denominator,this._width/20)
      } else if (!this.hideFractions){
        l.draw(i,this.denominator,this.dx/2)
      } else {
        l.draw(i,this.denominator,this._height)
      }
      let _x = i*this.dx > this._width  ? this.line.width : this.dx*i 
      l.draw(l.numerator,l.denominator,this.dx/2)
      l.x = _x - l.width/2
    })
    */

    this.ticks.forEach((t,j)=>{
      let _x = j*this.dx > this._width ? this.line.width : this.dx*j
      t.clear()
      t.x = _x
      t.y = -this.minorTickHeight/2
      t.lineStyle(this.lineThickness,0x000000)
      t.lineTo(0,this.minorTickHeight)
    })
    

      // Redraw the pin
      this.pin.x = this.whole
      this.pin.y = 0

      // Redraw Inc Button
      /*
      this.incDenominatorBtn.width = this._height
      this.incDenominatorBtn.height = this._height
      this.incDenominatorBtn.x = 1.05*this._width + this.incDenominatorBtn.width
      this.incDenominatorBtn.y = 0
      */

    
      // Redraw Dec Button
      /*
      this.decDenominatorBtn.width = this._height
      this.decDenominatorBtn.height = this._height
      this.decDenominatorBtn.x = 1.05*this._width
      this.decDenominatorBtn.y = 0
      */
     this.drawButtons()

  }

  drawButtons(){
    this.incDenominatorBtn.width = this._height
    this.incDenominatorBtn.height = this._height
    this.incDenominatorBtn.x = -0.1*this._width
    this.incDenominatorBtn.y = -this._height

    this.decDenominatorBtn.width = this._height
    this.decDenominatorBtn.height = this._height
    this.decDenominatorBtn.x = -0.1*this._width
    this.decDenominatorBtn.y = 0
  }

  set(whole){
    this.whole = whole
    this.dx = whole/this.denominator
    let newMax = Math.round(this.line.width/this.dx)
    this.max = newMax
    this.ticks.forEach((e,i)=> {
      let _x = this.dx*i
       if (_x > this._width){
          e.x = this._width
          e.alpha = 0
       } else {
           e.x = _x
           e.alpha = 1
       }
    })

    this.labels.forEach((e,i)=> {
    let _x = this.dx*i
     if (_x>this._width){
         e.x = this._width
         e.alpha = 0
     } else {
         e.x = this.dx*i-e.width/2
         if (e.denominator != 1 && this.hideFractions){
           e.alpha = 0
         } else {
           e.alpha = 1
         }
     }
   })
  }

  incDenominator(inc){

    if (inc > 0){
      this.onIncrement()
    } else if (inc < 0){
      this.onDecrement()
    } 
  

    if(!this.open){
    
      this.denominator += inc
      this.dx = this.whole/this.denominator
      this.ticks.forEach((e,i)=> {
        let _x = this.dx*i 
        if (_x > this._width){
            TweenLite.to(e,0,{x: this._width,alpha: 0})
        } else {
            TweenLite.to(e,0.5,{x: this.dx*i,alpha: 1})
        }
      })

      this.labels.forEach((e,i)=> {
      
      // HELLO - this is some resizing logic to prevent the numbers from getting too small or two big. Duplicated in "redraw" - consider re
      if (this.dx*10 > this._width){
        e.draw(i,this.denominator,this._width/20)
      } else if (!this.hideFractions){
        e.draw(i,this.denominator,this.dx/2)
      } else {
        e.draw(i,this.denominator,this._height)
      }
      let _x = this.dx*i 
      if (_x > this._width){
          TweenLite.to(e,0.5,{x: this._width,alpha: 0})
      } else {
          TweenLite.to(e,0,{x: this.dx*i-e.width/2})
          if (e.denominator != 1 && this.hideFractions){
            e.alpha = 0
          } else {
            e.alpha = 1
          }
      }
    })
    }
  }
}


export class BasicNumberLine extends PIXI.Container {
  constructor(width,height,max,denominator){
    super()

    this.onPinDrag = ()=>{}
    this.onIncrement = () => {}
    this.onDecrement = () => {}

    this.max = max
    this.hideFractions = false
    this.flipped = false
    this.everyOther = false
    this.denominator = denominator
    this.open = false

    // Layout parameters
    this._height = height
    this._width = width
    this.lineThickness = height/10
    this.minorTickHeight = height/1.25
    this.majorTickHeight = height
    this.dx = this._width/max
    this.whole = this.dx*this.denominator


    // Elements
    this.ticks = []
    this.labels = []

    this.line = new PIXI.Graphics()

   this.init()
  }


  init = () => {


     this.line.lineStyle(this.lineThickness,0x000000)
     this.line.x = 0
     this.line.y = 0
     this.line.lineTo(this._width,0)
     this.addChild(this.line)

     for (let i = 0;i<40;i++){
         let _x = i > this.max ? this.line.width : this.dx*i 
         let newTick = new PIXI.Graphics()
         newTick.lineStyle(this.lineThickness,0x000000)
  
         newTick.x = _x
         newTick.y = -this.minorTickHeight/2
         newTick.lineTo(0,this.minorTickHeight)
    
         this.addChild(newTick)
         this.ticks.push(newTick)

         let newLabel = new BasicFraction(i,this.denominator,this.dx/2)
         newLabel.makeWhole = true
         newLabel.interactive = false
 

         this.labels.push(newLabel)
         newLabel.x = _x - newLabel.width/2
        
         newLabel.y = this.line.y + this.minorTickHeight
         this.addChild(newLabel)
     }
     this.incDenominator(0)
  }

  redraw(width,height){
    // Update layout parameters.
    this.whole = this.whole/this._width*width
    this._height = height
    this._width = width
    this.lineThickness = height/10
    this.minorTickHeight = height/2
    this.majorTickHeight = height
    this.dx = this.whole/this.denominator

    this.line.clear()
    this.line.lineStyle(this.lineThickness,0x000000)
    this.line.x = 0
    this.line.y = 0
    this.line.lineTo(this._width,0)

    this.incDenominator(0)

    
    this.labels.forEach((l,i)=>{
      if (this.dx*6 > this._width){
        l.draw(i,this.denominator,this._width/20)
      } else if (!this.hideFractions){
        l.draw(i,this.denominator,this.dx/2)
      } else {
        l.draw(i,this.denominator,this._height)
      }
      let _x = i*this.dx > this._width  ? this.line.width : this.dx*i 
      l.draw(l.numerator,l.denominator,this.dx/2)
      l.x = _x - l.width/2
    })
  

    this.ticks.forEach((t,j)=>{
      let _x = j*this.dx > this._width ? this.line.width : this.dx*j
      t.clear()
      t.x = _x
      t.y = -this.minorTickHeight/2
      t.lineStyle(this.lineThickness,0x000000)
      t.lineTo(0,this.minorTickHeight)
    })
    
      // Redraw Inc Button
      /*
      this.incDenominatorBtn.width = this._height
      this.incDenominatorBtn.height = this._height
      this.incDenominatorBtn.x = 1.05*this._width + this.incDenominatorBtn.width
      this.incDenominatorBtn.y = 0
      */

    
      // Redraw Dec Button
      /*
      this.decDenominatorBtn.width = this._height
      this.decDenominatorBtn.height = this._height
      this.decDenominatorBtn.x = 1.05*this._width
      this.decDenominatorBtn.y = 0
      */
     this.drawButtons()

  }


  set(whole){
    this.whole = whole
    this.dx = whole/this.denominator
    let newMax = Math.round(this.line.width/this.dx)
    this.max = newMax
    this.ticks.forEach((e,i)=> {
      let _x = this.dx*i
       if (_x > this._width){
          e.x = this._width
          e.alpha = 0
       } else {
           e.x = _x
           e.alpha = 1
       }
    })

    this.labels.forEach((e,i)=> {
    let _x = this.dx*i
     if (_x>this._width){
         e.x = this._width
         e.alpha = 0
     } else {
         e.x = this.dx*i-e.width/2
         if (e.denominator != 1 && this.hideFractions){
           e.alpha = 0
         } else {
           e.alpha = 1
         }
     }
   })
  }

  incDenominator(inc){
    if (inc > 0){
      this.onIncrement()
    } else if (inc < 0){
      this.onDecrement()
    } 

    if(!this.open){
    
      this.denominator += inc
      this.dx = this.whole/this.denominator
      this.ticks.forEach((e,i)=> {
        let _x = this.dx*i 
        if (_x > this._width){
            TweenLite.to(e,0,{x: this._width,alpha: 0})
        } else {
            TweenLite.to(e,0.5,{x: this.dx*i,alpha: 1})
        }
      })

      this.labels.forEach((e,i)=> {
      
      // HELLO - this is some resizing logic to prevent the numbers from getting too small or two big. Duplicated in "redraw" - consider re
      if (this.dx*10 > this._width){
        e.draw(i,this.denominator,this._width/20)
      } else if (!this.hideFractions){
        console.log("greater than width!!!")
        e.draw(i,this.denominator,this.dx/2)
      } else {
        e.draw(i,this.denominator,this._height)
      }
      let _x = this.dx*i 
      if (_x > this._width){
          TweenLite.to(e,0.5,{x: this._width,alpha: 0})
      } else {
          TweenLite.to(e,0.5,{x: this.dx*i-e.width/2})
          if (e.denominator != 1 && this.hideFractions){
            e.alpha = 0
          } else {
            e.alpha = 1
          }
      }
    })
    }
  }
}




export class OfficialNumberLine extends PIXI.Container {
  constructor(width,height,max,denominator){
    super()

    this.onPinDrag = ()=>{}
    this.onIncrement = () => {}
    this.onDecrement = () => {}

    this.max = max
    this.hideFractions = false
    this.flipped = false
    this.everyOther = false
    this.denominator = denominator
    this.open = false

    // Layout parameters
    this._height = height
    this._width = width
    this.lineThickness = height/10
    this.minorTickHeight = height/1.25
    this.majorTickHeight = height
    this.dx = this._width/max
    this.whole = this.dx*this.denominator


    // Elements
    this.ticks = []
    this.labels = []

    this.line = new PIXI.Graphics()

   this.init()
  }


  init = () => {


     this.line.lineStyle(this.lineThickness,0x000000)
     this.line.x = 0
     this.line.y = 0
     this.line.lineTo(this._width,0)
     this.addChild(this.line)

     for (let i = 0;i<40;i++){
         let _x = i > this.max ? this.line.width : this.dx*i 
         let newTick = new PIXI.Graphics()
         newTick.lineStyle(this.lineThickness,0x000000)
  
         newTick.x = _x
         newTick.y = -this.minorTickHeight/2
         newTick.lineTo(0,this.minorTickHeight)
    
         this.addChild(newTick)
         this.ticks.push(newTick)

         let newLabel = new BasicFraction(i,this.denominator,this.dx/2)
         newLabel.makeWhole = true
         newLabel.interactive = false
 

         this.labels.push(newLabel)
         newLabel.x = _x - newLabel.width/2
        
         newLabel.y = this.line.y + this.minorTickHeight
         this.addChild(newLabel)
     }
     //this.incDenominator(0)
  }

  redraw(width,height){
    // Update layout parameters.
    this.whole = this.whole/this._width*width
    this._height = height
    this._width = width
    this.lineThickness = height/10
    this.minorTickHeight = height/2
    this.majorTickHeight = height
    this.dx = this.whole/this.denominator

    this.line.clear()
    this.line.lineStyle(this.lineThickness,0x000000)
    this.line.x = 0
    this.line.y = 0
    this.line.lineTo(this._width,0)

    this.incDenominator(0)

    
    this.labels.forEach((l,i)=>{
      if (this.dx*6 > this._width){
        l.draw(i,this.denominator,this._width/20)
      } else if (!this.hideFractions){
        l.draw(i,this.denominator,this.dx/2)
      } else {
        l.draw(i,this.denominator,this._height)
      }
      let _x = i*this.dx > this._width  ? this.line.width : this.dx*i 
      l.draw(l.numerator,l.denominator,this.dx/2)
      l.x = _x - l.width/2
    })
  

    this.ticks.forEach((t,j)=>{
      let _x = j*this.dx > this._width ? this.line.width : this.dx*j
      t.clear()
      t.x = _x
      t.y = -this.minorTickHeight/2
      t.lineStyle(this.lineThickness,0x000000)
      t.lineTo(0,this.minorTickHeight)
    })
    
      // Redraw Inc Button
      /*
      this.incDenominatorBtn.width = this._height
      this.incDenominatorBtn.height = this._height
      this.incDenominatorBtn.x = 1.05*this._width + this.incDenominatorBtn.width
      this.incDenominatorBtn.y = 0
      */

    
      // Redraw Dec Button
      /*
      this.decDenominatorBtn.width = this._height
      this.decDenominatorBtn.height = this._height
      this.decDenominatorBtn.x = 1.05*this._width
      this.decDenominatorBtn.y = 0
      */
     this.drawButtons()

  }


  set(whole){
    this.whole = whole
    this.dx = whole/this.denominator
    let newMax = Math.round(this.line.width/this.dx)
    this.max = newMax
    this.ticks.forEach((e,i)=> {
      let _x = this.dx*i
       if (_x > this._width){
          e.x = this._width
          e.alpha = 0
       } else {
           e.x = _x
           e.alpha = 1
       }
    })

    this.labels.forEach((e,i)=> {
    let _x = this.dx*i
     if (_x>this._width){
         e.x = this._width
         e.alpha = 0
     } else {
         e.x = this.dx*i-e.width/2
         if (e.denominator != 1 && this.hideFractions){
           e.alpha = 0
         } else {
           e.alpha = 1
         }
     }
   })
  }

  incDenominator(inc){
    if (inc > 0){
      this.onIncrement()
    } else if (inc < 0){
      this.onDecrement()
    } 

    if(!this.open){
    
      this.denominator += inc
      this.dx = this.whole/this.denominator
      
      this.ticks.forEach((e,i)=> {
        let _x = this.dx*i 
        if (_x > this._width){
            TweenLite.to(e,0,{x: this._width,alpha: 0})
        } else {
            TweenLite.to(e,0.5,{x: this.dx*i,alpha: 1})
        }
      })

      this.labels.forEach((e,i)=> {
      
      // HELLO - this is some resizing logic to prevent the numbers from getting too small or two big. Duplicated in "redraw" - consider re
      if (this.dx*10 > this._width){
        e.draw(i,this.denominator,this._width/20)
      } else if (!this.hideFractions){
        console.log("greater than width!!!")
        e.draw(i,this.denominator,this.dx/2)
      } else {
        e.draw(i,this.denominator,this._height)
      }
      let _x = this.dx*i 
      if (_x > this._width){
          TweenLite.to(e,0.5,{x: this._width,alpha: 0})
      } else {
          TweenLite.to(e,0.5,{x: this.dx*i-e.width/2})
          if (e.denominator != 1 && this.hideFractions){
            e.alpha = 0
          } else {
            e.alpha = 1
          }
      }
    })
    }
  }
}



export class Button extends PIXI.Sprite {
  constructor(value){
    super()
    this.clickCallback = ()=>{}   
    this.value = value
    this.on('pointerdown',this.onClick)
  }
  onClick(){
    this.clickCallbackl(this.value)
  }
}

export const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const shuffle = arr => {
  let n = arr.length - 1
  for (let i = 0;i < arr.length;i++) {
    let rand = getRandomInt(n)
    let randomElement = arr.splice(rand,1)
    arr.push(...randomElement)
    n -= 1
  }
  return arr
}


export class Keypad extends PIXI.Container {
  constructor(height){
    super()
    this.doSomething = ()=>{}
    this.keys = []
    this._height = height
  }

  load(){
    for (let i = 0;i<=10;i++){
      let key = new Button.from(NUMBERS[i])
      key.on('pointerdown',()=>this.hello(key.value))
      key.value = i
      key.height = this._height 
      key.width = this._height
      this.keys.push(key)
      this.addChild(key)
    }
  }


   hello(val){
     console.log("Hello")
     this.doSomething(val)
   }
  

  draw(val){
   for (let i = 0;i<=10;i++){
    let button = this.keys[i]
     if (i<=val){
      button.x = i*this._height
      button.interactive = true
     } else {
      button.alpha = 0
      button.interactive = false
     }
   }
  }
}