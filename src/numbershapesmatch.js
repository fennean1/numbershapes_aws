import * as PIXI from "pixi.js";
import {TweenMax,TweenLite,TimelineLite} from "gsap";
import Clouds from "./assets/Clouds.png";
import {BLUE_OBJS,RED_OBJS,GREEN_OBJS,ORANGE_OBJS,PURPLE_OBJS,PINK_OBJS,NUMERAL_OBJS} from "./AssetManager.js"
import { blue } from "@material-ui/core/colors";

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
const GRID_Y = setup.height/2 - GRID_HEIGHT/2 + CARD_HEIGHT/2


let features;
let backGround;
let BLUES;
let REDS;
let PINKS;
let PURPLES;
let GREENS;
let ORANGES;
let NUMERALS

let ctr = 0

let cards = []
let cardBank;
let A = null
let B = null

const synchCards = () => {
  A = null 
  B = null
  cards.forEach((r,i)=>{
    r.forEach((c,j)=>{
      if (c.markedForUpdate){
        console.log("marked for update")
        let n = Math.round(Math.random()*5)
        let m = Math.round(Math.random()*9)
        let newAsset = cardBank[n][m]
        let newTexture = new PIXI.Texture.from(newAsset.img)
        c.texture.destroy()
        c.texture = newTexture
        c.value = newAsset.value
        c.n = n 
        c.m = m
      }
      c.width = DX 
      c.height = DY
      c.markedForUpdate = false
      c.rotation = 0
      c.interactive = true
    })
  })
}

function cardsForEach(callback){
  cards.forEach((r,i)=>{
    r.forEach((c,j)=>{
      callback(c,j,r,i)
    })
  })
}

function cardClicked(){
  let numeralTexture = new PIXI.Texture.from(NUMERALS[this.value].img)
  this.texture = numeralTexture
  // MEMORY LEAK!
  this.markedForUpdate = true 
 if (A) {
   cardsForEach(e=>e.interactive = false)
    if (this.value == A.value && A != this) {
          
    const onComplete = ()=>{
      A.y = -DY
      this.y = -DY
      condenseCards(cards)
      animateCards()
      synchCards()
    }

     TweenLite.to([A,this],0.4,{width: DX*1.15,height: DY*1.15,ease: "bounce",onComplete: onComplete})
    } else if (A != this) {
      const onComplete = ()=>{
        A.markedForUpdate = false 
        this.markedForUpdate = false
        A.texture = new PIXI.Texture.from(cardBank[A.n][A.m].img)
        this.texture = new PIXI.Texture.from(cardBank[this.n][this.m].img)
        synchCards()
      }
      let t = new TimelineLite()
      t.to([A,this],0.3,{rotation: Math.PI/6})
      t.to([A,this],0.3,{rotation: 0,ease: "bounce"})
      t.to([A,this],0.1,{rotation: 0,ease: "bounce",onComplete: onComplete})
    } else {
      cardsForEach(e=>e.interactive = true)
      A.texture = new PIXI.Texture.from(cardBank[A.n][A.m].img)
      A.markedForUpdate = false
      A = null
    }
  } else {
    A = this
  } 
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
  backGround = new PIXI.Sprite.from(Clouds);
  backGround.width = setup.width;
  backGround.height = setup.height;
  app.stage.addChild(backGround);


  // Load Features
  if (setup.features){
    features = setup.features
  }

 BLUES = BLUE_OBJS()
 REDS = RED_OBJS()
 PINKS = PINK_OBJS()
 PURPLES = PURPLE_OBJS()
 GREENS = GREEN_OBJS()
 ORANGES = ORANGE_OBJS()
 NUMERALS = NUMERAL_OBJS()
 
 cardBank = [BLUES,REDS,PINKS,PURPLES,GREENS,ORANGES]


  for (let i = 0;i<5;i++){
    let newRow = []
    for (let j=0;j<5;j++){
      let n = Math.round(Math.random()*5)
      let m = Math.round(Math.random()*9)
      let cardAsset = cardBank[n][m]
      let newCard =  new PIXI.Sprite.from(cardAsset.img)
      newCard.anchor.set(0.5)
      newCard.value = cardAsset.value
      newCard.width = DX 
      newCard.height = DY
      newCard.n = n 
      newCard.m = m
      newCard.interactive = true
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
