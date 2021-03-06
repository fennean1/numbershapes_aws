import * as PIXI from "pixi.js-legacy";
import {
  Draggable,
  HorizontalNumberLine,
  VerticalNumberLine,
  RangeBubbleSelector,
  BinomialGrid,
  EditableTextField
} from "./api_kh.js";
import {
  TweenLite,
} from "gsap";
import { Sketcher } from "./sketcher.js";


export const init = (app, setup) => {

  const dS = {

  }

   const App = {
     R: app.renderer,
     S: dS,
     T: {},
     L: {},
     V: {annotations:[]},
     C: {}
   }

  const loader = PIXI.Loader.shared; // PixiJS exposes a premade instance for you to use.
  const T = {};
  const renderer = app.renderer
  
  // Load Images
  loader.add('backGround', 'https://res.cloudinary.com/duim8wwno/image/upload/v1607622190/blue-gradient_un84kq.png')
  loader.add('minus', 'https://res.cloudinary.com/duim8wwno/image/upload/v1607622190/MinusButton_snfs15.png')
  loader.add('plus', 'https://res.cloudinary.com/duim8wwno/image/upload/v1607622190/PlusButton_cxghiq.png')
  loader.add('trash', 'https://res.cloudinary.com/duim8wwno/image/upload/v1610110971/Trash_lryrwg.png')
  loader.add('edit', 'https://res.cloudinary.com/duim8wwno/image/upload/v1607622188/EditIcon_ixof8l.png')
  loader.add('openBrush', 'https://res.cloudinary.com/duim8wwno/image/upload/v1610397628/Painting%20Circles/openBrush_pfkuxn.png')
  loader.add('closedBrush', 'https://res.cloudinary.com/duim8wwno/image/upload/v1610397810/Painting%20Circles/closedBrush_zwn9p6.png')
  loader.add('incrementOneBtn', 'https://res.cloudinary.com/duim8wwno/image/upload/v1611509432/Painting%20Circles/IncrementOneBtn_m5gm2g.png')
  
  
  // Assign to sprite object.
  loader.load((loader, resources) => {
      App.T.backGround = resources.backGround.texture
      T.minus = resources.minus.texture
      T.plus = resources.plus.texture
      T.edit = resources.edit.texture
      T.trash = resources.trash.texture
      T.openBrush = resources.openBrush.texture
      T.closedBrush = resources.closedBrush.texture
      T.incrementOneBtn = resources.incrementOneBtn.texture
  });

  let features = {};
  let lineUp = new PIXI.Graphics();

  // CONSTANTS
  // Colors
  const GREY = 0xa6a6a6;


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


  function inc() {
    switch (this) {
      case V.incYDenominator:
        if (vnumberline.denominator < 10){
          vnumberline.denominator = vnumberline.denominator+1
        } else {
          console.log("incY failed")
        }
        break;
      case V.decYDenominator:
        if (vnumberline.denominator > 1){
          vnumberline.denominator = vnumberline.denominator-1
        }else {
          console.log("decY failed")
        }
        break;
      case V.incXDenominator:
        if (hnumberline.denominator < 10){
          hnumberline.denominator = hnumberline.denominator+1
        }else {
          console.log("incX failed")
        }
        break;
      case V.decXDenominator:
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
    App.V.annotations.splice(i,1)
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

      V.incYDenominator.width = SLIDER_DIM
      V.incYDenominator.height = SLIDER_DIM
      V.incYDenominator.x = vnumberline.x 
      V.incYDenominator.y = vnumberline.y - vnumberline.length - SLIDER_DIM

      V.decYDenominator.width = SLIDER_DIM
      V.decYDenominator.height = SLIDER_DIM
      V.decYDenominator.x = vnumberline.x - SLIDER_DIM
      V.decYDenominator.y = vnumberline.y - vnumberline.length - SLIDER_DIM
  
      V.incXDenominator.width = SLIDER_DIM
      V.incXDenominator.height = SLIDER_DIM
      V.incXDenominator.x = hnumberline.x + hnumberline.length
      V.incXDenominator.y = hnumberline.y - SLIDER_DIM
  
      V.decXDenominator.width = SLIDER_DIM
      V.decXDenominator.height = SLIDER_DIM
      V.decXDenominator.x = hnumberline.x + hnumberline.length 
      V.decXDenominator.y = hnumberline.y

      V.editBtn.width = S.maxR*2
      V.editBtn.height = S.maxR*2
      V.editBtn.x = window_width - S.maxR
      V.editBtn.y = window_height-S.botY

      V.trashArea.width = S.maxR*1.5
      V.trashArea.height = S.maxR*1.5
      V.trashArea.x = S.maxR
      V.trashArea.y = window_height-S.botY
  
    }


    App.C.addAnnotation = sprite => {
      sprite.on("pointerup",onObjectUp)
      sprite.on("pointerdown",onObjectDown)
      App.V.annotations.push(sprite)
      app.stage.addChild(sprite)
    }

  // Loading Script
  function load() {
    if (setup.props.features) {
      features = setup.props.features;
    }

    

        V.incYDenominator = new PIXI.Sprite(T.plus);
        V.incYDenominator.interactive = true;
        V.incYDenominator.on("pointerdown", inc);
      
        V.decYDenominator = new PIXI.Sprite(T.minus);
        V.decYDenominator.interactive = true;
        V.decYDenominator.on("pointerdown", inc);
       
        V.incXDenominator = new PIXI.Sprite(T.plus);
        V.incXDenominator.interactive = true;
        V.incXDenominator.on("pointerdown", inc);
       
        V.decXDenominator = new PIXI.Sprite(T.minus);
        V.decXDenominator.interactive = true;
        V.decXDenominator.on("pointerdown", inc);

        // All these should be from C.
        S.denominator = 2
        S.valueOfOne = 1
        S.maxR = window_width/20
        S.one = S.maxR*S.maxR*3.14/10
        S.vPad = window_width < window_height ? window_height/10 : window_height/50
        S.topY = S.maxR + S.vPad/2
        S.botY = S.maxR + S.vPad*1.5
    
        /*
        V.backGround = new PIXI.Sprite(T.backGround)
        V.backGround.width = window_width
        V.backGround.height = window_height
        V.backGround.interactive = true 
        //V.backGround.on('pointerdown',backGroundPointerDown)
        V.backGround.on('pointermove',backGroundPointerMove)
        V.backGround.on('pointerup',backGroundPointerUp)
        app.stage.addChild(V.backGround)
        */


  
        // Need to restructure to more efficiently extract state
        const initStateSketcher = {
          strokeWidth: 5,
          startColor: 0xffffff,
          paths: [],
        }

        console.log("app",App)

        App.V.sketcher = new Sketcher(initStateSketcher,App)
        app.stage.addChild(App.V.sketcher)



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
    
        V.currentCtx= new PIXI.Graphics()
        V.currentCtx.on('pointerdown',onObjectDown)
        V.currentCtx.on('pointerup',onObjectUp)
        V.currentCtx.state.strokeWidth = S.strokeWidth
        V.currentCtx.state.strokeColor= S.endColor
        V.currentCtx.interactive = false

    
        V.editBtn = new PIXI.Sprite(T.edit)
        V.editBtn.interactive = true
        V.editBtn.anchor.set(0.5,0.5)
        V.editBtn.width = S.maxR*2
        V.editBtn.height = S.maxR*2
        V.editBtn.x = window_width - S.maxR
        V.editBtn.y = window_height-S.botY
        V.editBtn.on('pointerdown',createEditableTextField)
        app.stage.addChild(V.editBtn)
    
        V.trashArea = new PIXI.Sprite(T.trash)
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
 

    let sliderGraphics = new PIXI.Graphics();
    sliderGraphics.beginFill(0x000000);
    sliderGraphics.drawCircle(0, 0, SLIDER_DIM);
    let sliderGraphicsTexture = app.renderer.generateTexture(sliderGraphics);

    slider = new Draggable();
    slider.texture = sliderGraphicsTexture;
    slider.anchor.set(0,1);
    slider.alpha = 0.5;
    slider.hitArea = new PIXI.Circle(0, 0, SLIDER_DIM * 4, SLIDER_DIM * 4);
    slider.maxX = null
    slider.minX = hnumberline.x
    slider.interactive = true;
    slider.width = SLIDER_DIM;
    slider.height = slider.width;
    slider.y = 0
    slider.x = 0
    slider.on("pointerdown", sliderPointerDown);
    slider.on("pointermove", sliderPointerMove);
    slider.on("pointerup", sliderPointerUp);
    slider.on("pointerupoutside", sliderPointerUp);
    app.stage.addChild(slider);

    lineUp.lineStyle(2, GREY);
    lineUp.lineTo(0, slider.y - slider.height / 2 - SELECTOR_Y);
    //app.stage.addChild(lineUp)
    lineUp.x = slider.x;
    lineUp.y = SELECTOR_Y;

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

    V.incYDenominator.width = incDim
    V.incYDenominator.height = incDim
    V.incYDenominator.x = vnumberline.x 
    V.incYDenominator.y = vnumberline.y - vnumberline.length - incDim

    V.decYDenominator.width = incDim
    V.decYDenominator.height = incDim
    V.decYDenominator.x = vnumberline.x - incDim
    V.decYDenominator.y = vnumberline.y - vnumberline.length - incDim

    V.incXDenominator.width = incDim 
    V.incXDenominator.height = incDim 
    V.incXDenominator.x = hnumberline.x + hnumberline.length
    V.incXDenominator.y = hnumberline.y - incDim

    V.decXDenominator.width = incDim 
    V.decXDenominator.height = incDim 
    V.decXDenominator.x = hnumberline.x + hnumberline.length 
    V.decXDenominator.y = hnumberline.y

    app.stage.addChild(V.currentCtx)


    if (features.type == "k2"){
      hnumberline.hideLabels()
      vnumberline.hideLabels()
      console.log("hiding")
    } else {
      app.stage.addChild(V.incYDenominator);
      app.stage.addChild(V.decYDenominator);
      app.stage.addChild(V.incXDenominator);
      app.stage.addChild(V.decXDenominator);
    }

  }

  // Call load script
  loader.onComplete.add(load)
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);
  // app.resizable = true
};
