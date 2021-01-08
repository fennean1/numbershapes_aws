import * as PIXI from "pixi.js-legacy";
import blueGradient from "../assets/blue-gradient.png";
import MagnifyingGlass from "../assets/MagnifyingGlass.png";
import * as CONST from "./const.js";
import {
  TweenLite,TimelineLite
} from "gsap";
import {ArrayModel, Axis, digitCount, KHNumberline, MathFactPrompt,EditableTextField} from "./api_kh.js";

import {TWO_DIGIT_ADDITION_UNDER_100} from "./problemSets.js"
import createMixins from "@material-ui/core/styles/createMixins";

export const init = (app, setup) => {

const loader = PIXI.Loader.shared; // PixiJS exposes a premade instance for you to use.
const sprites = {};
const renderer = app.renderer

// Load Images
loader.add('backGround', 'https://res.cloudinary.com/duim8wwno/image/upload/v1609776412/Spotlight%20Game/SpotlightBackground.svg')
loader.add('minus', 'https://res.cloudinary.com/duim8wwno/image/upload/v1607622190/MinusButton_snfs15.png')
loader.add('plus', 'https://res.cloudinary.com/duim8wwno/image/upload/v1607622190/PlusButton_cxghiq.png')
loader.add('trash', 'https://res.cloudinary.com/duim8wwno/image/upload/v1610110971/Trash_lryrwg.png')
loader.add('edit', 'https://res.cloudinary.com/duim8wwno/image/upload/v1607622188/EditIcon_ixof8l.png')


// https://res.cloudinary.com/duim8wwno/image/upload/v1610110971/Trash_lryrwg.png


// Assign to sprite object.
loader.load((loader, resources) => {
    sprites.backGround = resources.backGround.texture
    sprites.minus = resources.minus.texture
    sprites.plus = resources.plus.texture
    sprites.edit = resources.edit.texture
    sprites.trash = resources.trash.texture
});




  // Layout Vars
  let window_width = setup.width
  let window_height = setup.height
  let window_frame = {width: window_width,height: window_height}
  
  // Problem Set
  let P = {
    problemSet: TWO_DIGIT_ADDITION_UNDER_100,
    currentIndex: 0,
  }


// State
let S = {}
// View
let V = {
  textFields:[]
}
// Model 
let M = {}

const COLORS = {
  1: {
    fill: 0xFF9F08,
    stroke: 0xBC5500,
  },
  2: {
    fill: 0xFF4B98,
    stroke: 0xFF0A98,
  },
  3: {
    fill: 0x04E7B3,
    stroke: 0x04943A,
  },
  4: {
    fill: 0xAF00F7,
    stroke: 0x8200F7,
  },
  5: {
    fill: 0xFFEA37,
    stroke: 0xC1A100,
  },
  6: {
    fill: 0x00A406,
    stroke: 0x007C06,
  },
  7: {
    fill: 0x333333,
    stroke: 0x000000,
  },
  8: {
    fill: 0x873F00,
    stroke: 0x6C3F00,
  },
  9: {
    fill: 0x279CFF,
    stroke: 0x276DFF,
  },
  10: {
    fill: 0xFF9F08,
    stroke: 0xBC5500,
  }
}
    

  // Animation 
  let spotLightFlashTimelineRight = new TimelineLite({paused: true})
  let spotLightFlashTimelineLeft = new TimelineLite({paused: true})


  // Should be updated any time a change is made on the screens

// Model




  // Objects


  function backgroundPointerDown(e) {
    this.touching = true 

  }

  function backgroundPointerMove(e) {
    if (this.touching){

    } 
  }
  function backgroundPointerUp(e){
    this.touching = false
  }



  // Called on resize
  let execute;
  function resize(newFrame) {
  clearTimeout(execute);
  execute = setTimeout(()=>{
      draw(newFrame)
    },500);
  }

  function draw(newFrame){
    M.frame = newFrame
    app.renderer.resize(newFrame.width,newFrame.height)
    V.backGround.width = newFrame.width
    V.backGround.height = newFrame.height
  }



class CuisenaireCircle extends PIXI.Graphics {
  constructor(state){
    super()
    this.state = state


    this.draw()

    this.interactive = true
    this.on("pointerdown", this.pointerDown);
    this.on("pointermove", this.pointerMove);
    this.on("pointerup", this.pointerUp);
    this.on("pointerupoutside", this.pointerUpOutside);
  }


  draw(state = this.state){

    this.clear()

    this.state = state

    const {numerator,denominator,index,one} = state


    let r = Math.sqrt(index*one/Math.PI)

      let ratio = numerator/denominator

        const {stroke,fill} = COLORS[state.index]

        let sW = r/12

        this.beginFill(fill)
        this.moveTo(0,0)
        this.lineTo(0,-r)
        this.arc(0,0,r,-Math.PI/2,-Math.PI/2+ratio*Math.PI*2)
        this.lineTo(0,0)
        this.endFill()
        this.lineStyle(sW,stroke,1,1)
        this.beginFill(0xffffff,0.05)
        this.drawCircle(0,0,r)
        this.moveTo(0,0)

        if (denominator != 1){
          for (let i = 0;i<denominator;i++){
            let inc = 2*Math.PI/denominator
            let a = -Math.PI/2 + i*inc
            this.moveTo(0,0)
            this.lineTo(r*Math.cos(a),r*Math.sin(a))
          }
        }
 
  }


  pointerDown(event) {
    app.stage.addChild(this)
    this.touching = true;
    this.dragged = false;
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y,
    };
  }

  pointerMove(event) {
    if (this.touching) {


      if (event.data.global.y < V.cuttingRegion.y+V.cuttingRegion.height){
        let inc = window_width*0.70/this.state.denominator
        let num = (this.x-0.15*window_width)/inc 
        num = num > 0 ? num : 0
        this.state.denominator = S.denominator
        this.state.numerator = num
        this.draw()
      }


      if (!this.lockX) {
        this.x = event.data.global.x + this.deltaTouch.x;

        let xMaxOut = (this.maxX != null) && this.x > this.maxX;
        let xMinOut = (this.minX != null) && this.x < this.minX;

        if (xMaxOut) {
          this.x = this.maxX;
        } else if (xMinOut) {
          this.x = this.minX;
        }
      }

      if (!this.lockY) {
        this.y = event.data.global.y + this.deltaTouch.y;

        let yMaxOut = (this.maxY !=null) && this.y > this.maxY;
        let yMinOut = (this.minY !=null) && this.y < this.minY;

        if (yMaxOut) {
          this.y = this.maxY;
        } else if (yMinOut) {
          this.y = this.minY;
        }
      }
      this.dragged = true;
    }
  }

  pointerUp(event) {
    this.touching = false;
  }

  pointerUpOutside(event) {
    this.touching = false;
  }

}

function createCircle(i){

  let circleState = {
    numerator: 1,
    denominator: 1, 
    index: this.index,
    one: S.one,
  }
  let c = new CuisenaireCircle(circleState)
  c.on('pointerdown',onObjectDown)
  c.on('pointerup',onObjectUp)
  TweenLite.to(c,{x: window_width/2,y: window_height/2})
  app.stage.addChild(c)
}


function drawMenu(){
  let state = {
    numerator: 1,
    denominator: 1, 
    index: 9,
    one: S.one
  }
  let myCirc = new CuisenaireCircle(state)
  let x = 0
  V.menuItems = []
  for (let i = 1;i<=10;i++){
    state.index = i
    myCirc.draw(state) 
    let circ = new PIXI.Sprite()
    circ.index = i
    circ.interactive = true
    circ.anchor.set(0,0.5)
    circ.texture = app.renderer.generateTexture(myCirc)
    
    app.stage.addChild(circ)
    circ.y = window_height - 1.25*S.maxR
    circ.x = x
    circ.on('pointerdown',createCircle)
    circ.on('pointerdown',onObjectDown)
    x = x + circ.width
    V.menuItems.push(circ)
  }
  
  let offset  = window_width/2 - x/2

  V.menuItems.forEach(m=>{
    m.x = m.x + offset
  })

}

function onObjectUp(){
  if (this.x < 2*S.maxR && this.y > window_height - 2*S.maxR){
    deleteActiveObject()
  }
}

// Text Box Stuff
function createEditableTextField(){

  let newField = new EditableTextField("Text")
  newField.textField.alpha = 1
  newField.x = window_width/2 
  newField.y = window_height/2
  newField.editButton.on("pointerdown",openDialog)
  newField.on("pointerdown",onObjectDown)
  newField.on("pointerup",onObjectUp)
  V.textFields.push(newField)
  app.stage.addChild(newField)

  V.activeObject = newField
  TweenLite.to(newField,{y: window_height/4})
}

function openDialog(){
  V.activeTextBox = this.parent
  setup.arena.setState({text:  V.activeTextBox.textField.text})
  setup.arena.handleClickOpen()
}

app.updateActiveTextBox = (text)=>{
  V.activeTextBox.updateText(text)
}


function drawLine(){
  V.fractionLine.clear()
  V.fractionLine.lineStyle(S.maxR/40,0x000000)
  V.fractionLine.lineTo(0.7*window_width,0)
    for (let i = 0;i<=S.denominator;i++){
    let inc = 0.7*window_width/S.denominator
    V.fractionLine.moveTo(i*inc,-S.maxR/6)
    V.fractionLine.lineTo(i*inc,S.maxR/6)
    }
}


function deleteActiveObject(){
  app.stage.removeChild(V.activeObject)
  V.activeObject.destroy()
  V.activeObject = null
}

function onObjectDown(){
 V.activeObject = this
}

function plusClicked(){
  if (S.denominator < 12){
    S.denominator = S.denominator+1
  }
  drawLine()
}

function minusClicked() {
  if (S.denominator > 1){
    S.denominator = S.denominator-1
  }
  drawLine()
}


  // Loading Script
  function load() {

    S.denominator = 2
    S.maxR = window_width/20
    S.one = S.maxR*S.maxR*3.14/10


    V.backGround = new PIXI.Sprite.from(blueGradient)
    V.backGround.width = window_width
    V.backGround.height = window_height
    app.stage.addChild(V.backGround)

    V.plusBtn = new PIXI.Sprite(sprites.plus)
    V.plusBtn.interactive = true
    V.plusBtn.anchor.set(0.5,0.5)
    V.plusBtn.width = S.maxR*2
    V.plusBtn.height = S.maxR*2
    V.plusBtn.x = window_width - S.maxR
    V.plusBtn.y = S.maxR
    V.plusBtn.on('pointerdown',plusClicked)
    app.stage.addChild(V.plusBtn)

    V.minusBtn = new PIXI.Sprite(sprites.minus)
    V.minusBtn.interactive = true
    V.minusBtn.anchor.set(0.5,0.5)
    V.minusBtn.width = S.maxR*2
    V.minusBtn.height = S.maxR*2
    V.minusBtn.x = S.maxR
    V.minusBtn.y = S.maxR
    V.minusBtn.on('pointerdown',minusClicked)
    app.stage.addChild(V.minusBtn)

    V.editBtn = new PIXI.Sprite(sprites.edit)
    V.editBtn.interactive = true
    V.editBtn.anchor.set(0.5,0.5)
    V.editBtn.width = S.maxR*2
    V.editBtn.height = S.maxR*2
    V.editBtn.x = window_width - S.maxR
    V.editBtn.y = window_height-S.maxR
    V.editBtn.on('pointerdown',createEditableTextField)
    app.stage.addChild(V.editBtn)

    V.trashArea = new PIXI.Sprite(sprites.trash)
    V.trashArea.interactive = true
    V.trashArea.anchor.set(0.5,0.5)
    V.trashArea.width = S.maxR*1.5
    V.trashArea.height = S.maxR*1.5
    V.trashArea.x = S.maxR
    V.trashArea.y = window_height-S.maxR
    V.trashArea.on('pointerdown',minusClicked)
    app.stage.addChild(V.trashArea)

    V.cuttingRegion = new PIXI.Graphics()
    V.cuttingRegion.beginFill(0xffffff,0.5)
    V.cuttingRegion.drawRoundedRect(0,0,0.8*window_width,0.1*window_height,0.05*window_height)
    V.cuttingRegion.denominator = 5
    V.cuttingRegion.x = window_width/2 - V.cuttingRegion.width/2 
    V.cuttingRegion.y = V.cuttingRegion.height/2
    V.cuttingRegion.interactive = true


    V.fractionLine = new PIXI.Graphics()
    V.fractionLine.x = V.cuttingRegion.x + 0.05*window_width
    V.fractionLine.y = V.cuttingRegion.y + 0.5*V.cuttingRegion.height
    
    app.stage.addChild(V.fractionLine)

    app.stage.addChild(V.cuttingRegion)

    drawMenu()
    drawLine()
  }




  // Call load script
  loader.onComplete.add(load); // called once when the queued resources all load.

  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);

};


