import * as PIXI from "pixi.js";
import {TweenMax,TweenLite,TimelineLite,Linear} from "gsap";
import Clouds from "../assets/Clouds.png";
import Waves from "../assets/Waves.png";
import Ship from "../assets/Ship.png";
import GreenGrass from "../assets/GreenGrass.png";
import Mountains from "../assets/Mountains.png";
import IceBlock from "../assets/SpaceGround.png";
import Grass from "../assets/Grass.png";
import BlankCard from "../assets/BlankCard.png";
import Reset from "../assets/Reset.png";
import PlayButton from "../assets/PlayButton.png";
import {BLUE,RED,GREEN,ORANGE,PURPLE,PINK,NUMERAL,BALLS,BUTTONS,DOTS} from "../AssetManager.js"
import {shuffle, Timer} from "./api.js"
import { Tween } from "gsap/gsap-core";


const STATES =  {
  INACTIVE: 0,
  PAUSED: 1,
  ACTIVE: 2,
  COMPLETE: 3,
}

export const init = (app, setup) => {

// CONSTANTS
const WINDOW_WIDTH = setup.width
const WINDOW_HEIGHT = setup.height
const CARD_SPACING_PERCENTAGE = 0.05
const GRID_WIDTH = Math.min(setup.height,setup.width)*0.8
const GRID_HEIGHT = GRID_WIDTH
const CARD_WIDTH = GRID_WIDTH/5
const CARD_HEIGHT = CARD_WIDTH
const DX = WINDOW_WIDTH/15
const DY = DX
const GRID_X = setup.width/2 - GRID_WIDTH/2 + CARD_WIDTH/2
const GRID_Y = setup.height/2 - GRID_HEIGHT/2
const GRASS_HEIGHT = setup.height/5
const GRASS_WIDTH = setup.width/2
const GRASS_Y = setup.height - GRASS_HEIGHT*1.2

const GAP_START = 2/10*WINDOW_WIDTH
const GAP_END = 3.5/10*WINDOW_WIDTH

const RESET_TEXTURE = new PIXI.Texture.from(Reset);
const PLAY_TEXTURE = new PIXI.Texture.from(PlayButton);



// UI ELEMENTS
let backGround;
let grass;
let grass2;
let timer;
let playButton;
let homeButton;
let waves;
let cardBank;
let dots = []
let cards = []
let balls = []
let A = null
let B = null


// GLOBAL DATA
let cardPool;
let textureCache;
let ballTextureCache;
let features;
let state = STATES.INACTIVE



// TIMELINES
let dotTimeline = new TimelineLite({paused: true})
let grassTimeline = new TimelineLite({paused: true})
let timerTimeline = new TimelineLite({paused: true})


function restartAnimation(){
  dotTimeline.kill()
  grassTimeline.kill()
  timerTimeline.kill()
  timer.reset()
  playButton.animationBegun = false
  playButton.texture = PLAY_TEXTURE

  dots.forEach(d=>{
    d.x = -d.width/2
    d.y = grass.y - d.height/2
  })
  grass2.x = GAP_END
}


function pauseDots(){
  switch (state){
    case STATES.INACTIVE:
        // Nothing To Pause
      break;
    case STATES.PAUSED:
      state = STATES.ACTIVE
      dotTimeline.play()
      grassTimeline.play()
      timerTimeline.play()
      break;
    case STATES.ACTIVE:
      state = STATES.PAUSED
      dotTimeline.pause()
      grassTimeline.pause()
      timerTimeline.pause()
      break;
    case STATES.COMPLETE:
      dotTimeline.pause()
      grassTimeline.pause()
      timerTimeline.pause()
      break;
    default:
      break;
  }
}

function actionClicked(){

  if (state == STATES.INACTIVE){
    this.texture = RESET_TEXTURE
    animateDots()
    state = STATES.ACTIVE
  } else {
    this.texture = PLAY_TEXTURE
    state = STATES.INACTIVE
    restartAnimation()
  }
}


function animateDots(){
const onComplete = ()=>{
  state = STATES.COMPLETE
  pauseDots()
}


const onUpdate= ()=>{
  timer.draw()
}

dotTimeline = new TimelineLite({paused: true})
grassTimeline = new TimelineLite({paused: true})
timerTimeline = new TimelineLite({paused: true,onComplete: onComplete})

timerTimeline.to(timer,{duration: timer.totalTime,currentTime: timer.totalTime,onUpdate: onUpdate,ease: Linear.easeNone})
grassTimeline.to(grass2,{duration: 26,x: setup.width,ease: Linear.easeNone})

  dots.forEach((d,i)=>{
    let T = new TimelineLite()

    const onUpdate = () => {
      d.y = grass2.y - d.height/2+ 1/300*(d.x-GAP_START)*(d.x - 7/10*setup.width)
    }
    let offset = i == 0 ? 0 : "-=5"
    T.to(d,{duration: 2,x: GAP_START,ease: Linear.easeNone})
    
    if (i<=10){
      T.to(d,{duration: 2,x: 7/10*setup.width,onUpdate: onUpdate,ease: Linear.easeNone})
      T.to(d,{duration: 2,x: setup.width+d.width/2,ease: Linear.easeNone})
    } else {
      T.to(d,{duration: 2,x: 7.1/10*setup.width,onUpdate: onUpdate,ease: Linear.easeNone})
      T.to(d,{duration: 2,y: waves.y,ease: "elastic"})
    }
    dotTimeline.add(T,offset)
  }) 
  dotTimeline.play()
  grassTimeline.play()
  timerTimeline.play()
}

function init(){

  // Background
  backGround = new PIXI.Sprite.from(Clouds);
  backGround.width = setup.width;
  backGround.height = setup.height;
  backGround.paused = false
  backGround.on('pointerdown',pauseDots)
  backGround.interactive = true
  app.stage.addChild(backGround);

  waves = new PIXI.Sprite.from(Waves);
  waves.width = setup.width
  waves.height = GRASS_HEIGHT*0.7
  waves.y = setup.height - waves.height
  waves.x = 0
  app.stage.addChild(waves);

  grass2 = new PIXI.Sprite.from(GreenGrass);
  grass2.width = 0.65*WINDOW_WIDTH
  grass2.height = GRASS_HEIGHT
  grass2.y =  setup.height - grass2.height
  grass2.x = GAP_END
  app.stage.addChild(grass2);


  grass = new PIXI.Sprite.from(GreenGrass);
  grass.width = GRASS_WIDTH
  grass.height = GRASS_HEIGHT
  grass.y = setup.height -  grass.height
  grass.x = GAP_START - grass.width
  app.stage.addChild(grass);



  homeButton = new PIXI.Sprite.from(BUTTONS.HOME)
  homeButton.width = DX
  homeButton.height = DX
  homeButton.x = DX/4
  homeButton.y = DX/4
  homeButton.interactive = true
  homeButton.on('pointerdown',()=>{app.goHome()})

  playButton = new PIXI.Sprite.from(PlayButton)
  playButton.width = DX
  playButton.height = DX
  playButton.x = WINDOW_WIDTH-5*DX/4
  playButton.y = DX/4
  playButton.animationBegun = false
  playButton.interactive = true
  playButton.on('pointerdown',actionClicked)

  app.stage.addChild(homeButton)
  app.stage.addChild(playButton)
  app.stage.addChild(grass2);

  for (let i = 0;i<12;i++){
    let dot = new PIXI.Sprite.from(DOTS[Object.keys(DOTS)[i%5]])
    app.stage.addChild(dot)
    dot.anchor.set(0.5)
    dot.height = DY/2 
    dot.width = DX/2
    dot.y = grass.y - dot.height/2
    dot.x = -dot.width/2
    dots.push(dot)
  }

  app.stage.addChild(waves)
  app.stage.addChild(grass2);
  app.stage.addChild(grass);

  // Load Features
  if (setup.props.features){
    features = setup.props.features
  }
  let timerWidth = WINDOW_WIDTH/2
  timer = new Timer(7,timerWidth,timerWidth/20,app)
  app.stage.addChild(timer)
  timer.x = WINDOW_WIDTH/4
  timer.y = timer.height

  state  = STATES.INACTIVE

}

  init();
};
