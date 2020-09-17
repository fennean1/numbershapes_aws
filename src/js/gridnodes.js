import * as PIXI from "pixi.js";
import blueGradient from "../assets/blue-gradient.png";
import * as CONST from "./const.js";
import { TweenMax, TimelineLite, Power2, Elastic, CSSPlugin, TweenLite, TimelineMax } from "gsap";
import {BasicFraction,Fraction, Draggable, distance} from "./api.js"
const ASSETS = CONST.ASSETS


export const init = (app, setup) => {

  let features = {}

  if (setup.props.features){
    features = setup.props.features
  }

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
  let SQUARE_DIM = LANDSCAPE ? ARENA_HEIGHT*0.6 : ARENA_WIDTH*0.35
  let SQUARE_AREA = SQUARE_DIM*SQUARE_DIM
  let BTN_DIM = SQUARE_DIM/6
  let BOUNCE_FACTOR = 1.5
  let SMALL_CIRCLE_RADIUS = WINDOW_WIDTH/50
  let BIG_CIRCLE_RADIUS = SMALL_CIRCLE_RADIUS*1.5
  let DX = 10
  let DY = 10

  let stencil;
  let Nodes = []
  let CurrentPolygon = []
  let activePolygon = null
  let polygons = []
  let fractionObj;
  let trashBtn;
  let rotateLeftBtn;
  let rotateRightBtn;
  let duplicateBtn;
  let flipVerticalBtn;
  let flipHorizontalBtn;
  let resetBtn;
  let square;
  let square2;

  let fadeAnimation = new TimelineLite({paused: true})
 
  square = new PIXI.Graphics()
  square.lineStyle(3,0xffffff)
  square.drawRoundedRect(0,0,SQUARE_DIM,SQUARE_DIM,1)
  square.x = WINDOW_WIDTH/2 - SQUARE_DIM/2
  square.y = WINDOW_HEIGHT/2 - SQUARE_DIM/2

  square2 = new PIXI.Graphics()
  square2.lineStyle(3,0xffffff)
  square2.drawRoundedRect(0,0,SQUARE_DIM,SQUARE_DIM,1)
  square2.x = WINDOW_WIDTH/2 - SQUARE_DIM/2
  square2.y = WINDOW_HEIGHT/2 - SQUARE_DIM/2


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
      this.outline = new PIXI.Graphics()
      //this.addChild(this.outline)
    }

    draw(nodes){
      this.clear()
      this.lineStyle(4,0x0077ff)
      for (let i = 0;i<nodes.length;i++){
        let x = nodes[i][0]
        let y = nodes[i][1]
        if (i==0){
          this.moveTo(x,y)
        } else {
          this.lineTo(x,y)
        }
      }
    }
    reset(){
      this.clear()
    }
  }

  function linesIntersect(l1,l2){
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

      yIntersect = Math.trunc(yIntersect*1000)/1000
      xIntersect = Math.trunc(xIntersect*1000)/1000


      // Padding 
      let p = 4
      let inYRange1 = l1.horizontal ? true : (yIntersect > l1.yMin+p) && (yIntersect < l1.yMax-p)
      let inXRange1 = l1.vertical ? true : (xIntersect > l1.xMin+p) && (xIntersect < l1.xMax-p)
      let inYRange2 = l2.horizontal ? true : (yIntersect > l2.yMin+p) && (yIntersect <= l2.yMax-p)
      let inXRange2 = l2.vertical ? true : (xIntersect > l2.xMin+p) && (xIntersect < l2.xMax-p)


      return (inXRange1 && inXRange2 && inYRange1 && inYRange2)
    } 
  }

  function appxEq(a,b,t){
    return Math.abs(a-b) < t
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
        let inXRange = x > line.xMin && x < line.xMax
        let inYRange = y > line.yMin && y < line.yMax
        if (inXRange && inYRange){
          return true
        }
    } else {
      return false
    }
  }

  function activateNodesInPath(line){
    let valid = true
    Nodes.forEach(n=>{
      if (lineContains(line,[n.x,n.y])){
       if (n.activated){
          valid = false
        } else {
          n.activated = true 
          let hw = BIG_CIRCLE_RADIUS
          console.log("BIG CIRCLE RADIOUS",BIG_CIRCLE_RADIUS)
          TweenLite.to(n,{width: hw,height: hw,ease: 'bounce'})
        }
      }
    })
    return valid
  }

  class Line {
    constructor(p1,p2){
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

      this.vertical = Math.abs(this.m) > 1000 ? true : false 
      this.horizontal = Math.abs(this.m) < 0.001 ? true : false

      this.b = this.vertical ? null : this.y1 - this.m*this.x1

    }

    yOf(x){
      console.log("this.m,x,this.b,",this.m,x,this.b)
      return this.m*x+this.b
    }

    xOf(y){
      return (y-this.b)/this.m
    }

  }

  function showErrorAt(point){
    let from = CurrentPolygon[CurrentPolygon.length-1]
    let g = new PIXI.Graphics()
    g.lineStyle(4,0x000000)
    g.moveTo(from[0],from[1])
    g.lineTo(point[0],point[1])
    g.alpha = 0
    app.stage.addChild(g)
    const onComplete = () => g.destroy(true)
    TweenLite.to(g,0.1,{alpha: 1,onComplete: onComplete})
  }

  function getLinesFromPoly(poly,wrap = false){
      let n = poly.length
      let lines = poly.map((p,i)=>{
       // console.log("making a line")
        return new Line(p,poly[(i+1)%n])
      })
      if (!wrap){
        lines.pop()
      }
      return lines
  }

  function isNewPointValid(poly,newPoint){
    let valid = true
    if (poly.length == 0){
      // console.log("length is zero")
      return true
    } else {
      let last = poly[poly.length-1]
     // console.log("last,newpoint",last,newPoint)
      let newLine = new Line(last,newPoint)

      let lines = getLinesFromPoly(poly)
     // console.log("there are the lines",lines)
      lines.forEach(l => {
      //  console.log("iterating")
        if (linesIntersect(l,newLine)){
          //console.log("lines interesect!!!!")
          valid = false
        }
      })
      return valid && activateNodesInPath(newLine)
    }
  }


  class Node extends PIXI.Sprite {
    constructor(){
      super()
      this.on('pointerdown',this.pointerDown)
      //this.on('pointerup',this.pointerUp)
      //this.on('pointerupoutside',this.pointerUpOutside)
      this.anchor.set(0.5)
      this.activated = false
      this.interactive = true
    }

    pointerDown(){
      if (this.first){
        let newPoint = [this.x,this.y]
        if (CurrentPolygon.length > 2 && isNewPointValid(CurrentPolygon,newPoint)){
          let newPoly = new DraggablePoly(CurrentPolygon)
          polygons.push(newPoly)
          app.stage.addChild(newPoly)
        }
        Nodes.forEach(n=>{
          if (n.activated){
            TweenLite.to(n,{width: SMALL_CIRCLE_RADIUS,height: SMALL_CIRCLE_RADIUS,ease: 'bounce'})
            n.activated = false
          }
        })
        this.first = false
        stencil.reset()
        CurrentPolygon = []
      } else {
        let hw = BIG_CIRCLE_RADIUS
        if (CurrentPolygon.length == 0){
          this.first = true
          this.activated = true
         // this.texture = CLOSED_CIRCLE_TEXTURE
          CurrentPolygon.push([this.x,this.y])
          TweenLite.to(this,{width: hw,height: hw,ease: 'bounce'})
        } else if (!this.activated){
            let newPoint = [this.x,this.y]
            let valid = isNewPointValid(CurrentPolygon,newPoint)
            console.log("new point valid",valid)
            if (valid) {
              TweenLite.to(this,{width: hw,height: hw,ease: 'bounce'})
              this.activated = true
              CurrentPolygon.push(newPoint)
              stencil.draw(CurrentPolygon)

  
              //this.texture = CLOSED_CIRCLE_TEXTURE
              app.stage.addChild(this)
              app.stage.addChild(stencil)
            } else {
              showErrorAt([this.x,this.y])
            }
        }
      }
      //Nodes.forEach((n)=>{app.stage.addChild(n)})
    }
  }




  // Initializing grid
  function set(a,b){
    let overflowX = 0
    let overflowY = 0
    if (features.overflow){
      overflowX = features.overflow.x 
      overflowY = features.overflow.y
    }

    DY = SQUARE_DIM/(b-1)
    DX = DY
    let offset = features.double ? DX*(a-1)/4 : 0
    let dim = SQUARE_DIM/20

    let circle = new PIXI.Graphics()
    circle.beginFill(0x0077ff)
    circle.drawCircle(0,0,2*SMALL_CIRCLE_RADIUS)
    let circleTexture = app.renderer.generateTexture(circle)

    for (let i=-overflowX;i<a+overflowX;i++){
      for (let j=-overflowY;j<b+overflowY;j++){
        let n = new Node()
        n.texture = circleTexture

        Nodes.push(n)
        n.x = WINDOW_WIDTH/2 - SQUARE_DIM/2 + i*DX - offset
        n.y = WINDOW_HEIGHT/2 - SQUARE_DIM/2 + j*DY
        n.w = DX/10
        n.height = SMALL_CIRCLE_RADIUS
        n.width = n.height
        n.hitArea = new PIXI.Circle(0,0,5*SMALL_CIRCLE_RADIUS)
        app.stage.addChild(n)
      }
    }

    if (features.double){
      square.x = square.x - offset
      square2.x = square.x + b*DX
    }
  }


  class DraggablePoly extends Draggable {
    constructor(points){

      let xS = points.map(p=> p[0])
      let yS = points.map(p=> p[1])
      let minX = Math.min(...xS)
      let minY = Math.min(...yS)

      let flatPolygon = []
      points.forEach(p=>{
        flatPolygon.push(p[0]-minX)
        flatPolygon.push(p[1]-minY)
      })

      let a = polygonArea(points)/SQUARE_AREA
      let f = decimalToFrac(a)
     
      var graphics = new PIXI.Graphics();
      graphics.beginFill(0x0077ff);
      graphics._fillStyle.alpha = 0.8
      graphics.drawPolygon(flatPolygon);
      graphics.endFill();
  
      let t = app.renderer.generateTexture(graphics)

      // Construct Super
      super(t)

      this.n = f[0]
      this.d = f[1]
      fractionObj.draw(this.n,this.d,BTN_DIM)

      this.hitArea = new PIXI.Polygon(flatPolygon)
      this.points = points

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
      console.log("pointerleave!!!!")
      //fadeAnimation.play("tag")
    }

    
    polyPointerDown(){
      fadeAnimation.pause()
      activePolygon = this
      fractionObj.draw(this.n,this.d,BTN_DIM)
      app.stage.addChild(this)
    }

    polyPointerMove(){
      if (this.touching){
        //placeButtons(0)
      }
    }

    polyPointerUp(){
      //placeButtons(1)
      //fadeAnimation.restart()
      // distance([this.x,this.y],[trashBtn.x,trashBtn.y]) < 200
      if (false) {
        //placeButtons(0)
        //fadeAnimation.stop()
        let i = polygons.indexOf(this)
        polygons.splice(i,1)
        app.stage.removeChild(this)
        this.destroy(true)
        if (polygons.length != 0){
          activePolygon = polygons[0]
        } else {
          activePolygon = null
        }
        fractionObj.draw(0,1,BTN_DIM)
      }
    }
  }

  function decimalToFrac(dec){
    for (let i=1;i<100;i++){
      for (let j=0;j<=2*i;j++){
        if (Math.abs(j/i - dec) < 0.001) {
          return [j,i]
        }
      }
    }
  }

  // Called on resize
  function resize(newFrame,flex){
    // Make sure all layout parameters are up to date.
    updateLayoutParams(newFrame)
    app.renderer.resize(WINDOW_WIDTH,WINDOW_HEIGHT)
  }


  function polygonArea(poly) {
     let area = 0
     let xS = poly.map(p=> p[0])
     let yS = poly.map(p=> p[1])
 
      // Calculate value of shoelace formula 
      let n = poly.length
      let j = n - 1 
      for (let i = 0; i < n; i++) { 
          area = area + (xS[j] + xS[i]) * (yS[j] - yS[i]);
          j = i;  // j is previous vertex to i 
      } 
    
      // Return absolute value 
      return Math.abs(area / 2)
  } 

  function updateLayoutParams(newFrame){
    let frame;
    if (newFrame){
      frame = newFrame
    } else {
      frame = {width: WINDOW_WIDTH,height: WINDOW_HEIGHT}
    }
    WINDOW_WIDTH = frame.width
    WINDOW_HEIGHT = frame.height
    H_W_RATIO = frame.height/frame.width
    LANDSCAPE = H_W_RATIO < 3/4
    ARENA_WIDTH = LANDSCAPE ? 4/3*frame.height : frame.width
    ARENA_HEIGHT = LANDSCAPE ? frame.height : 3/4*frame.width
  }

  function placeButtons(alpha){
    app.stage.addChild(rotateLeftBtn)
    app.stage.addChild(flipVerticalBtn)
    rotateLeftBtn.alpha = alpha 
    flipVerticalBtn.alpha = alpha
    rotateLeftBtn.interactive = alpha == 0 ? false : true
    flipVerticalBtn.interactive = alpha == 0 ? false : true

    if (activePolygon != null){
      let width = activePolygon.rotated ? activePolygon.height : activePolygon.width
      let height = activePolygon.rotated ? activePolygon.width : activePolygon.height  

      rotateLeftBtn.x = activePolygon.x - BTN_DIM
      rotateLeftBtn.y = activePolygon.y - height/2 - 1.15*BTN_DIM
      flipVerticalBtn.x = activePolygon.x
      flipVerticalBtn.y = activePolygon.y - height/2 - 1.15*BTN_DIM
    }
  }

  // Loading Script
  function load(){
    console.log("loading grid nodes")
    console.log("features",setup.props.features)
    app.loaded = true
    if (setup.props.features){
      features = setup.props.features
    }

    let backGround = new makeBackground()

    rotateLeftBtn = new PIXI.Sprite.from(ASSETS.ROTATE_LEFT)
    rotateLeftBtn.width = BTN_DIM
    rotateLeftBtn.height = BTN_DIM
    rotateLeftBtn.x = - BTN_DIM
    rotateLeftBtn.interactive = true
    rotateLeftBtn.alpha = 0
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
    resetBtn.y = 0*BTN_DIM
    resetBtn.width = BTN_DIM
    resetBtn.height = BTN_DIM
    resetBtn.interactive = true
    //app.stage.addChild(resetBtn)
    resetBtn.on('pointerdown',()=>{
      polygons.forEach(p=>{
        app.stage.removeChild(p)
        p.destroy(true)
      })
      polygons = []
      activePolygon = null 
      fractionObj.draw(0,1,BTN_DIM)
    })

    duplicateBtn = new PIXI.Sprite.from(ASSETS.DUPLICATE)
    duplicateBtn.y = BTN_DIM
    duplicateBtn.width = BTN_DIM
    duplicateBtn.height = BTN_DIM
    duplicateBtn.interactive = true
    //app.stage.addChild(duplicateBtn)
    duplicateBtn.on('pointerdown',()=>{
      if (activePolygon != null){
        let newPoly = new DraggablePoly(activePolygon.points)
        polygons.push(newPoly)
        newPoly.x = activePolygon.x + 40
        newPoly.y = activePolygon.y + 20
        newPoly.rotated = activePolygon.rotated
        newPoly.rotation = activePolygon.rotation 
        newPoly.scale.x = activePolygon.scale.x 
        newPoly.scale.y = activePolygon.scale.y
        app.stage.addChild(newPoly)   
      }
    })


    trashBtn = new PIXI.Sprite.from(ASSETS.TRASH)
    trashBtn.width = BTN_DIM*0.8
    trashBtn.height = BTN_DIM*0.8
    trashBtn.x = WINDOW_WIDTH - trashBtn.width*1.1
    trashBtn.y = trashBtn.width*0.1
    trashBtn.interactive = true
    //app.stage.addChild(trashBtn)
 
    let {x,y,descriptor} = setup.props.features
    set(x,y)

    fractionObj = new BasicFraction(0,1,BTN_DIM)
    fractionObj.x = WINDOW_WIDTH*0.8
    fractionObj.y = WINDOW_HEIGHT/3
    if (descriptor){
      app.stage.addChild(fractionObj)
    }

    stencil = new Stencil()
    stencil.x = 0 
    stencil.y = 0
    app.stage.addChild(stencil)

    const onComplete = () => {
      rotateLeftBtn.interactive = false
      flipVerticalBtn.interactive = false
    }
    fadeAnimation.to([rotateLeftBtn,flipVerticalBtn],1,{alpha: 0,onComplete: onComplete},"+=2")


    //fadeAnimation.play()

    app.stage.addChild(square)

    if (features.double){
      app.stage.addChild(square2)
    }

    Nodes.forEach(n=>{
      app.stage.addChild(n)
    })

  }

  // Call load script
  load()
  // Not sure where else to put this.
  app.resize = (frame) => resize(frame)
  app.resizable = false
};
