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
  EditableTextField
} from "./api_kh.js";
import {
  TweenLite,
} from "gsap";
import * as PROBLEM_SETS from "./problemSets.js";




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

  let features = {};
  let viewPort = new PIXI.Container();
  let backGround;
  let lineUp = new PIXI.Graphics();

  // CONSTANTS
  // Colors
  const GREY = 0xa6a6a6;


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



  let window_width = setup.width
  let window_height = setup.height
  let window_frame = {width: window_width,height: window_height}



  const SLIDER_START = {
    x: WINDOW_WIDTH / 2,
    y: SELECTOR_Y + 2 * SLIDER_DIM,
  };

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
    let d = 0
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
    drawWhiskers(this.x, this.y)
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
      window_width = newFrame.width
      window_height = newFrame.height
      V.backGround.width = newFrame.width
      V.backGround.height = newFrame.height
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
    if (setup.props.features) {
      features = setup.props.features;
    }

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
    
        V.currentCtx= new PIXI.Graphics()
        V.currentCtx.on('pointerdown',onObjectDown)
        V.currentCtx.on('pointerup',onObjectUp)
        V.currentCtx.state.strokeWidth = S.strokeWidth
        V.currentCtx.state.strokeColor= S.endColor
        V.currentCtx.interactive = false
  
    
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
    slider.anchor.set(0,1);
    slider.alpha = 0.5;
    slider.hitArea = new PIXI.Circle(0, 0, SLIDER_DIM * 4, SLIDER_DIM * 4);
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

    let width = 0.8 * Math.min(WINDOW_WIDTH, WINDOW_HEIGHT);

    hnumberline = new HorizontalNumberLine(0, 3.5, width, app);
    //hnumberline.fractionTicks = true
    hnumberline.draw(0, 3.2);
    hnumberline.x = WINDOW_WIDTH / 2 - width / 2;
    hnumberline.y = WINDOW_HEIGHT / 2 + width / 2;
    app.stage.addChild(hnumberline);

    vnumberline = new VerticalNumberLine(0, 3.5, width, app);
    //vnumberline.fractionTicks = true
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

    app.stage.addChild(V.currentCtx)

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
  loader.onComplete.add(load)
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);
  // app.resizable = true
};
