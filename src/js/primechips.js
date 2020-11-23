import * as PIXI from "pixi.js-legacy";
import blueGradient from "../assets/blue-gradient.png";
import MagnifyingGlass from "../assets/MagnifyingGlass.png";
import * as CONST from "./const.js";
import {
  TweenLite,
  TimelineLite
} from "gsap";
import {HorizontalNumberLine,Chip,FractionStrip, MagnifyingPin, MultiplicationStrip, EditableTextField} from "./api_kh.js";

export const init = (app, setup) => {

  
  let features = {}
  let state;

    // Layout Params
  let VIEW_WIDTH = setup.width
  let VIEW_HEIGHT = setup.height
  let VIEW_FRAME = {width: setup.width,height: setup.height}
  let BTN_DIM = Math.min(VIEW_WIDTH,VIEW_HEIGHT)/10
  let DELETE_ZONE = {x: 0,y:VIEW_HEIGHT,width:2*BTN_DIM,height: 2*BTN_DIM}
  let LEAVE_Y = -2*BTN_DIM

  const NEW_OBJ_Y = VIEW_HEIGHT/4
  const FRACTION_BAR_ICON_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.FRACTION_BAR_ICON)
  const STRIP_ICON_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.STRIP_ICON)
  const PRIME_CHIP_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.PRIME_CLIMB_ICON)
  const NO_DESC_CHIP_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.NO_DESC_PRIME_CLIMB_ICON)
  const CLEAR_PRIME_CHIP_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.CLEAR_PRIME_CLIMB_ICON)
  const MOVER_DOT_TEXTURE = new PIXI.Texture.from(MagnifyingGlass)
  const ZOOM_BUTTON_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.ZOOM_BUTTION)
  const TRASH_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.TRASH)
  const BLUE_GRADIENT_TEXTURE = new PIXI.Texture.from(blueGradient)

  // Objects
  let numberline;
  let backGround;
  let activeObject;
  let objects = []
  let stripGeneratorBtn;
  let fractionBarGeneratorBtn;
  let noDescChipGeneratorBtn
  let editableTextGeneratorBtn
  let chipGeneratorBtn;
  let blankchipGeneratorBtn;
  let zoomWindowBtn;
  let magnifyingPin;
  let activeTextBox;
  let learnMoreBtn;
  let trash;
  let menu = new PIXI.Container()
  let xButtonTimeline = new TimelineLite({paused: true})


  let whiskerMin = new PIXI.Graphics()
  let whiskerMax = new PIXI.Graphics()


  function createMultiplicationStrip(){

    const v1 = numberline.getNumberLineFloatValueFromPosition(VIEW_WIDTH/4)

    const initialState = {
      minValue: v1,
      numberOfBlocks: 3,
      blockValue: numberline.majorStep,
      heightRatio: 1/20,
      fillColor: 0xffffff,
      strokeColor: 0x000000,
      frame: {width: VIEW_WIDTH,height: VIEW_HEIGHT},
    }

    let strip = new MultiplicationStrip(app,numberline,initialState)
    strip.x =  0
    strip.y = 1.1*VIEW_HEIGHT
    strip.on('pointerdown',onObjectDown)
    strip.on('pointerup',onObjectUp)
    strip.on('pointeroutside',onObjectUp)
    strip.onUpdate = ()=> { if (magnifyingPin.x < 0){
      magnifyingPin.x = 0
    } else if (magnifyingPin.x > VIEW_WIDTH){
      magnifyingPin.x = VIEW_HEIGHT
    }
      drawWhiskers()
    }
    objects.push(strip)
    TweenLite.to(strip,{y: NEW_OBJ_Y})
    app.stage.addChild(strip)
        activeObject = strip
  }

  function createFractionStrip(){

    const x1 = numberline.getNumberLineFloatValueFromPosition(VIEW_HEIGHT/4)
    const x2 = numberline.getNumberLineFloatValueFromPosition(3*VIEW_HEIGHT/4)

    const initialState = {
      xMin: x1,
      xMax: x2,
      denominator: 2,
      numerators: [1,0,0,0,0,0,0,0,0,0,0,0],
      fillColor: 0xffffff,
      strokeColor: 0x000000,
      frame: {width: VIEW_WIDTH,height: VIEW_HEIGHT},
    }


    let strip = new FractionStrip(app,numberline,initialState)
    strip.x =  0
    strip.y = 1.1*VIEW_HEIGHT
    strip.onUpdate = ()=> {
      drawWhiskers()
    }
    objects.push(strip)
    strip.on('pointerdown',onObjectDown)
    strip.on('pointerup',onObjectUp)
    strip.on('pointeroutside',onObjectUp)
    TweenLite.to(strip,{y: NEW_OBJ_Y})
    app.stage.addChild(strip)
        activeObject = strip
  }

  function createPrimeChip(){

    let val = Math.round(numberline.getNumberLineFloatValueFromPosition(VIEW_WIDTH/2))

    const state = {
      radius: VIEW_HEIGHT/20,
      value: val,
      blank: false,
      frame: {width: VIEW_WIDTH,height: VIEW_HEIGHT}
    }

    let chip = new Chip(numberline,state)
    chip.on("pointerdown",onObjectDown)
    chip.on("pointerup",onObjectUp)
    chip.y = VIEW_HEIGHT
    chip.synch()
    objects.push(chip)
    app.stage.addChild(chip)

    const onUpdate = ()=>{
      chip.drawWhisker()
    }

    TweenLite.to(chip,{y: VIEW_HEIGHT/4,onUpdate: onUpdate})

  }

  function createBlankPrimeChip(){

    let val = Math.round(numberline.getNumberLineFloatValueFromPosition(VIEW_WIDTH/2))

    const state = {
      radius: VIEW_HEIGHT/20,
      value: val,
      frame: {width: VIEW_WIDTH,height: VIEW_HEIGHT},
      blank: true,
    }

    let chip = new Chip(numberline,state)
    chip.y = VIEW_HEIGHT
    chip.on("pointerdown",onObjectDown)
    chip.on("pointerup",onObjectUp)
    chip.drawWhisker()
    chip.synch()
    objects.push(chip)
    app.stage.addChild(chip)


    const onUpdate = ()=>{
      chip.drawWhisker()
    }

    TweenLite.to(chip,{y: VIEW_HEIGHT/4,onUpdate: onUpdate})

  }


  function createNoDescPrimeChip(){

    let val = Math.round(numberline.getNumberLineFloatValueFromPosition(VIEW_WIDTH/2))

    const state = {
      radius: VIEW_HEIGHT/20,
      value: val,
      frame: {width: VIEW_WIDTH,height: VIEW_HEIGHT},
    }

    let chip = new Chip(numberline,state)
    chip.primeChip.descriptor.alpha = 0
    chip.y = VIEW_HEIGHT
    chip.on("pointerdown",onObjectDown)
    chip.on("pointerup",onObjectUp)
    chip.drawWhisker()
    chip.synch()
    objects.push(chip)
    app.stage.addChild(chip)


    const onUpdate = ()=>{
      chip.drawWhisker()
    }

    TweenLite.to(chip,{y: VIEW_HEIGHT/4,onUpdate: onUpdate})

  }

  function createEditableTextField(){

    let newField = new EditableTextField("Text")
    newField.textField.alpha = 1
    newField.x = VIEW_WIDTH/2 
    newField.y = VIEW_HEIGHT
    newField.on("pointerdown",onObjectDown)
    newField.on("pointerup",onObjectUp)
    newField.on("pointerupoutside",onObjectUp)
    newField.editButton.on("pointerdown",openDialog)
    objects.push(newField)
    app.stage.addChild(newField)

    activeTextBox = newField

    TweenLite.to(newField,{y: VIEW_HEIGHT/4})


  }



  function placeXButton(obj){
  
    if (obj.TYPE == 'c'){
      trash.x = obj.x 
      trash.y = (obj.y + numberline.y)/2
    } else if (obj.TYPE == 'et'){
      trash.x = obj.x - trash.width/2
      trash.y = obj.y - trash.height/2
    }else {
      trash.x = obj.minDragger.getGlobalPosition().x
      trash.y = (obj.y + numberline.y)/2
    }

    trash.value = numberline.getNumberLineFloatValueFromPosition(trash.x)
    xButtonTimeline.restart()
  
  }


  function onObjectUp(){
    placeXButton(this)
  }

  function onObjectDown(){
    activeObject = this
    trash.alpha = 0
    xButtonTimeline.kill()
    app.stage.addChild(this)
    app.stage.addChild(trash)
    drawWhiskers()
  }

  function deleteActiveObject(){
  
    trash.alpha = 0
    xButtonTimeline.kill()

    if (activeObject.TYPE == 'c'){
      deleteChip(activeObject)
    } else if (activeObject.TYPE == 'et'){
      deleteTextField(activeObject)
    }else if (activeObject.TYPE == 's') {
      deleteStrip(activeObject)
    }

    if (objects.length == 0){
      activeObject = null
    }
}

  function deleteStrip(obj){
    activeObject = null
    whiskerMax.clear()
    whiskerMin.clear()
    let i = objects.indexOf(obj)
    objects.splice(i,1)

    const onComplete = () => {
      app.stage.removeChild(obj)
      obj.destroy()
    } 
    TweenLite.to(obj,{y: LEAVE_Y,onComplete: onComplete})
  }

  function deleteTextField(obj){
    activeObject = null
    let i = objects.indexOf(obj)
    objects.splice(i,1)

    const onComplete = () => {
      app.stage.removeChild(obj)
      obj.destroy()
    } 
    TweenLite.to(obj,{y: LEAVE_Y,onComplete: onComplete})
  }

  function deleteChip(obj){
    activeObject = null
    whiskerMax.clear()
    whiskerMin.clear()
    let i = objects.indexOf(obj)
    objects.splice(i,1)

    const onComplete = () => {
      app.stage.removeChild(obj)
      obj.destroy()
    } 
    TweenLite.to(obj,{y: LEAVE_Y,onComplete: onComplete})
  }


  function drawWhiskers(){

    if (activeObject != null && activeObject.TYPE == "s"){

      whiskerMax.clear()
      whiskerMin.clear()
      whiskerMax.lineStyle(2,0xffffff)
      whiskerMax.moveTo(activeObject.max-1,activeObject.y)
      whiskerMax.lineTo(activeObject.max-1,numberline.y)
      whiskerMax.alpha = 0.75

      whiskerMin.lineStyle(2,0xffffff)
      whiskerMin.moveTo(activeObject.min+1,activeObject.y)
      whiskerMin.lineTo(activeObject.min+1,numberline.y)
      whiskerMin.alpha = 0.75
    }


  }




  function backgroundPointerDown(e) {
    this.touching = true 
    this.anchorPoint = e.data.global.x;
    this.initialNumberlineMin = numberline.minFloat;
    this.initialNumberlineMax = numberline.maxFloat;
    trash.alpha = 0
    xButtonTimeline.kill()
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

      objects.forEach(o=>{
        if (o.TYPE == "c" || o.TYPE == 's'){
          o.synch()
        }
      })


      magnifyingPin.synch()
      drawWhiskers()
    } 
  }

  function backgroundPointerUp(e){
    this.touching = false
    if (magnifyingPin.x <= 0 ){
      magnifyingPin.x = 0.1*VIEW_WIDTH
    } else if (magnifyingPin.x >= VIEW_WIDTH){
      magnifyingPin.x = 0.9*VIEW_WIDTH
    }
    magnifyingPin.value =  numberline.getNumberLineFloatValueFromPosition(magnifyingPin.x)
    numberline.flexPoint = magnifyingPin.value
  }


  function zoomFit(){

    let strips = objects.filter(o=>o.TYPE == 's')
    let chips = objects.filter(o=>o.TYPE == 'c')

    let minXs = strips.map(s=>{
      return s.minDragger.getGlobalPosition().x
    })
    let maxXs = strips.map(s=>{
      return s.maxDragger.getGlobalPosition().x
    })

  let chipVals = chips.map(c=>c.x)

  let xMax = Math.max(...maxXs,...chipVals)
  let xMin = Math.min(...minXs,...chipVals)

    if (strips.length !=0 || chips.length > 1){

    xMin = xMin > 0 ? 0.8*xMin : 1.2*xMin
    let vMin = numberline.getNumberLineFloatValueFromPosition(xMin+0.1*xMin)
    let vMax = numberline.getNumberLineFloatValueFromPosition(xMax*1.1)
    const centerVal = (vMin+vMax)/2
    numberline.flexPoint = centerVal 
    magnifyingPin.value = centerVal
    numberline.zoomTo(vMin,vMax,2)
    } else if (chips.length == 1) {
      const xMaxVal = numberline.getNumberLineFloatValueFromPosition(xMax)
      if (xMax < 0){
        numberline.zoomTo(xMaxVal,0.01*xMaxVal,2)
      } else {
        numberline.zoomTo(-0.01*xMaxVal,xMaxVal,2)
      }
    } else {
      numberline.zoomTo(-10,100,2)
    }

  }


  function layoutView(newFrame){
    updateLayoutParams(newFrame)
    backGround.width = newFrame.width 
    backGround.height = newFrame.height
    numberline.redraw(newFrame)
    numberline.y = VIEW_HEIGHT/2


    objects.forEach(o=>{
      o.maxY = VIEW_HEIGHT
      if (o.TYPE == "c"){
        o.redraw(newFrame)
        o.synch()
      } else if (o.TYPE == "s"){
        o.redraw(newFrame)
        drawWhiskers()
      } 
    })

  
    trash.width = BTN_DIM
    trash.height = BTN_DIM 
    trash.x = numberline.getNumberLinePositionFromFloatValue(trash.value)


    menu.width = BTN_DIM*7
    menu.height = BTN_DIM
    menu.x = VIEW_WIDTH-menu.width
    menu.y = menu.height 

    learnMoreBtn.x = BTN_DIM/2
    learnMoreBtn.y = BTN_DIM/2
    learnMoreBtn.width = BTN_DIM/2
    learnMoreBtn.height = BTN_DIM/2

    magnifyingPin.grabber.width = BTN_DIM
    magnifyingPin.grabber.height = BTN_DIM
    magnifyingPin.x = numberline.getNumberLinePositionFromFloatValue(magnifyingPin.value)
    magnifyingPin.minY = numberline.y 
    magnifyingPin.maxY = VIEW_HEIGHT
    magnifyingPin.y = numberline.y + VIEW_HEIGHT/4
    magnifyingPin.drawWhisker()


    app.renderer.resize(newFrame.width,newFrame.height)
  }


  // Called on resize
  let execute;
  function resize(newFrame) {
  clearTimeout(execute);
  execute = setTimeout(()=>{
      layoutView(newFrame)
    },500);
  }


  function updateLayoutParams(newFrame) {
    let frame;
    if (newFrame) {
      frame = newFrame;
    } else {
      frame = { width: VIEW_WIDTH, height: VIEW_HEIGHT };
    }

    VIEW_WIDTH = frame.width
    VIEW_HEIGHT = frame.height
    VIEW_FRAME = frame
    BTN_DIM =  Math.min(VIEW_WIDTH,VIEW_HEIGHT)/15
    LEAVE_Y = -2*BTN_DIM
  }

  function openDialog(){
    setup.arena.setState({text: activeTextBox.textField.text})
    setup.arena.handleClickOpen()
  }

  function openInfo(){
    setup.arena.handleInfoOpen()
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
      backGround.width = VIEW_WIDTH
      backGround.height = VIEW_HEIGHT
      TweenLite.to(backGround,{alpha: 1})
    },500)

    numberline = new HorizontalNumberLine(-6,50,VIEW_WIDTH,app)
    numberline.setBoundaries(-100000,100000,0.05)
    numberline.draw(-6,50)
    numberline.y = VIEW_HEIGHT/2


    app.stage.addChild(numberline)


    app.updateActiveTextBox = (text)=>{
      activeTextBox.updateText(text)
    }

    numberline.onUpdate = () => {
      

      objects.forEach(o=>{
        if (o.TYPE == "c"){
          o.synch()
        } else if (o.TYPE == "s"){
          o.synch()
          drawWhiskers()
        } 
      })
      magnifyingPin.synch()
      trash.alpha = 0
      xButtonTimeline.kill()
      drawWhiskers()
    } 


    learnMoreBtn = new PIXI.Sprite.from(CONST.ASSETS.QUESTION_MARK)
    learnMoreBtn.interactive = true 
    learnMoreBtn.anchor.set(0.5)
    learnMoreBtn.x = BTN_DIM/2
    learnMoreBtn.y = BTN_DIM/2
    learnMoreBtn.width = BTN_DIM/2
    learnMoreBtn.height = BTN_DIM/2
    learnMoreBtn.on('pointerdown',openInfo) 
    app.stage.addChild(learnMoreBtn)


    stripGeneratorBtn = new PIXI.Sprite(STRIP_ICON_TEXTURE)
    stripGeneratorBtn.anchor.set(0.5)
    stripGeneratorBtn.interactive = true 
    stripGeneratorBtn.x = 0
    stripGeneratorBtn.y = 0
    stripGeneratorBtn.height = BTN_DIM
    stripGeneratorBtn.width = stripGeneratorBtn.height
    stripGeneratorBtn.on('pointerdown',createMultiplicationStrip)
    menu.addChild(stripGeneratorBtn)


    editableTextGeneratorBtn = new PIXI.Sprite.from(CONST.ASSETS.EDIT_BUTTON)
    editableTextGeneratorBtn.anchor.set(0.5)
    editableTextGeneratorBtn.interactive = true 
    editableTextGeneratorBtn.x = 5*BTN_DIM
    editableTextGeneratorBtn.y = 0
    editableTextGeneratorBtn.height = BTN_DIM
    editableTextGeneratorBtn.width = stripGeneratorBtn.height
    editableTextGeneratorBtn.on('pointerdown',createEditableTextField)
    menu.addChild(editableTextGeneratorBtn)

    fractionBarGeneratorBtn = new PIXI.Sprite(FRACTION_BAR_ICON_TEXTURE)
    fractionBarGeneratorBtn.anchor.set(0.5)
    fractionBarGeneratorBtn.interactive = true 
    fractionBarGeneratorBtn.x = BTN_DIM
    fractionBarGeneratorBtn.y = 0
    fractionBarGeneratorBtn.height = BTN_DIM
    fractionBarGeneratorBtn.width = fractionBarGeneratorBtn.height
    fractionBarGeneratorBtn.on('pointerdown',createFractionStrip)
    menu.addChild(fractionBarGeneratorBtn)

    chipGeneratorBtn = new PIXI.Sprite(PRIME_CHIP_TEXTURE)
    chipGeneratorBtn.anchor.set(0.5)
    chipGeneratorBtn.interactive = true 
    chipGeneratorBtn.x = 2*BTN_DIM
    chipGeneratorBtn.y = 0
    chipGeneratorBtn.height = BTN_DIM
    chipGeneratorBtn.width = chipGeneratorBtn.height
    chipGeneratorBtn.on('pointerdown',createPrimeChip)
    menu.addChild(chipGeneratorBtn)

    noDescChipGeneratorBtn = new PIXI.Sprite(NO_DESC_CHIP_TEXTURE)
    noDescChipGeneratorBtn.anchor.set(0.5)
    noDescChipGeneratorBtn.interactive = true 
    noDescChipGeneratorBtn.x = 3*BTN_DIM
    noDescChipGeneratorBtn.y = 0
    noDescChipGeneratorBtn.height = BTN_DIM
    noDescChipGeneratorBtn.width = noDescChipGeneratorBtn.height
    noDescChipGeneratorBtn.on('pointerdown',createNoDescPrimeChip)
    menu.addChild(noDescChipGeneratorBtn)

    blankchipGeneratorBtn = new PIXI.Sprite(CLEAR_PRIME_CHIP_TEXTURE)
    blankchipGeneratorBtn.anchor.set(0.5)
    blankchipGeneratorBtn.interactive = true 
    blankchipGeneratorBtn.x = 4*BTN_DIM
    blankchipGeneratorBtn.y = 0
    blankchipGeneratorBtn.height = BTN_DIM
    blankchipGeneratorBtn.width = blankchipGeneratorBtn.height
    blankchipGeneratorBtn.on('pointerdown',createBlankPrimeChip)
    menu.addChild(blankchipGeneratorBtn)

    zoomWindowBtn = new PIXI.Sprite(ZOOM_BUTTON_TEXTURE)
    zoomWindowBtn.anchor.set(0.5)
    zoomWindowBtn.interactive = true 
    zoomWindowBtn.x = 6*BTN_DIM
    zoomWindowBtn.y = 0
    zoomWindowBtn.height = BTN_DIM
    zoomWindowBtn.width = zoomWindowBtn.height
    zoomWindowBtn.on('pointerdown',zoomFit)
    menu.addChild(zoomWindowBtn)

    trash = new PIXI.Sprite(TRASH_TEXTURE)
    trash.anchor.set(0.5)
    trash.interactive = true
    trash.x = DELETE_ZONE.x 
    trash.y = DELETE_ZONE.y
    trash.width = DELETE_ZONE.width/4
    trash.height = DELETE_ZONE.height/4
    trash.alpha = 0
    trash.on('pointerdown',deleteActiveObject)
    app.stage.addChild(trash)


    app.stage.addChild(menu)
    app.stage.addChild(whiskerMin)
    app.stage.addChild(whiskerMax)

    const pinState = {
      height: BTN_DIM/1.5,
      width: BTN_DIM/1.5,
      texture: MOVER_DOT_TEXTURE,
      frame: VIEW_FRAME
    }

    magnifyingPin = new MagnifyingPin(numberline,pinState)
    magnifyingPin.x = VIEW_WIDTH/2
    magnifyingPin.drawWhisker()
    magnifyingPin.value = numberline.getNumberLineFloatValueFromPosition(magnifyingPin.x)
    numberline.flexPoint = magnifyingPin.value
    app.stage.addChild(magnifyingPin)


    const onComplete1 = ()=>{
      trash.interactive = true
    }

    const onComplete2 = ()=>{
      trash.interactive = false
    }

    xButtonTimeline.to(trash,{alpha: 1, duration: 0,onComplete: onComplete1})
    xButtonTimeline.to(trash,{alpha: 1, duration: 1})
    xButtonTimeline.to(trash,{alpha: 0,duration: 0.5,onComplete: onComplete2})

    layoutView({width: setup.width,height: setup.height})

  }




  // Call load script
  load();
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);

};


