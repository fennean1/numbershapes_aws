import * as PIXI from "pixi.js";
import {TweenMax,TweenLite,TimelineLite} from "gsap";
import Clouds from "../assets/Clouds.png";
import Mountains from "../assets/Mountains.png";
import Grass from "../assets/Grass.png";
import BlankCard from "../assets/BlankCard.png";
import {BLUE,RED,GREEN,ORANGE,PURPLE,PINK,NUMERAL,BALLS,BUTTONS} from "../AssetManager.js"
import {shuffle} from "./api.js"
import { Tween } from "gsap/gsap-core";


export const init = (app, setup) => {

// Constants
const CARD_SPACING_PERCENTAGE = 0.05
const GRID_WIDTH = Math.min(setup.height,setup.width)*0.8
const GRID_HEIGHT = GRID_WIDTH
const CARD_WIDTH = GRID_WIDTH/5
const CARD_HEIGHT = CARD_WIDTH
const DX = GRID_WIDTH/(5*(1+CARD_SPACING_PERCENTAGE)) 
const DY = DX
const GRID_X = setup.width/2 - GRID_WIDTH/2 + CARD_WIDTH/2
const GRID_Y = setup.height/2 - GRID_HEIGHT/2
const GRASS_HEIGHT = setup.height/10
const GRASS_WIDTH = setup.width
const GRASS_Y = setup.height - GRASS_HEIGHT


let backGround;
let grass;
let playAgainButton;
let homeButton;

let cardPool;

let features;

let cards = []
let balls = []
let cardBank;
let textureCache;
let ballTextureCache;
let A = null
let B = null


class CardPool {
  constructor(type){
    this.keys = this.getCardBankKeysFromType(type)
    this.makeTextures()
    this.numberofDefaults = 0
    
    this.defaultTexture = new PIXI.Texture.from(BlankCard)
    this.defaultTexture.value = 0
    this.defaultTexture.color = 0
    this.defaultTexture.number = 0
    this.defaultTexture.isDefault = true
    this.defaultTexture.markedForUpdate = false
    //this.textures.push(this.defaultTexture)
    
    // Save these textures
    this.textureCache = [...this.textures]
  }

  reload(){
    this.textures = [...this.textureCache]
    this.numberofDefaults = 0
    console.log('this.textures.length',this.textures.length)
  }

  getCardBankKeysFromType(type){
    let keys = []
    switch(type){
      case "ADVANCED_MATCHING":
        for (let c = 0;c<6;c++){
          for (let n = 6;n<10;n++){
            keys.push({color: c,number: n})
          }
        }
        keys = [...keys,...keys]
      break;
      case "MEDIUM_MATCHING":
        for (let c = 0;c<6;c++){
          for (let n = 3;n<7;n++){
            keys.push({color: c,number: n})
          }
        }
        keys = [...keys,...keys]
      break;
      case "BASIC_MATCHING":
        for (let c = 0;c<6;c++){
          for (let n = 1;n<5;n++){
            keys.push({color: c,number: n})
          }
        }
        keys = [...keys,...keys]
      break;
      default:
    }
    return keys
  }

  makeTextures(){
    let shuffledKeys = shuffle(this.keys)
    this.textures = shuffledKeys.map(k=>{
      let card = cardBank[k.color][k.number]
      let newTexture = textureCache[k.color][k.number]
      newTexture.value = card.value
      newTexture.color = k.color 
      newTexture.number = k.number
      return newTexture
    })
  }

  get() {
    if (this.textures.length != 0){
      let t = this.textures.shift()
      return t
    } else {
      this.numberofDefaults += 1
      return this.defaultTexture
    }
  }
}

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
  // Reset cards.
  cardsForEach(c=> {
    c.markedForUpdate = true
    c.x = -DX 
    c.y = -DY
    c.alpha = 1
})
  balls.forEach(b=>{
    app.stage.removeChild(b)
    b.destroy()
  })
  balls = []
  cardPool.reload()
  synchCards()
  animateCards()
  TweenLite.to(this,{duration: 1,y: -2*DY})
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



function init(){

  // Background
  backGround = new PIXI.Sprite.from(Mountains);
  backGround.width = setup.width;
  backGround.height = setup.height;
  app.stage.addChild(backGround);

  grass = new PIXI.Sprite.from(Grass);
  grass.width = GRASS_WIDTH
  grass.height = GRASS_HEIGHT
  grass.y = GRASS_Y
  //app.stage.addChild(grass);

  playAgainButton = new PIXI.Sprite.from(BUTTONS.PLAY_AGAIN)
  playAgainButton.width = 4*DX
  playAgainButton.height = DX
  playAgainButton.x = setup.width/2 - playAgainButton.width/2
  playAgainButton.y = - 2*DX
  playAgainButton.interactive = true 
  playAgainButton.on('pointerdown',reloadGame)
  app.stage.addChild(playAgainButton)


  homeButton = new PIXI.Sprite.from(BUTTONS.HOME)
  homeButton.width = DX
  homeButton.height = DX
  homeButton.x = DX/4
  homeButton.y = DX/4
  homeButton.interactive = true
  homeButton.on('pointerdown',()=>app.goHome())
  app.stage.addChild(homeButton)


  // Load Features
  if (setup.props.features){
    features = setup.props.features
  }

    
  cardBank = [BLUE,RED,PINK,PURPLE,GREEN,ORANGE,NUMERAL]

  ballTextureCache = BALLS.map(b=>{return new PIXI.Texture.from(b)} )
  
  textureCache = cardBank.map(r=>{
    let row = r.map(c=>{
      return new PIXI.Texture.from(c.img)
    })
    return row
  })

  cardPool = new CardPool(features.type)

  for (let i = 0;i<5;i++){
    let newRow = []
    for (let j=0;j<5;j++){
      let cardAsset = cardPool.get()
      let newCard =  new PIXI.Sprite()
      newCard.texture = cardAsset
      newCard.isDefault = cardAsset.isDefault
      newCard.anchor.set(0.5)
      newCard.value = cardAsset.value
      newCard.width = DX 
      newCard.height = DY
      newCard.color = cardAsset.color
      newCard.number = cardAsset.number
      if (newCard.isDefault){
        newCard.interactive = false
        cardPool.numberofDefaults += 1
      } else {
        newCard.interactive = true
      }
      newCard.on('pointerdown',cardClicked)
      app.stage.addChild(newCard)
      newRow.push(newCard)
    }
    cards.push(newRow)
  }
  animateCards()
}

  init();
};
