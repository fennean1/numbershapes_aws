import * as PIXI from "pixi.js-legacy";
import blueGradient from "../assets/blue-gradient.png";
import MagnifyingGlass from "../assets/MagnifyingGlass.png";
import * as CONST from "./const.js";
import {
  TweenLite,TimelineLite
} from "gsap";
import {ArrayModel, Draggable, Axis, digitCount, KHNumberline, MathFactPrompt,DraggableGraphics,EditableTextField} from "./api_kh.js";

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
loader.add('openBrush', 'https://res.cloudinary.com/duim8wwno/image/upload/v1610397628/Painting%20Circles/openBrush_pfkuxn.png')
loader.add('closedBrush', 'https://res.cloudinary.com/duim8wwno/image/upload/v1610397810/Painting%20Circles/closedBrush_zwn9p6.png')
loader.add('incrementOneBtn', 'https://res.cloudinary.com/duim8wwno/image/upload/v1611509432/Painting%20Circles/IncrementOneBtn_m5gm2g.png')


// Assign to sprite object.
loader.load((loader, resources) => {
    sprites.backGround = resources.backGround.texture
    sprites.minus = resources.minus.texture
    sprites.plus = resources.plus.texture
    sprites.edit = resources.edit.texture
    sprites.trash = resources.trash.texture
    sprites.openBrush = resources.openBrush.texture
    sprites.closedBrush = resources.closedBrush.texture
    sprites.incrementOneBtn = resources.incrementOneBtn.texture
});




  // Layout Vars  (Should be L)


  let window_width = setup.width
  let window_height = setup.height
  let window_frame = {width: window_width,height: window_height}


// 
const V = {paths: [],
    textFields:[]}

// State
const S = {
  startColor: 0xed1f30,
  endColor: 0x000000,
  strokeWidth: Math.min(window_width,window_height)/200,
  prev: {},
  curr: {},
  arr: [],
  subArr: []
  }
// Model 
let M = {}

    
  // Should be updated any time a change is made on the screens

// Model
let timeout;

function drawPaths(paths,ctx){

  const strokeColor = 0x000000
  const strokeWidth = S.strokeWidth

  paths.forEach((s,j)=>{


    let prev = s[0]
    let prev2 = prev
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



  function backGroundPointerDown(e) {
    clearTimeout(timeout)
    S.index = 0
    V.paths.forEach(p=>{p.interactive = false})
    this.touching = true
    S.prev = {x: e.data.global.x,y: e.data.global.y}
    S.prev2 = S.prev
    S.subArr.push(S.prev)
    V.currentCtx.moveTo(S.prev.x,S.prev.y)
    V.currentCtx.beginFill(S.startColor)
    V.currentCtx.lineStyle(0,S.startColor,1,0.5)
    V.currentCtx.drawCircle(S.prev.x,S.prev.y,S.strokeWidth/2.1)
    V.currentCtx._fillStyle.alpha = 0.001
    V.currentCtx.drawCircle(S.prev.x,S.prev.y,3*S.strokeWidth)

  }


  function backGroundPointerMove(e) {
    if (this.touching){
      S.index++
      S.curr = {x: e.data.global.x,y: e.data.global.y}
      V.currentCtx._fillStyle.alpha = 1
      V.currentCtx.moveTo(S.prev.x,S.prev.y)
      V.currentCtx.lineStyle(0,S.startColor,1,0.5)
      V.currentCtx.drawCircle(S.curr.x,S.curr.y,S.strokeWidth/2.1)
      V.currentCtx.lineStyle(S.strokeWidth,S.startColor,1,0.5)
      V.currentCtx.lineTo(S.curr.x,S.curr.y)


      /*
      if (S.index%4 == 0){
        V.currentCtx.bezierCurveTo(S.prev2.x,S.prev2.y,S.prev.x,S.prev.y,S.curr.x,S.curr.y,40)
        S.index = 0
      }
      */
      S.prev2 = S.prev
      S.prev = S.curr
      S.subArr.push(S.curr)
    }
  }

  function backGroundPointerUp(){
    this.touching = false
    V.paths.forEach(p=>{p.interactive = true})

    V.currentCtx.lineStyle(0,S.startColor,1,0.5)
    V.currentCtx.drawCircle(S.prev.x,S.prev.y,S.strokeWidth/2.1)
    V.currentCtx._fillStyle.alpha = 0.001
    V.currentCtx.drawCircle(S.prev.x,S.prev.y,1.5*S.strokeWidth)

    const t = app.renderer.generateTexture(V.currentCtx)
    const b = V.currentCtx.getBounds()

 
    if (b.width > S.strokeWidth*6 || b.height > S.strokeWidth*6){
      const s = new PIXI.Sprite(t)
      s.x = b.x 
      s.y = b.y
      V.currentCtx.clear()
      V.accumulatorSprite.addChild(s)
      V.accumulatorSprite.state.points.push(S.subArr)
    } else {
      V.currentCtx.clear()
      t.destroy()
    }
    S.subArr = []
    timeout = setTimeout(finishPath,800)
  }

  function finishPath(){
    drawPaths(V.accumulatorSprite.state.points,V.currentCtx)
    const t = app.renderer.generateTexture(V.currentCtx)
    let {x,y} = V.currentCtx.getBounds()
    V.currentCtx.clear()
    
    const d = new Draggable(t)
    d.on('pointerdown',onObjectDown)
    d.on('pointerup',onObjectUp)
    d.x = x 
    d.y = y
    app.stage.addChild(d)
    d.type = 'PATH'
    V.paths.push(d)

    V.accumulatorSprite.destroy()
    V.accumulatorSprite = new PIXI.Sprite()
    V.accumulatorSprite.state = {}
    V.accumulatorSprite.state.points = []
    app.stage.addChild(V.accumulatorSprite)
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
    layoutView()
  }


// Text Box Stuff
function createEditableTextField(){

  let newField = new EditableTextField("Text")
  newField.textField.alpha = 1
  newField.x = window_width/2 
  newField.y = window_height/2
  newField.textField.style.fontSize = Math.min(window_height,window_width)/35
  newField.editButton.on("pointerdown",openDialog)
  newField.on("pointerdown",onObjectDown)
  newField.on("pointerup",onObjectUp)
  newField.updateText("Text")
  newField.editButton.alpha = 1
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



function deleteActiveObject(){
  /*Need to know type so we can delete it from the correct array
  otherwise we have destroyed objects in our array */
  if (V.activeObject.type == 'PATH'){
    let i = V.paths.indexOf(V.activeObject)
    V.paths.splice(i,1)
  }
  app.stage.removeChild(V.activeObject)
  V.activeObject.destroy()
  V.activeObject = null
}

function onObjectDown(){
 V.activeObject = this
 if (this.type == 'PATH'){
  this.alpha = 0.5
 }
 app.stage.addChild(this)
}


function onObjectUp(e){
  this.alpha = 1
  if (e.data.global.x < V.trashArea.x+V.trashArea.width && e.data.global.y > V.trashArea.y-V.trashArea.height){
    deleteActiveObject()
  }
}


// Save all the information required to reconstruct the arena. 
  function saveState(){
      const nS = {
        editableTextFields: [],

      }

      V.editableTextFields.forEach(e=>{
        nS.push(e.state)
      })

    // Destroy V
  }

  function layoutView(){
    V.backGround.width = window_width
    V.backGround.height = window_height

    V.editBtn.width = S.maxR*2
    V.editBtn.height = S.maxR*2
    V.editBtn.x = window_width - S.maxR
    V.editBtn.y = window_height-S.botY

    V.trashArea.width = S.maxR*1.5
    V.trashArea.height = S.maxR*1.5
    V.trashArea.x = S.maxR
    V.trashArea.y = window_height-S.botY

  }
  

  // Loading Script
  function load() {

    // All these should be from C.
    S.denominator = 2
    S.valueOfOne = 1
    S.maxR = window_width/20
    S.one = S.maxR*S.maxR*3.14/10
    S.vPad = window_width < window_height ? window_height/10 : window_height/50
    S.topY = S.maxR + S.vPad/2
    S.botY = S.maxR + S.vPad*1.5

    V.backGround = new PIXI.Sprite()
    V.backGround.texture = new PIXI.Texture.from(CONST.ASSETS.BLUE_GRADIENT)
    V.backGround.width = window_width
    V.backGround.height = window_height
    V.backGround.interactive = true 
    V.backGround.on('pointerdown',backGroundPointerDown)
    V.backGround.on('pointermove',backGroundPointerMove)
    V.backGround.on('pointerup',backGroundPointerUp)
    app.stage.addChild(V.backGround)

    V.currentCtx= new DraggableGraphics()
    V.currentCtx.on('pointerdown',onObjectDown)
    V.currentCtx.on('pointerup',onObjectUp)
    V.currentCtx.state.strokeWidth = S.strokeWidth
    V.currentCtx.state.strokeColor= S.endColor
    V.currentCtx.interactive = false

    app.stage.addChild(V.currentCtx)

    V.editBtn = new PIXI.Sprite(sprites.edit)
    V.editBtn.interactive = true
    V.editBtn.anchor.set(0.5,0.5)
    V.editBtn.width = S.maxR*2
    V.editBtn.height = S.maxR*2
    V.editBtn.x = window_width - S.maxR
    V.editBtn.y = window_height-S.botY
    V.editBtn.on('pointerdown',createEditableTextField)
    app.stage.addChild(V.editBtn)

    V.trashArea = new PIXI.Sprite(sprites.trash)
    V.trashArea.interactive = true
    V.trashArea.anchor.set(0.5,0.5)
    V.trashArea.width = S.maxR*1.5
    V.trashArea.height = S.maxR*1.5
    V.trashArea.x = S.maxR
    V.trashArea.y = window_height-S.botY
    app.stage.addChild(V.trashArea)

    V.accumulatorSprite = new PIXI.Sprite()
    V.accumulatorSprite.state = {}
    V.accumulatorSprite.state.points = []
    app.stage.addChild(V.accumulatorSprite)

    layoutView()

  }




  // Call load script
  loader.onComplete.add(load); // called once when the queued resources all load.

  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);

};


