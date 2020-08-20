import * as PIXI from "pixi.js";
import blueGradient from "../assets/Clouds.png";
import spaceGround from "../assets/SpaceGround.png";
import Mountains from "../assets/Mountains.png";
import mountainAndSky from "../assets/MountainsAndSky.png";
import ground from "../assets/SnowGround.png";
import spaceShipWindow from "../assets/SpaceShipWindow.png";
import nightBackground from "../assets/NightBackground.png";
import SnowCannon from "../assets/SnowCannon.png";
import Snowman from "../assets/Snowman.png";
import Snowball from "../assets/Snowball.png";
import {BLUE,RED,GREEN,ORANGE,PURPLE,PINK,NUMERAL,BALLS,BUTTONS} from "../AssetManager.js"
import * as CONST from "./const.js";
import { Fraction, Draggable, distance, FractionFrame, UltimateNumberLine, Cannon } from "./api.js";
import {
  TweenMax,
  TimelineLite,
  Power2,
  Elastic,
  CSSPlugin,
  TweenLite,
  TimelineMax,
  Power4,
  Linear
} from "gsap";

export const init = (app, setup) => {


  // Constants 
  const WINDOW_WIDTH = setup.width
  const WINDOW_HEIGHT = setup.height
  // Vector was originally a "Cannon" sprite.
  const CANNON_ANCHOR = {x:0.05*WINDOW_WIDTH,y: 8/10*WINDOW_HEIGHT }

  let backGround;
  let snowGround;
  let features;
  let snowballs = []
  let snowman;
  let numberline;
  let gravity;
  let ballSize;
  let launchVector = {x: WINDOW_HEIGHT/2,y: WINDOW_WIDTH/4}
  
  

  // NOTE: Vectors - in progress, allows students to adjust x and y magnitudes individually.
  let V = new PIXI.Graphics()
  V.hitArea = new PIXI.Circle(0,0,20)
  let Vy = new PIXI.Graphics()
  Vy.hitArea = new PIXI.Circle(0,0,20)
  let Vx = new PIXI.Graphics()
  Vx.hitArea = new PIXI.Circle(0,0,20)


  function vectorPointerDown(){
    this.touching = true
  }

  function vectorPointerMove(e){
    if (this.touching){
      this.moved = true
  
      let x1 = e.data.global.x
      let y1 = e.data.global.y
      
      if (this.ID == 0){
        launchVector.x = x1 + 10
        launchVector.y = y1 + 10
      } else if (this.ID == 1){
        launchVector.x = x1 + 10
      } else if (this.ID == 2){
        launchVector.y = y1 + 10
      }

      drawVectors()
    }
  }

  function vectorPointerUp(){
    this.touching = false
    let centerZero = numberline.centerZero()
    let dX = launchVector.x - centerZero.x
    let dY = launchVector.y - centerZero.y
    let magV = Math.sqrt(dX*dX + dY*dY)
    let theta = Math.acos(dX/magV)

    if (!this.moved){
      fire(magV,theta)
    }

    this.moved = false
  }


  function drawVectors(){

    let strokeThickness = numberline.lineThickness
    let centerZero = numberline.centerZero()
    let x0 = centerZero.x 
    let y0 = centerZero.y + strokeThickness/2
    let x1 = launchVector.x
    let y1 = launchVector.y
    let dX = x1 - x0
    let dY = y1 - y0

    let magV = Math.sqrt(dX*dX + dY*dY)
    let theta = Math.acos(dX/magV)

    if (y1 <= y0) {
      V.clear()
      V.moveTo(x0,y0)
      V.lineStyle(strokeThickness,0x000000)
      V.lineTo(x1,y1)
      V.beginFill(0x000000)
      V.lineTo(x1+5*Math.sin(theta),y1+5*Math.cos(theta))
      V.lineTo(x1+10*Math.cos(theta),y1-10*Math.sin(theta))
      V.lineTo(x1-5*Math.sin(theta),y1-5*Math.cos(theta))
      V.lineTo(x1,y1)
      V.hitArea.x = x1 
      V.hitArea.y = y1
    

      Vx.clear()
      Vx.moveTo(x0,y0)
      Vx.lineStyle(strokeThickness,0xff3d9b)
      Vx.lineTo(x1,y0)
      Vx.beginFill(0xff3d9b)
      Vx.lineTo(x1,y0-5)
      Math.cos(theta) > 0 ? Vx.lineTo(x1+10,y0) : Vx.lineTo(x1-10,y0) 
      Vx.lineTo(x1,y0+5)
      Vx.lineTo(x1,y0)
      Vx.hitArea.x = x1 
      Vx.hitArea.y = y0
      console.log("v.x",Vx.width)

      Vy.clear()
      Vy.moveTo(x0,y0)
      Vy.lineStyle(strokeThickness,0xf3ff4f)
      Vy.lineTo(x0,y1)
      Vy.beginFill(0xf3ff4f)
      Vy.lineTo(x0+5,y1)
      Vy.lineTo(x0,y1-10)
      Vy.lineTo(x0-5,y1)
      Vy.lineTo(x0,y1)
      Vy.hitArea.x = x0
      Vy.hitArea.y = y1

    }
  }

  Vx.on('pointermove',vectorPointerMove)
  Vx.on('pointerdown',vectorPointerDown)
  Vx.on('pointerup',vectorPointerUp)
  Vx.on('pointerupoutside',vectorPointerUp)
  Vx.ID = 1
  Vx.interactive = true

  Vy.on('pointermove',vectorPointerMove)
  Vy.on('pointerdown',vectorPointerDown)
  Vy.on('pointerup',vectorPointerUp)
  Vy.on('pointerupoutside',vectorPointerUp)
  Vy.ID = 2
  Vy.interactive = true

  V.on('pointermove',vectorPointerMove)
  V.on('pointerdown',vectorPointerDown)
  V.on('pointerup',vectorPointerUp)
  V.on('pointerupoutside',vectorPointerUp)
  V.ID = 0
  V.interactive = true

  function fire(v,theta){
    let newSnowball = new PIXI.Sprite.from(Snowball)
    app.stage.addChild(newSnowball)
    snowballs.push(newSnowball)
    newSnowball.anchor.set(0.5)
    newSnowball.landed = false
    newSnowball.x = WINDOW_WIDTH/2
    newSnowball.y = CANNON_ANCHOR.y
    newSnowball.width = ballSize
    newSnowball.height = ballSize

    let time = {t: 0}

    let v0Y = v*Math.sin(theta)
    let v0X = v*Math.cos(theta)

    console.log("theta",theta)
    let totalTime = 2*v0Y/gravity

    const onUpdate = ()=> {
      let t = time.t
      newSnowball.y = CANNON_ANCHOR.y + 1/2*gravity*t*t - v0Y*t
      newSnowball.x = WINDOW_WIDTH/2 + v0X*t
      // Keep numberline disabled when balls are in the air.
      numberline.interactive = false
    }

    const onComplete = ()=> {
      newSnowball.value = numberline.getNumberLineFloatValueFromPosition(newSnowball.x)
      numberline.interactive = true
    }
    TweenLite.to(time,{duration: totalTime,t: totalTime,onUpdate: onUpdate,ease: Linear.easeNone,onComplete: onComplete})
  }
 
 
  function load() {

    // NOTE: Sometimes is pass features to a interactive to customize it for particular activity.
    if (setup.props.features) {
      features = setup.props.features;
    }

    backGround = new PIXI.Sprite.from(mountainAndSky);
    backGround.width = WINDOW_WIDTH
    backGround.height = WINDOW_HEIGHT
    backGround.y = CANNON_ANCHOR.y - backGround.height
    app.stage.addChild(backGround);

    snowGround = new PIXI.Sprite.from(ground);
    snowGround.width = WINDOW_WIDTH
    snowGround.height = WINDOW_HEIGHT/5
    snowGround.y = WINDOW_HEIGHT - snowGround.height
    app.stage.addChild(snowGround);

    numberline = new UltimateNumberLine(-30,30,WINDOW_WIDTH,app)
    let range = numberline.maxFloat - numberline.minFloat
    ballSize = numberline.width/range
    numberline.interactive = true
    numberline.y = CANNON_ANCHOR.y
    numberline.hitArea = new PIXI.Rectangle(0,0,WINDOW_WIDTH,WINDOW_HEIGHT-CANNON_ANCHOR.y)
    // NOTE: Numberlines onUpdate is called inside "draw"
    numberline.onUpdate = ()=> {
      snowballs.forEach(s=>{
        let range = numberline.maxFloat - numberline.minFloat
        ballSize = numberline.width/range
        s.width = ballSize
        s.height = ballSize
        s.x = numberline.getNumberLinePositionFromFloatValue(s.value)
        gravity = WINDOW_WIDTH/(numberline.maxFloat - numberline.minFloat)*9.8
      })
      backGround.x = numberline.getNumberLinePositionFromFloatValue(-50)
      backGround.width = numberline.getNumberLinePositionFromFloatValue(50) - backGround.x
      backGround.height = WINDOW_HEIGHT/WINDOW_WIDTH*backGround.width
      backGround.y = CANNON_ANCHOR.y - backGround.height

    }  
    app.stage.addChild(snowGround)
    app.stage.addChild(numberline)


    // NOTE: Gravity in pixels per second.
    gravity = WINDOW_WIDTH/(numberline.maxFloat - numberline.minFloat)*9.8

    app.stage.addChild(Vy)
    app.stage.addChild(Vx)
    app.stage.addChild(V)


    // Initial Snowball
    let snowball = new PIXI.Sprite.from(Snowball)
    app.stage.addChild(snowball)
    snowballs.push(snowball)
    snowball.value = 0
    snowball.anchor.set(0.5)
    snowball.x = WINDOW_WIDTH/2
    snowball.y = CANNON_ANCHOR.y
    snowball.width = ballSize
    snowball.height = ballSize
  

    // Deprecated Snowman
    snowman = new PIXI.Sprite.from(Snowman)
    //app.stage.addChild(snowman)
    snowman.height = 100
    snowman.width = 75
    snowman.x = WINDOW_WIDTH/2 + (-1 + 2*Math.random())*WINDOW_WIDTH/2
    snowman.y = CANNON_ANCHOR.y - snowman.height

    drawVectors(launchVector.x,launchVector.y)


  }

  // Call load script
  load();

};
