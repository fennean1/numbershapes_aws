// Problem que setup
import * as PIXI from "pixi.js";

import {NUMBERS} from "../AssetManager.js"


export class Button extends PIXI.Sprite {
  constructor(value){
    super()
    this.clickCallback = ()=>{}   
    this.value = value
    this.on('pointerdown',this.onClick)
  }
  onClick(){
    this.clickCallbackl(this.value)
  }
}

export const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const shuffle = arr => {
  let n = arr.length - 1
  for (let i = 0;i < arr.length;i++) {
    let rand = getRandomInt(n)
    let randomElement = arr.splice(rand,1)
    arr.push(...randomElement)
    n -= 1
  }
  return arr
}


export class Keypad extends PIXI.Container {
  constructor(height){
    super()
    this.doSomething = ()=>{}
    this.keys = []
    this._height = height
  }

  load(){
    for (let i = 0;i<=10;i++){
      let key = new Button.from(NUMBERS[i])
      key.on('pointerdown',()=>this.hello(key.value))
      key.value = i
      key.height = this._height 
      key.width = this._height
      this.keys.push(key)
      this.addChild(key)
    }
  }


   hello(val){
     console.log("Hello")
     this.doSomething(val)
   }
  

  draw(val){
   for (let i = 0;i<=10;i++){
    let button = this.keys[i]
     if (i<=val){
      button.x = i*this._height
      button.interactive = true
     } else {
      button.alpha = 0
      button.interactive = false
     }
   }
  }
}