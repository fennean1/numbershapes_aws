import * as PIXI from "pixi.js-legacy";
import * as CONST from "./const.js";
import { TweenMax, TimelineLite, Power2, Elastic, CSSPlugin, TweenLite, TimelineMax } from "gsap";
import {getIndexOfNearestVertice, Line, polygonArea,DraggablePoly, splitMultiplePolygons} from "./api.js";
const ASSETS = CONST.ASSETS


export const init = (app, setup) => {

  // Layout Parameters
  const LINE_PERCENTAGE = 0.8
  const BLUE_TEXTURE = new PIXI.Texture.from(CONST.ASSETS.GLASS_CIRCLE)
  const CLOSED_CIRCLE_TEXTURE = new PIXI.Texture.from(ASSETS.CLOSED_CIRCLE)
  const OPEN_CIRCLE_TEXTURE = new PIXI.Texture.from(ASSETS.OPEN_CIRCLE)
    
  let WINDOW_WIDTH = setup.width
  let BAR_HEIGHT = setup.height/15
  let WINDOW_HEIGHT = setup.height
  let H_W_RATIO = setup.height/setup.width
  let LANDSCAPE = H_W_RATIO < 3/4
  let ARENA_WIDTH = LANDSCAPE ? 4/3*setup.height : setup.width
  let ARENA_HEIGHT = LANDSCAPE ? setup.height : 3/4*setup.width
  let SQUARE_DIM = ARENA_HEIGHT*0.5
  let SQUARE_AREA = SQUARE_DIM*SQUARE_DIM
  let OLD_FRAME = {WINDOW_WIDTH,WINDOW_HEIGHT}
  let BTN_DIM = SQUARE_DIM/6
  let DX = SQUARE_DIM/(setup.props.features.x-1)
  let DY = SQUARE_DIM/(setup.props.features.y-1)
  let OLD_DX = DX
  let J = Math.floor(WINDOW_HEIGHT/DY)
  let I = Math.floor(WINDOW_WIDTH/DX)
  let SQUARE = [[0,0],[0,SQUARE_DIM],[SQUARE_DIM,SQUARE_DIM],[SQUARE_DIM,0]]
  let AREA_OF_POLYGONS = null
  let FIRST_LOAD = true




  let backGround; 
  let stencil;
  let Nodes = []
  let CurrentPolygon = []
  let activePolygon = null
  let polygons = []
  let fractionObj;
  let trashBtn;
  let rotateLeftBtn;
  let rotateRightBtn;
  let scissorBtn;
  let flipVerticalBtn;
  let flipHorizontalBtn;
  let resetBtn;
  let cutting = false
  let linePoints = []
  let polygonObjects = []
  let features = {}
  let initialPolygon;



  let fadeAnimation = new TimelineLite({paused: true})
 
  function makeBackground(){
    // Setup Background
    this.sprite = new PIXI.Sprite.from(CONST.ASSETS.BLUE_GRADIENT);
    this.sprite.width = WINDOW_WIDTH
    this.sprite.height = WINDOW_HEIGHT
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.interactive = true

    app.stage.addChild(this.sprite)

    this.draw = () => {
        this.sprite.width = WINDOW_WIDTH
        this.sprite.height = WINDOW_HEIGHT
    }
  }

  class Stencil extends PIXI.Graphics {
    constructor(){
      super()
      this.first = []
      this.last = []
    }

    addNode(newNode){
      this.clear()
      this.lineStyle(4,0x000000)
      this.moveTo(this.last[0],this.last[1])
      this.lineTo(newNode[0],newNode[1])

    }

    draw(nodes){
      this.clear()
      this.lineStyle(4,0x000000)
      this.moveTo(nodes[0][0],nodes[0][1])
      for (let n of nodes){
        let x = n[0]
        let y = n[1]
        this.lineTo(x,y)
      }
    }

    redraw(nodes){
      this.clear()
      this.lineStyle(4,0x000000)
      this.moveTo(nodes[0][0],nodes[0][1])
      for (let n of nodes){
        let x = n[0]
        let y = n[1]
        this.lineTo(x,y)
      }
    }

  }



  class Node extends PIXI.Sprite {
    constructor(){
      super()
      this.on('pointerdown',this.pointerDown)
      this.on('pointerup',placeScissors)
      //this.on('pointerupoutside',this.pointerUpOutside)
      this.anchor.set(0.5)
      this.activated = false
      this.interactive = true
      this.texture = OPEN_CIRCLE_TEXTURE
    }



    pointerDown(){
      console.log("this.x,this.y",this.x,this.y)
      rotateLeftBtn.alpha = 0
      rotateLeftBtn.interactive = false
      Nodes.forEach((n)=>{app.stage.addChild(n)})
      this.texture = CLOSED_CIRCLE_TEXTURE
      if (linePoints.length < 2 ){
        linePoints.push([this.x,this.y])
        stencil.draw(linePoints)
        app.stage.addChild(stencil)
        scissorBtn.alpha = 0
      } else {
        linePoints = []
        stencil.clear()
        scissorBtn.alpha = 0
        Nodes.forEach((n)=>{n.texture = OPEN_CIRCLE_TEXTURE})
        this.texture = CLOSED_CIRCLE_TEXTURE
        linePoints.push([this.x,this.y])
      }
    }
  }

  function cut(){
    console.log("polygon objectssssssssssssssss",polygonObjects)
    cutting = true
    let rawCopyOfPolygons = polygonObjects.map(pObj=>{
      return pObj.getPolyPoints()})
    // Destroy old ones.


    // Maybe this should take "lines" instead of points.
    let newPolygons = splitMultiplePolygons(linePoints,rawCopyOfPolygons)

    const reducer = (a,c) => a + polygonArea(c)
    let area = newPolygons.reduce(reducer,0)
    let validCut = true
    if (AREA_OF_POLYGONS != null){
      /// Valid if new area is within 5%
      validCut = Math.abs(AREA_OF_POLYGONS-area) < AREA_OF_POLYGONS*0.05
    } else {
      AREA_OF_POLYGONS = area
    }

    if (newPolygons.length != polygonObjects.length && validCut) {
        polygonObjects.forEach(pObj=>{
          pObj.destroy(true)
          app.stage.removeChild(pObj)
        })
        polygonObjects = []

      
        newPolygons.forEach(p=>{
          let pObj = new DraggablePoly(p,app)
          app.stage.addChild(pObj)
          polygonObjects.push(pObj)
          pObj.on('pointerup',polyPointerUp)
          pObj.on('pointerdown',polyPointerDown)
          pObj.on('pointermove',polyPointerMove)
        })
   } 
   setTimeout(()=>{cutting = false},500)
  }

  function redrawPolys(oldFrame,newFrame){
    let rawCopyOfPolygons = polygonObjects.map(pObj=>{
      return pObj.getPolyPoints()})

    polygonObjects.forEach(pObj=>{
      pObj.destroy(true)
      app.stage.removeChild(pObj)
    })
    polygonObjects = []

    // Scale Polys
    let scaledPolygons = []
    rawCopyOfPolygons.forEach(p=>{
      let newPoly = p.map(pt=>{
        return [pt[0]/OLD_DX*DX,pt[1]/OLD_DX*DX]
      })
      scaledPolygons.push(newPoly)
    })


    let newPolygons = scaledPolygons.map(p=>{
      let pObj = new DraggablePoly(p,app)
      app.stage.addChild(pObj)
      pObj.on('pointerup',polyPointerUp)
      pObj.on('pointerdown',polyPointerDown)
      pObj.on('pointermove',polyPointerMove)
      return pObj
    })
    polygonObjects = newPolygons
  }


  function snap(poly){
    // Previosly "features.snapping"
    if (true){
      let vertices = poly.getPolyPoints()
      let indexOfNearestNode = getIndexOfNearestVertice(vertices,DX)
      let first = vertices[indexOfNearestNode]
      let originX = first[0]
      let originY = first[1]
      let deltaX = originX - poly.x 
      let deltaY = originY - poly.y
      let i = Math.round(originX/DX)*DX
      let j = Math.round(originY/DY)*DY
      poly.x = i - deltaX
      poly.y = j - deltaY
    }
  } 

  function resetNodes(){
    let dim = SQUARE_DIM/15
    let k = -1
    for (let i=1;i<=20;i++){
      for (let j=1;j<=20;j++){
        k += 1
        let n = Nodes[k]
        n.x = i*DX
        n.y = j*DX
        n.w = DX/10
        n.height = dim
        n.width = dim
        if (n.x > WINDOW_WIDTH || n.y > 0.95*WINDOW_HEIGHT){
          n.alpha = 0
        } else {
          n.alpha = 1
        }
      }
    }
  }

  function setNodes(){
    
    let dim = SQUARE_DIM/15
    for (let i=1;i<=20;i++){
      for (let j=1;j<=20;j++){
        let n = new Node()
        Nodes.push(n)
        n.x = i*DX
        n.y = j*DX
        n.w = DX/10
        n.height = dim
        n.width = dim
        app.stage.addChild(n)
      }
    }
  }

  // Called on resize
  let timeout;
  function resize(newFrame){
    console.log("resize called")
    clearTimeout(timeout)
    timeout = setTimeout(()=>{
      updateLayoutParams(newFrame)
      resetBtn.y = BTN_DIM/1.5
      resetBtn.x = WINDOW_WIDTH - BTN_DIM/1.5
      app.renderer.resize(WINDOW_WIDTH,WINDOW_HEIGHT)
      resetNodes()
      redrawPolys(OLD_FRAME,newFrame)
      backGround.draw()
    },1000)
  }

  function updateLayoutParams(newFrame){
    let frame;
    if (newFrame){
      frame = newFrame
    } else {
      frame = {width: WINDOW_WIDTH,height: WINDOW_HEIGHT}
    }
    OLD_FRAME = {width: WINDOW_WIDTH,height: WINDOW_HEIGHT}
    WINDOW_WIDTH = frame.width
    WINDOW_HEIGHT = frame.height
    H_W_RATIO = frame.height/frame.width
    LANDSCAPE = H_W_RATIO < 3/4
    ARENA_WIDTH = LANDSCAPE ? 4/3*frame.height : frame.width
    ARENA_HEIGHT = LANDSCAPE ? frame.height : 3/4*frame.width
    SQUARE_DIM = ARENA_HEIGHT*0.5
    BTN_DIM = SQUARE_DIM/6
    OLD_DX = DX
    DX = SQUARE_DIM/(setup.props.features.x-1)
    DY = SQUARE_DIM/(setup.props.features.y-1)
    J = Math.floor(WINDOW_HEIGHT/DY)
    I = Math.floor(WINDOW_WIDTH/DX)
  
  }

  function placeButtons(alpha){
    app.stage.addChild(rotateLeftBtn)
    rotateLeftBtn.alpha = 1
    rotateLeftBtn.interactive = alpha == 0 ? false : true
    flipVerticalBtn.interactive = alpha == 0 ? false : true

    if (activePolygon != null){
      let width = activePolygon.rotated ? activePolygon.height : activePolygon.width
      let height = activePolygon.rotated ? activePolygon.width : activePolygon.height  

      rotateLeftBtn.x = activePolygon.x - BTN_DIM/2
      rotateLeftBtn.y = activePolygon.y - height/2 - 1.15*BTN_DIM
      //flipVerticalBtn.x = activePolygon.x
      //flipVerticalBtn.y = activePolygon.y - height/2 - 1.15*BTN_DIM
    }
  }

  function polyPointerDown(){
    activePolygon = this
  }

  function polyPointerMove(){
    if (this.touching){
      rotateLeftBtn.alpha = 0
      rotateLeftBtn.interactive = false
    }
  }

  function polyPointerUp(){
    
    if (!cutting){
      fadeAnimation.restart()
      snap(this)
      placeButtons()
    }
    Nodes.forEach((n)=>{app.stage.addChild(n)})
  }


  function placeScissors(){
    if (linePoints.length == 2){
      scissorBtn.x = this.x
      scissorBtn.y = this.y
      scissorBtn.alpha = 1
      app.stage.addChild(scissorBtn)
    }
  }

  function resetBtnAction(){
    updateLayoutParams()
    SQUARE = [[0,0],[0,SQUARE_DIM],[SQUARE_DIM,SQUARE_DIM],[SQUARE_DIM,0]]

    initialPolygon = new DraggablePoly(SQUARE,app)
    initialPolygon.on('pointerup',polyPointerUp)
    initialPolygon.on('pointerdown',polyPointerDown)
    initialPolygon.on('pointermove',polyPointerMove)
    polygonObjects.push(initialPolygon)
    let _x = DX*Math.round(I/2)
    let _y = DY*Math.round(J/2)
    app.stage.addChild(initialPolygon)
    TweenLite.to(initialPolygon,0,{x:_x,y:_y})
    
  }

  // Loading Script
  function load(){
    app.loaded = true
    if (setup.props.features){
      features = setup.props.features
    }

    backGround = new makeBackground()

    rotateLeftBtn = new PIXI.Sprite.from(ASSETS.ROTATE_LEFT)
    rotateLeftBtn.width = BTN_DIM
    rotateLeftBtn.height = BTN_DIM
    rotateLeftBtn.alpha = 0 
    rotateLeftBtn.y = BTN_DIM
    rotateLeftBtn.interactive = true
    app.stage.addChild(rotateLeftBtn)
    rotateLeftBtn.on('pointerdown',()=>{
      if (activePolygon != null){
        activePolygon.rotated = !activePolygon.rotated
        placeButtons(1)
        TweenLite.to(activePolygon,0.2,{rotation: activePolygon.rotation - Math.PI/2})
      }
    })

    flipVerticalBtn = new PIXI.Sprite.from(ASSETS.FLIP_VERT)
    flipVerticalBtn.x = - BTN_DIM
    flipVerticalBtn.y = BTN_DIM
    flipVerticalBtn.width = BTN_DIM
    flipVerticalBtn.height = BTN_DIM
    flipVerticalBtn.interactive = true
    app.stage.addChild(flipVerticalBtn)
    flipVerticalBtn.on('pointerdown',()=>{
      if (activePolygon != null){
        if (!activePolygon.rotated){
          TweenLite.to(activePolygon.scale,0.2,{y: activePolygon.scale.y*(-1)})
        } else {
          TweenLite.to(activePolygon.scale,0.2,{x: activePolygon.scale.x*(-1)})
        }
      }
    })

    
    resetBtn = new PIXI.Sprite.from(ASSETS.RESET)
    resetBtn.y = BTN_DIM/1.5
    resetBtn.x = WINDOW_WIDTH - BTN_DIM/1.5
    resetBtn.width = BTN_DIM
    resetBtn.height = BTN_DIM
    resetBtn.interactive = true
    resetBtn.anchor.set(0.5)
    app.stage.addChild(resetBtn)
    resetBtn.on('pointerdown',()=>{
      polygonObjects.forEach(pObj=>{
        pObj.destroy(true)
        app.stage.removeChild(pObj)
      })
      
      // Ugh - hate that I have to pass the app just to get the renderer here.
      SQUARE = [[0,0],[0,SQUARE_DIM],[SQUARE_DIM,SQUARE_DIM],[SQUARE_DIM,0]]
      let newStartingSquare = new DraggablePoly(SQUARE,app)
      console.log("I",I)
      console.log("J",J)
      newStartingSquare.x = DX*Math.round(I/2)
      newStartingSquare.y = DY*Math.round(J/2)
      newStartingSquare.on('pointerup',polyPointerUp)
                       .on('pointerdown',polyPointerDown)
                       .on('pointermove',polyPointerMove)
      app.stage.addChild(newStartingSquare)
      activePolygon = newStartingSquare
      polygonObjects = [newStartingSquare]
      rotateLeftBtn.alpha = 0
    })
    

    scissorBtn = new PIXI.Sprite.from(ASSETS.SCISSORS)
    scissorBtn.alpha = 0
    scissorBtn.width = BTN_DIM
    scissorBtn.height = BTN_DIM
    scissorBtn.interactive = true
    app.stage.addChild(scissorBtn)
    scissorBtn.on('pointerdown',()=>{
      if (linePoints.length != 2){

      } else {
        cut()
        linePoints = []
        Nodes.forEach((n)=>{n.texture = OPEN_CIRCLE_TEXTURE})
        stencil.clear()
        scissorBtn.alpha = 0
      }
    })

 
    let {x,y,descriptor} = setup.props.features
    setNodes(x,y)


    stencil = new Stencil()
    stencil.lineStyle(4,0x000000)
    stencil.x = 0 
    stencil.y = 0
    app.stage.addChild(stencil)

    const onComplete = () => {
      rotateLeftBtn.interactive = false
      flipVerticalBtn.interactive = false
    }
    fadeAnimation.to([rotateLeftBtn,flipVerticalBtn],1,{alpha: 0,onComplete: onComplete},"+=2")

      updateLayoutParams()
     // setTimeout(()=>{resetBtnAction()},1000)
     resetBtnAction()
  }

  // Call load script
  load()
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame)
  app.resizable = false
};
