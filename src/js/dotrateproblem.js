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
import {shuffle} from "./api.js"
import { Tween } from "gsap/gsap-core";


export const init = (app, setup) => {

// Constants
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


let backGround;
let grass;
let grass2;
let playAgainButton;
let homeButton;
let waves;
let cardBank;
let textureCache;
let ballTextureCache;

let cardPool;

let features;

let dots = []
let cards = []
let balls = []
let A = null
let B = null

let dotTimeline = new TimelineLite({paused: true})
let grassTimeline = new TimelineLite({paused: true})

const synchCards = () => {
  A = null 
  B = null
  cards.forEach((r,i)=>{
    r.forEach((c,j)=>{
      if (c.markedForUpdate){
        let newAsset = cardPool.get()
        c.value = newAsset.value
        c.color = newAsset.color
        c.number = newAsset.number
        c.texture = newAsset
        c.isDefault = newAsset.isDefault
      }
      c.width = DX 
      c.height = DY
      c.markedForUpdate = false
      c.rotation = 0
      c.interactive = c.isDefault ? false : true
    })
  })
  if (cardPool.numberofDefaults >= 25){
    cardsForEach(c=>{TweenLite.to(c,2,{alpha: 0,onComplete:  showScore})})
  }
}

function reloadGame(){
 
}

// Helper function for iterating through cards.
function cardsForEach(callback){
  cards.forEach((r,i)=>{
    r.forEach((c,j)=>{
      callback(c,j,r,i)
    })
  })
}

function showScore() {
  const onComplete = ()=> {
    TweenLite.to(playAgainButton,0.5,{y: DY/2})
  }
  let T = new TimelineLite({paused: true,onComplete: onComplete})
  let tens = (balls.length - balls.length%10)/10
  let width = (tens+1)*DX/4

  let tweens = []
  
  balls.forEach((b,i)=>{
    let j = (i - i%10)/10
    let startX = setup.width/2 - width/2
    let startY = setup.height/2 - DY
    let toX = startX+j*DX/4
    let toY = startY + i%10*DY/5
    if (i==0){
      T.to(b,{duration: 1,x: toX,y: toY,ease: "power2.inOut"})
    } else {
      T.to(b,{duration: 1,x: toX,y: toY,ease: "power2.inOut"},"-=0.95")
    }
  })

   T.play()

}

function cardClicked(){
  let numeralTexture = textureCache[6][this.value]
  this.texture = numeralTexture
  this.markedForUpdate = true
 if (A) {
   cardsForEach(e=>e.interactive = false)
    if (this.value == A.value && A != this) {
          
    const onComplete = ()=>{
      A.y = -DY
      this.y = -DY
      if (A.color != this.color){
        dropBalls(this.number,this.color)
        dropBalls(A.number,A.color)
      }
      condenseCards(cards)
      animateCards()
      synchCards()
    }

     TweenLite.to([A,this],0.4,{width: DX*1.15,height: DY*1.15,ease: "bounce",onComplete: onComplete})
    } else if (A != this) {
      const onComplete = ()=>{
        A.markedForUpdate = false 
        this.markedForUpdate = false
        A.texture = textureCache[A.color][A.number]
        this.texture = textureCache[this.color][this.number]
        synchCards()
      }
      let t = new TimelineLite()
      t.to([A,this],0.3,{rotation: Math.PI/6})
      t.to([A,this],0.3,{rotation: 0,ease: "bounce"})
      t.to([A,this],0.1,{rotation: 0,ease: "bounce",onComplete: onComplete})
    } else {
      cardsForEach(e=>{e.interactive = true})
        A.texture = textureCache[A.color][A.number]
        A.markedForUpdate = false
        A = null
    }
  } else {
    A = this
  } 
}

function dropBalls(number,color){
  let ballTexture = ballTextureCache[color]
  for (let i = 0;i<number+1;i++){
    let newBall = new PIXI.Sprite.from(BlankCard)
    newBall.texture = ballTexture
    newBall.x = DX/2 + setup.width*Math.random() - DX
    newBall.y = -DY/5
    newBall.width = DX/5
    newBall.height = DY/5
    TweenLite.to(newBall,1+0.5*Math.random(),{y: grass.y - newBall.width,ease: 'bounce'})
    app.stage.addChild(newBall)
    balls.push(newBall)
  }
  balls.sort(function(a,b){
    return (a.x - b.x)})
}



const animateCards = () => {
  cards.forEach((r,i)=>{
    r.forEach((c,j)=>{
      TweenLite.to(c,1,{x: GRID_X + i*DX*1.05,y: GRID_Y+j*DX*1.05,ease: "bounce"})
    })
  })
}

const condenseCards = cards => {
  let spotsToFill = 0;
  for (let i = 0; i < 5; i++) {
    spotsToFill = 0;
    // Iterate through each column
    for (let j = 4; j >= 0; j--) {
      if (cards[i][j].markedForUpdate == true) {
        spotsToFill++;
      } else if (spotsToFill > 0) {
        const currentSpot = cards[i][j];
        const newSpot = cards[i][j + spotsToFill];
        cards[i][j] = newSpot;
        cards[i][j + spotsToFill] = currentSpot;
      }
    }
  }
};

function restartAnimation(){
  dotTimeline.kill()
  grassTimeline.kill()
  homeButton.animationBegun = false

  dots.forEach(d=>{
    d.x = -d.width/2
    d.y = grass.y - d.height/2
  })
  grass2.x = GAP_END
}


function pauseDots(){

if (homeButton.animationBegun == true){
    if (this.paused == true){
      this.paused = false
      dotTimeline.play()
      grassTimeline.play()
    } else {
      this.paused = true
      dotTimeline.pause()
      grassTimeline.pause()
    }
  }
}

function actionClicked(){

  if (this.animationBegun == true){
    this.texture = PLAY_TEXTURE
    this.animationBegun = false
    restartAnimation()
  } else {
    this.animationBegun = true
    this.texture = RESET_TEXTURE
    animateDots()
  }
}


function animateDots(){


const onComplete = ()=>{
  homeButton.alpha = 1
}

dotTimeline = new TimelineLite({paused: true,onComplete: onComplete})
grassTimeline = new TimelineLite({paused: true})
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
}

/*

function animateDots(){


  const onUpdate = (v) => {
    console.log(v)
  }

  dots.forEach((d,i)=>{
    let offset = i == 0 ? 0 : "-=0.8"
    let t = new TimelineLite()
    let l = dots.length
    let dot = dots[l-i-1]
    t.to(dot,{duration: 1,x: setup.width/2.2,ease: "linear"})
    t.to(dot,{duration: 1,x: setup.width,ease: "linear"})
    t.to(dot,{duration: 0.5,y: grass.y + grass.height-dot.height,ease: "bounce"},"-=1")
    T.add(t,offset)
  })

  T.play()
  
}

*/


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

  playAgainButton = new PIXI.Sprite.from(Reset)
  playAgainButton.width = DX
  playAgainButton.height = DX
  playAgainButton.x = DX/4
  playAgainButton.y = DX/4
  playAgainButton.interactive = true 
  playAgainButton.on('pointerdown',reloadGame)
  //app.stage.addChild(playAgainButton)


  homeButton = new PIXI.Sprite.from(PlayButton)
  homeButton.width = DX
  homeButton.height = DX
  homeButton.x = DX/4
  homeButton.y = DX/4
  homeButton.animationBegun = false
  homeButton.interactive = true
  homeButton.on('pointerdown',actionClicked)

  app.stage.addChild(homeButton)
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
}

  init();
};
