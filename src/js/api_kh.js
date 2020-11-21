import * as PIXI from "pixi.js-legacy";
import {
  TimelineLite,
  TweenLite,
} from "gsap";
import {Axis,Axis2D} from "./axisApi.js"
import * as CONST from "./const.js";
import { extend } from "jquery";




// CLASSES
// Helpers
export function digitCount(n) {
  var count = 1;

  if (n >= 1) {
    while (n / 10 >= 1) {
      n /= 10;
      ++count;
    }
    return count;
  } else {
    ++count;
    while (n % 1 != 0) {
      n *= 10;
      ++count;
    }
    return count - 1;
  }
}

export class PrimeChip extends PIXI.Container {
  constructor(state){
    super()

    this.state = state

    this.colors = {
      1: 0xD0D2D3,
      2: 0xE5A131,
      3: 0x9BC566,
      5: 0x87CAEE,
      7: 0x887CB6,
    }


    this.primeColor = 0xD3604F
    this.orbitals = []

    this.holePercentage = 0.50


    this.rainbowSprite = new PIXI.Sprite.from(CONST.ASSETS.RAINBOW)

    this.rainbowSprite.anchor.set(0.5)
    this.graphics = new PIXI.Graphics()
    this.descriptor = new PIXI.Text()
    this.descriptor.style.fontFamily = "Chalkboard SE"
    this.descriptor.style.fontSize = this.radius*this.holePercentage
    this.descriptor.anchor.set(0.5)

    const ONE = new PIXI.Texture.from(CONST.ASSETS.ONE)
    const TWO = new PIXI.Texture.from(CONST.ASSETS.TWO)
    const THREE = new PIXI.Texture.from(CONST.ASSETS.THREE)
    const FIVE = new PIXI.Texture.from(CONST.ASSETS.FIVE)
    const SEVEN = new PIXI.Texture.from(CONST.ASSETS.SEVEN)

    this.orbitalTextures = {
      1: ONE,
      2: TWO,
      3: THREE,
      5: FIVE,
      7: SEVEN,
    }

    this.addChild(this.graphics)
    this.addChild(this.descriptor)

    for (let i = 0;i<20;i++){
      let orb = new PIXI.Sprite()
      orb.anchor.set(0.5)
      this.orbitals.push(orb)
    }

    this.draw(this.state.value)


  }

  redraw(newFrame){
    this.state.radius = Math.min(newFrame.width,newFrame.height)/20

    this.draw(this.state.num)

  }

  
  draw(num){

    this.state.num = num
    let digits = digitCount(Math.abs(num))

    this.orbitals.forEach(o=>this.removeChild(o))

    this.primeFactorArray = getPrimeFactorization(num)
    let theta = (2*Math.PI)/this.primeFactorArray.length

    this.primeFactorArray.sort()


    let ro = this.state.radius 
    let ri = this.state.radius*this.holePercentage
    let d = Math.PI/2

    this.descriptor.style.fontSize = ri/Math.sqrt(digits)  
    this.descriptor.text = num

    this.graphics.clear()
    this.graphics.lineStyle(ri/15,0xffffff)


    if (this.primeFactorArray.length == 1){
      
      let pF = this.primeFactorArray[0]
      let color;


     if (this.orbitalTextures[pF]){
      let rm = (ri+ro)/2
      let point = {x: rm*Math.cos(-d),y: rm*Math.sin(-d)}
      let orb = this.orbitals[0]
      orb.texture = this.orbitalTextures[pF]
      orb.width = 0.8*(ro-ri)
      orb.height = 0.8*(ro-ri)
      orb.x = point.x 
      orb.y = point.y
      this.addChild(orb)
     } 

    if (this.colors[pF]){
        color = this.colors[pF]
      }  else {
        color = 0xD3604F
      }

      this.graphics.beginFill(color)



      if (this.state.blank){
        color = 0xffffff
        this.graphics.lineStyle(ri/15,0x000000)
        this.graphics.beginFill(color)
      } 

      if (this.state.num == 0 && !this.state.blank){
        this.addChild(this.rainbowSprite)
        this.rainbowSprite.width = 2*ro
        this.rainbowSprite.height = 2*ro
        this.addChild(this.graphics)
      } else {
        this.removeChild(this.rainbowSprite)
        this.graphics.drawCircle(0,0,ro)
      }

    } else {

      this.primeFactorArray.forEach((f,i)=> {

        let color;
  
        if (this.colors[f]){
          color = this.colors[f]
        } else {
          color = 0xD3604F
        }

        this.graphics.beginFill(color)


        if (this.state.blank){
          color = 0xffffff
          this.graphics.lineStyle(ri/15,0x000000)
          this.graphics.beginFill(color)
        } 
  

        let rm = (ri+ro)/2

        let point = {x: rm*Math.cos(theta*(i+0.5)-d),y: rm*Math.sin(theta*(i+0.5)-d)}
        let orb = this.orbitals[i]
        orb.width = 0.8*(ro-ri)
        orb.height = 0.8*(ro-ri)
        orb.x = point.x 
        orb.y = point.y
        // Check 

        if (this.orbitalTextures[f]) {
          orb.texture = this.orbitalTextures[f]
          this.addChild(orb)
        } else {
  
        }


        this.graphics.moveTo(ri*Math.cos(theta*i-d),ri*Math.sin(theta*i-d))
        this.graphics.lineTo(ro*Math.cos(theta*i-d),ro*Math.sin(theta*i-d))
        this.graphics.arc(0,0,ro,theta*i-d,theta*(i+1)-d)
        this.graphics.lineTo(ri*Math.cos(theta*(i+1)-d),ri*Math.sin(theta*(i+1)-d))
  
      })

    }

    this.graphics.beginFill(0xffffff)
    this.graphics.drawCircle(0,0,ri)
    this.graphics.endFill()
    this.graphics.drawCircle(0,0,ro)

  }
}

export function getPrimeFactorization(num) {
  num = Math.abs(num)
  function is_prime(num) {
    for (let i = 2; i <= Math.sqrt(num); i++)
    {
      if (num % i === 0) return false;
    }
    return true;
  }
  let result = [];
  for (let i = 2; i <= num; i++)
  {
    while (is_prime(i) && num % i === 0) 
    {
      result.push(i);
      num /= i;
    }
  }

  if (result.length == 0){
    result = [1]
  }

  return result;
}


function getNumbersNeeded(min, max, step) {
  let numbersNeeded = {};
  let start = Math.ceil(min / step) * step;
  let currentNumber = start;
  let digits = digitCount(step);

  while (currentNumber <= max && currentNumber >= start) {
    let cleanNumber = Math.round(currentNumber / step) * step;
    if (cleanNumber % 1 != 0) {
      cleanNumber = currentNumber.toFixed(digits - 1);
    }
    // Add this number to the list of numbers needed.
    numbersNeeded[cleanNumber] = true;
    currentNumber += step;
  }
  return numbersNeeded;
}



export class MultiplicationStrip extends PIXI.Container {
  constructor(app,numberline,state) {
    super();


    this.state = state

    this.TYPE = 's'
    // Access _height this through 'state' in the future.
    this._height = this.state.frame.height*this.state.heightRatio;
    this.numberline = numberline;
    this.denominator = this.state.denominator
    this.app = app
    
    this.stripTexture;
    this.openStripTexture;

    this.stripGraphic = new PIXI.Graphics();
    this.stripGraphic.lineStyle(3,this.state.strokeColor)
    this.stripGraphic.drawRoundedRect(0,0,20,20,1)
    this.addChild(this.stripGraphic)

    this.openStripGraphic = new PIXI.Graphics();
    this.openStripGraphic.lineStyle(3,0x000000)
    this.openStripGraphic.drawRoundedRect(0,0,20,20,1)

    this.draggerGraphics = new PIXI.Graphics();
    this.draggerGraphics.beginFill(0xffffff);
    this.draggerGraphics.drawRoundedRect(0, 0, 1, this._height, 0);
    this.draggerTexture = app.renderer.generateTexture(this.draggerGraphics);

    this.adjusterTexture = new PIXI.Texture.from(CONST.ASSETS.FRACTION_BAR_PIN)

    // Adjuster Sprite
    this.adjusterSprite= new Draggable()
    this.adjusterSprite.texture = this.adjusterTexture;
    this.adjusterSprite.anchor.set(0.5, 0);
    this.adjusterSprite.width = this._height
    this.adjusterSprite.rotation = Math.PI
    this.adjusterSprite.height = 1/0.72*this._height
    this.adjusterSprite.lockY = true
    this.adjusterSprite.y = -this.height/2


    this.adjusterSprite.on("pointerdown", this.onAdjustPointerDown);
    this.adjusterSprite.on("pointermove", this.onAdjustPointerMove);
    this.adjusterSprite.on("pointerup", this.onAdjustPointerUp);
    this.adjusterSprite.on("pointerupoutside", this.onAdjustPointerUp);
    this.addChild(this.adjusterSprite);

    this.draggerSpriteA = new Draggable();
    this.draggerSpriteA.lockY = true;
    this.draggerSpriteA.hitArea = new PIXI.Circle(
      0,
      0,
      this._height,
      this._height
    );
    this.draggerSpriteA.texture = this.draggerTexture;
    this.draggerSpriteA.anchor.set(0.5, 0);
    this.draggerSpriteA.width = 1;
    this.draggerSpriteA.alpha = 0;
    this.draggerSpriteA.height = this.state.height;
    this.addChild(this.draggerSpriteA);

    this.draggerSpriteB = new Draggable();
    this.draggerSpriteB.lockY = true;
    this.draggerSpriteB.texture = this.draggerTexture;
    this.draggerSpriteB.anchor.set(0.5, 0);
    this.draggerSpriteB.width = 1;
    this.draggerSpriteB.height = this._height;
    this.draggerSpriteB.alpha = 0;
    this.draggerSpriteB.hitArea = new PIXI.Circle(
      0,
      0,
      this._height,
      this._height
    );
    this.draggerSpriteB.on("pointerdown", this.onPointerDown);
    this.draggerSpriteB.on("pointermove", this.onPointerMove);
    this.draggerSpriteB.on("pointerup", this.onPointerUp);
    this.draggerSpriteB.on("pointerupoutside", this.onPointerUp);
    this.addChild(this.draggerSpriteB);

    this.state.blockWidth = this.numberline.getDistanceFromZeroFromValue(this.state.blockValue)
    this.draggerSpriteA.x = this.numberline.getNumberLinePositionFromFloatValue(this.state.minValue) - this.x;
    this.draggerSpriteB.x = this.draggerSpriteA.x + this.state.blockWidth*this.state.numberOfBlocks
    this.adjusterSprite.x = this.draggerSpriteA.x + this.state.blockWidth 


    this.interactive = true;
    this.on("pointerdown", this.pointerDown);
    this.on("pointermove", this.pointerMove);
    this.on("pointerup", this.pointerUp);
    this.on("pointerupoutside", this.pointerUp);

    this.draw()

  }

  redraw(newFrame){
    this._height = newFrame.height
    this.synch()
  }


  synch() {
    this.min = this.numberline.getNumberLinePositionFromFloatValue(
      this.minValue
    );
    this.max = this.numberline.getNumberLinePositionFromFloatValue(
      this.maxValue
    );

    this.minDragger.x = this.min - this.x
    this.maxDragger.x = this.max - this.x

    this.state.blockWidth = (this.draggerSpriteB.x - this.draggerSpriteA.x)/this.state.numberOfBlocks


    this.draw();
    this.adjusterSprite.x = this.draggerSpriteA.x + this.state.blockWidth

  }

  updateLayoutParams() {
    let draggers = [this.draggerSpriteA, this.draggerSpriteB];

    draggers.sort((a, b) => (a.x > b.x ? 1 : -1));

    this.minDragger = draggers.shift();
    this.maxDragger = draggers.pop();

    this.max = this.maxDragger.getGlobalPosition().x;
    this.min = this.minDragger.getGlobalPosition().x;

    this.minValue = this.numberline.getNumberLineFloatValueFromPosition(
      this.min
    );
    this.maxValue = this.numberline.getNumberLineFloatValueFromPosition(
      this.max
    );

   if (this.minDragger == this.draggerSpriteB){
     this.draggerSpriteB.maxX = this.adjusterSprite.x
     this.draggerSpriteB.minX = null
   } else {
    this.draggerSpriteB.maxX = null
    this.draggerSpriteB.minX = this.adjusterSprite.x
   }
  

   this._height = this.state.frame.height*this.state.heightRatio

  }


  draw(newFrame){
  
    if (newFrame){
      this.state.frame = newFrame
    }

    this.updateLayoutParams()

    let w = this.max - this.min;

    
    const bW = this.state.blockWidth

    const stroke = this._height/10
    const corner = Math.abs(Math.min(w, this._height))
    this.stripGraphic.clear()
    this.stripGraphic.x = this.draggerSpriteA.x
    this.stripGraphic.beginFill(this.state.fillColor);
    this.stripGraphic.lineStyle(this._height/15,this.state.strokeColor)

    const fractionBlock = this.state.numberOfBlocks%1
    const remainderWidth = fractionBlock*bW
    const roundedNumberOfBlocks = Math.floor(this.state.numberOfBlocks)


    if (this.minDragger == this.draggerSpriteB){
      for (let i = 1;i<=roundedNumberOfBlocks+1;i++){
        if (i==roundedNumberOfBlocks+1 && this.draggerSpriteB.touching){
          this.stripGraphic.drawRoundedRect(-Math.abs(bW)*this.state.numberOfBlocks, -this._height/2, Math.abs(remainderWidth), this._height, Math.abs(Math.min(this._height, Math.abs(remainderWidth)))/5);
        } else if (i<roundedNumberOfBlocks+1) {
          this.stripGraphic.drawRoundedRect(Math.abs(bW)*(-i), -this._height/2, Math.abs(bW), this._height, corner/5);
        }
      }
    } else  {
      for (let i = 0;i<=roundedNumberOfBlocks;i++){
        if (i==roundedNumberOfBlocks && this.draggerSpriteB.touching){
          this.stripGraphic.drawRoundedRect(bW*(i), -this._height/2, remainderWidth, this._height, Math.min(this._height,remainderWidth)/5);
        } else if (i<roundedNumberOfBlocks) {
          this.stripGraphic.drawRoundedRect(bW*(i), -this._height/2, bW, this._height, corner/5);
        }
      }
    }


  }

  onStripPointerDown(){
   
  }
 
  onStripPointerMove(){

 }
 
 onStripPointerUp(){
  if (this.parent.dragged == false){
   if (this.texture == this.parent.openStripTexture){
     this.texture = this.parent.stripTexture
   } else {
    this.texture = this.parent.openStripTexture
   }
  }
 }

onAdjustPointerDown(){

}

  onAdjustPointerMove(){
    if (this.touching) {
      this.parent.state.blockWidth =  this.x - this.parent.draggerSpriteA.x
      this.parent.state.blockValue = this.parent.numberline.getValueForWidth(this.parent.state.blockWidth)
      this.parent.draggerSpriteB.x = this.parent.draggerSpriteA.x + this.parent.state.blockWidth*this.parent.state.numberOfBlocks
    
      this.parent.draw();

      this.parent.touching = false;
      this.parent.onUpdate && this.parent.onUpdate();
    }
  }
  
  onAdjustPointerUp(){
    this.parent.draw();
    this.touching = false;
    // this.x = this.parent.draggerSpriteA.x + this.parent.blockWidth 
  }

  onPointerDown() {
    this.touching = true;
  }

  onPointerMove() {
    if (this.touching) {
      this.parent.state.numberOfBlocks = Math.abs((this.parent.draggerSpriteA.x - this.x)/this.parent.state.blockWidth)
      this.parent.draw();
      this.parent.touching = false;
      this.parent.onUpdate && this.parent.onUpdate();
    }
  }

  onPointerUp() {
    this.touching = false;
    this.parent.state.numberOfBlocks = Math.round(Math.abs((this.parent.draggerSpriteA.x - this.x)/this.parent.state.blockWidth))
    this.parent.draggerSpriteB.x = this.parent.draggerSpriteA.x+this.parent.state.numberOfBlocks*this.parent.state.blockWidth
    this.parent.draw()
    this.parent.onUpdate && this.parent.onUpdate();
  }

  pointerDown(event) {
    this.touching = true;
    this.dragged = false;
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y,
    };
  }

  pointerMove(event) {
    if (this.touching) {

      if (!this.lockX) {
        this.x = event.data.global.x + this.deltaTouch.x;

        let xMaxOut = this.maxX && this.x > this.maxX;
        let xMinOut = this.minX && this.x < this.minX;

        if (xMaxOut) {
          this.x = this.maxX;
        } else if (xMinOut) {
          this.x = this.minX;
        }
      }

      if (!this.lockY) {
        this.y = event.data.global.y + this.deltaTouch.y;

        let yMaxOut = this.maxY && this.y > this.yMax;
        let yMinOut = this.minY && this.y < this.yMin;

        if (yMaxOut) {
          this.y = this.yMax;
        } else if (yMinOut) {
          this.y = this.yMin;
        }
      }
      this.updateLayoutParams();
      this.onUpdate && this.onUpdate();
      this.dragged = true;
    }
  }

  pointerUp(event) {
    if (this.dragged) {
      const range = this.max - this.min;
      this.min = this.numberline.roundPositionToNearestTick(this.min);
      this.max = this.min + range;
      this.synch()
      this.draw();
    }
    this.touching = false;
    this.dragged = false
    this.onUpdate && this.onUpdate();
  }

  pointerUpOutside(event) {
    this.touching = false;
  }
  
  
}

export class FractionStrip extends PIXI.Container {
  constructor(app,numberline,state) {
    super();


    this.HEIGHT_RATIO = 1/20
    this.TYPE = 's'
    this.state = state

    // Access _height this through 'state' in the future.
    this._height = this.state.frame.height*this.HEIGHT_RATIO
    this.numberline = numberline;
    this.color = this.state.fillColor
    this.denominator = this.state.denominator
    this.app = app
    
    this.stripTexture;
    this.openStripTexture;

    this.stripGraphic = new PIXI.Graphics();
    this.stripGraphic.lineStyle(3,0x000000)
    this.stripGraphic.drawRoundedRect(0,0,20,20,1)
    this.addChild(this.stripGraphic)

    this.openStripGraphic = new PIXI.Graphics();
    this.openStripGraphic.lineStyle(3,0x000000)
    this.openStripGraphic.drawRoundedRect(0,0,20,20,1)


    this.draggerGraphics = new PIXI.Graphics();
    this.draggerGraphics.beginFill(0xffffff);
    this.draggerGraphics.drawRoundedRect(0, 0, 1, this._height, 0);
    this.draggerTexture = app.renderer.generateTexture(this.draggerGraphics);


    this.adjusterGraphics = new PIXI.Graphics();
    this.adjusterGraphics.beginFill(0xffffff);
    this.adjusterGraphics.drawCircle(0, 0, this._height);
    this.adjusterTexture = app.renderer.generateTexture(this.adjusterGraphics);
    this.adjusterTexture = new PIXI.Texture.from(CONST.ASSETS.FRACTION_BAR_PIN)

    // Adjuster Sprite
    this.adjusterSprite= new Draggable()
    this.adjusterSprite.texture = this.adjusterTexture;
    this.adjusterSprite.anchor.set(0.5, 0);
    this.adjusterSprite.width = this._height
    this.adjusterSprite.rotation = Math.PI
    this.adjusterSprite.height = 1/0.72*this._height
    this.adjusterSprite.lockY = true
    this.adjusterSprite.y = -this.height/2


    this.adjusterSprite.on("pointerdown", this.onAdjustPointerDown);
    this.adjusterSprite.on("pointermove", this.onAdjustPointerMove);
    this.adjusterSprite.on("pointerup", this.onAdjustPointerUp);
    this.adjusterSprite.on("pointerupoutside", this.onAdjustPointerUp);
    this.addChild(this.adjusterSprite);


    this.draggerSpriteA = new Draggable();
    this.draggerSpriteA.lockY = true;
    this.draggerSpriteA.hitArea = new PIXI.Circle(
      0,
      0,
      this._height,
      this._height
    );
    this.draggerSpriteA.texture = this.draggerTexture;
    this.draggerSpriteA.anchor.set(0.5, 0);
    this.draggerSpriteA.width = 1;
    this.draggerSpriteA.alpha = 0;
    this.draggerSpriteA.x = this.numberline.getNumberLinePositionFromFloatValue(
      numberline.minorStep * 10
    );
    this.draggerSpriteA.height = this._height;
    this.draggerSpriteA.on("pointerdown", this.onPointerDown);
    this.draggerSpriteA.on("pointermove", this.onPointerMove);
    this.draggerSpriteA.on("pointerup", this.onPointerUp);
    this.draggerSpriteA.on("pointerupoutside", this.onPointerUp);
    this.addChild(this.draggerSpriteA);


    this.draggerSpriteB = new Draggable();
    this.draggerSpriteB.lockY = true;
    this.draggerSpriteB.texture = this.draggerTexture;
    this.draggerSpriteB.anchor.set(0.5, 0);
    this.draggerSpriteB.width = 1;
    this.draggerSpriteB.height = this._height;
    this.draggerSpriteB.alpha = 0;
    this.draggerSpriteB.x = this.numberline.getNumberLinePositionFromFloatValue(
      0
    );
    this.draggerSpriteB.hitArea = new PIXI.Circle(
      0,
      0,
      this._height,
      this._height
    );
    this.draggerSpriteB.on("pointerdown", this.onPointerDown);
    this.draggerSpriteB.on("pointermove", this.onPointerMove);
    this.draggerSpriteB.on("pointerup", this.onPointerUp);
    this.draggerSpriteB.on("pointerupoutside", this.onPointerUp);
    this.addChild(this.draggerSpriteB);

    this.draggerSpriteA.x = this.numberline.getNumberLinePositionFromFloatValue(this.state.xMin) - this.x;
    this.draggerSpriteB.x = this.numberline.getNumberLinePositionFromFloatValue(this.state.xMax); - this.x;


    this.draw()

    this.adjusterSprite.x = this.minDragger.x + this.blockWidth 

    this.interactive = true;
    this.on("pointerdown", this.pointerDown);
    this.on("pointermove", this.pointerMove);
    this.on("pointerup", this.pointerUp);
    this.on("pointerupoutside", this.pointerUp);

    this.addChild(this.stripGraphic)

  }

  redraw(newFrame){
    this._height = newFrame.height/20
    this.synch()
  }

  synch() {
    this.min = this.numberline.getNumberLinePositionFromFloatValue(
      this.minValue
    );
    this.max = this.numberline.getNumberLinePositionFromFloatValue(
      this.maxValue
    );

    this.minDragger.x = this.min - this.x
    this.maxDragger.x = this.max - this.x
    this.draw();
    this.adjusterSprite.x = this.minDragger.x + this.blockWidth

  }

  updateLayoutParams() {
    let draggers = [this.draggerSpriteA, this.draggerSpriteB];

    draggers.sort((a, b) => (a.x > b.x ? 1 : -1));

    this.minDragger = draggers.shift();
    this.maxDragger = draggers.pop();

    this.max = this.maxDragger.getGlobalPosition().x;
    this.min = this.minDragger.getGlobalPosition().x;

    this.minValue = this.numberline.getNumberLineFloatValueFromPosition(
      this.min
    );
    this.maxValue = this.numberline.getNumberLineFloatValueFromPosition(
      this.max
    );

   let w = this.max - this.min
   this.blockWidth = w/this.denominator
   this.adjusterSprite.minX = this.minDragger.x + w/12
   this.adjusterSprite.maxX = this.minDragger.x + w


  }


  draw(){
  

    this.updateLayoutParams()

    let x = this.min - this.x;

    const stroke = this._height/20
 
    const remainder = this.denominator%1 
    const remainderWidth = remainder*this.blockWidth
    const roundedDenominator = Math.floor(this.denominator)

    this.stripGraphic.clear()
    this.stripGraphic.x = x


    this.state.numerators.forEach((b,i)=>{
    this.stripGraphic.lineStyle(stroke,0x000000,1,0)  
    this.stripGraphic.beginFill(this.color);


      if (b == 0){
        this.stripGraphic._fillStyle.alpha = 0.01
      }



      if (i < roundedDenominator) {
        this.stripGraphic.drawRoundedRect(this.blockWidth*i, -this._height/2, this.blockWidth, this._height, 1);
      } else if (i == roundedDenominator && remainderWidth != 0) {
         this.stripGraphic.drawRoundedRect(this.blockWidth*(i), -this._height/2, remainderWidth, this._height, 1);
      }
    })

  }

onAdjustPointerDown(){

}

  onAdjustPointerMove(){

     let w = this.parent.max - this.parent.min
     let x = this.parent.min - this.parent.x;


    if (this.touching) {
      this.parent.dragged = true
     const blockWidth = Math.abs(this.x-x)
     this.parent.denominator = w/blockWidth 
      this.parent.draw();
      this.parent.touching = false;
      this.parent.onUpdate && this.parent.onUpdate();
    }
  }
  
  onAdjustPointerUp(){
    this.parent.denominator = Math.round(this.parent.denominator)
    this.parent.draw();
    this.touching = false;
    this.x = this.parent.minDragger.x + this.parent.blockWidth 
  }

  onPointerDown() {
    this.touching = true;
  }

  onPointerMove() {
    if (this.touching) {
      this.parent.draw();
      this.parent.touching = false;
      this.parent.dragged = true
      this.parent.onUpdate && this.parent.onUpdate();
      this.parent.adjusterSprite.x = this.parent.minDragger.x + this.parent.blockWidth
    }
  }

  onPointerUp() {
    this.touching = false;
    /*
    if (this == this.parent.minDragger) {
      this.x = this.parent.min - this.parent.x
      this.parent.draw();
    } else {
      this.x = this.parent.max - this.parent.x
      this.parent.draw();
    }
    */
    this.parent.onUpdate && this.parent.onUpdate();
  }

  pointerDown(event) {
    this.touching = true;
    this.dragged = false;
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y,
    };
  }

  pointerMove(event) {
    if (this.touching) {

      if (!this.lockX) {
        this.x = event.data.global.x + this.deltaTouch.x;

        let xMaxOut = this.maxX && this.x > this.maxX;
        let xMinOut = this.minX && this.x < this.minX;

        if (xMaxOut) {
          this.x = this.maxX;
        } else if (xMinOut) {
          this.x = this.minX;
        }
      }

      if (!this.lockY) {
        this.y = event.data.global.y + this.deltaTouch.y;

        let yMaxOut = this.maxY && this.y > this.yMax;
        let yMinOut = this.minY && this.y < this.yMin;

        if (yMaxOut) {
          this.y = this.yMax;
        } else if (yMinOut) {
          this.y = this.yMin;
        }
      }
      this.updateLayoutParams();
      this.onUpdate && this.onUpdate();
      this.dragged = true;
    }
  }

  pointerUp(event) {
    if (this.dragged) {
      const range = this.max - this.min;
      this.min = this.numberline.roundPositionToNearestTick(this.min);
      this.max = this.min + range;
      this.draw();
    } else {


      let x = event.data.getLocalPosition(this).x;

      let n = Math.abs((this.minDragger.x - x)/(this.draggerSpriteA.x - this.draggerSpriteB.x)*this.denominator)
      
      n = Math.floor(n)


      if (this.state.numerators[n] == 1){
        this.state.numerators[n] = 0
      } else {
        this.state.numerators[n] = 1
      }
  
    }

    this.touching = false;
    this.dragged = false
    this.synch()
    this.onUpdate && this.onUpdate();
  }

  pointerUpOutside(event) {
    this.touching = false;
  }
  
}

export class AdjustableStrip extends PIXI.Container {
  constructor(app, numberline,state) {
    super();


    this.state = state
    this.minValue = state.minValue
    this.maxValue = state.maxValue


    this.TYPES = {
      ARROW: 0,
      SHUTTLE: 1,
    }

    this.TYPE = this.TYPES.ARROW

    this._height = this.state.height;
    this.numberline = numberline;
    this.color = 0x1c77ff;
    this.negativeColor = 0xff2655
    this.positiveColor = 0x00a123
    this.stripGraphic = new PIXI.Graphics();
    this.stripGraphic.interactive = true;
    this.addChild(this.stripGraphic);

    this.draggerGraphics = new PIXI.Graphics();
    this.draggerGraphics.beginFill(0xffffff);
    this.draggerGraphics.drawRoundedRect(0, 0, 1, this._height, 0);
    this.draggerTexture = app.renderer.generateTexture(this.draggerGraphics);

    this.draggerSpriteA = new Draggable();
    this.draggerSpriteA.lockY = true;
    this.draggerSpriteA.hitArea = new PIXI.Circle(
      0,
      0,
      this._height,
      this._height
    );
    this.draggerSpriteA.texture = this.draggerTexture;
    this.draggerSpriteA.anchor.set(0.5, 0);
    this.draggerSpriteA.width = 1;
    this.draggerSpriteA.alpha = 0;
    this.draggerSpriteA.x = this.numberline.getNumberLinePositionFromFloatValue(
      this.minValue
    );
    this.draggerSpriteA.height = this._height;
    this.draggerSpriteA.on("pointerdown", this.onPointerDown);
    this.draggerSpriteA.on("pointermove", this.onPointerMove);
    this.draggerSpriteA.on("pointerup", this.onPointerUp);
    this.draggerSpriteA.on("pointerupoutside", this.onPointerUp);
    this.addChild(this.draggerSpriteA);

    this.draggerSpriteB = new Draggable();
    this.draggerSpriteB.lockY = true;
    this.draggerSpriteB.texture = this.draggerTexture;
    this.draggerSpriteB.anchor.set(0.5, 0);
    this.draggerSpriteB.width = 1;
    this.draggerSpriteB.height = this._height;
    this.draggerSpriteB.alpha = 0;
    this.draggerSpriteB.x = this.numberline.getNumberLinePositionFromFloatValue(
      this.maxValue
    );
    this.draggerSpriteB.hitArea = new PIXI.Circle(
      0,
      0,
      this._height,
      this._height
    );
    this.draggerSpriteB.on("pointerdown", this.onPointerDown);
    this.draggerSpriteB.on("pointermove", this.onPointerMove);
    this.draggerSpriteB.on("pointerup", this.onPointerUp);
    this.draggerSpriteB.on("pointerupoutside", this.onPointerUp);
    this.addChild(this.draggerSpriteB);

    this.max = this.numberline.getNumberLinePositionFromFloatValue(this.maxValue);
    this.min = this.numberline.getNumberLinePositionFromFloatValue(this.minValue)

    this.updateLayoutParams();
    this.drawBetween();

    this.interactive = true;
    this.on("pointerdown", this.pointerDown);
    this.on("pointermove", this.pointerMove);
    this.on("pointerup", this.pointerUp);
    this.on("pointerupoutside", this.pointerUp);
  }

  redraw(newFrame){
    this._height = newFrame.height/20
    this.synch()
  }

  synch() {
    this.min = this.numberline.getNumberLinePositionFromFloatValue(
      this.minValue
    );
    this.max = this.numberline.getNumberLinePositionFromFloatValue(
      this.maxValue
    );

    this.drawBetween();
  }

  drawBetween() {
    let draggers = [this.draggerSpriteA, this.draggerSpriteB];

    draggers.sort((a, b) => (a.x > b.x ? 1 : -1));

    let minDragger = draggers.shift();
    let maxDragger = draggers.pop();

    // Re write to use global coordinates.
    minDragger.x = this.min - this.x;
    maxDragger.x = this.max - this.x;
    this.drawStrip();
  }

  updateLayoutParams() {
    let draggers = [this.draggerSpriteA, this.draggerSpriteB];

    draggers.sort((a, b) => (a.x > b.x ? 1 : -1));

    this.minDragger = draggers.shift();
    this.maxDragger = draggers.pop();

    this.max = this.maxDragger.getGlobalPosition().x;
    this.min = this.minDragger.getGlobalPosition().x;

    this.minValue = this.numberline.getNumberLineFloatValueFromPosition(
      this.min
    );
    this.maxValue = this.numberline.getNumberLineFloatValueFromPosition(
      this.max
    );
  }



  drawStrip() {
  
    let x = this.min - this.x;
    let w = this.max - this.min;

    const stroke = this._height/20
    const t = stroke*10
    this.stripGraphic.clear()

    if (this.draggerSpriteA.x > this.draggerSpriteB.x) {

      this.stripGraphic.lineStyle(3*stroke,this.negativeColor)
      this.stripGraphic.moveTo(x+t,0)
      this.stripGraphic.lineTo(x+w,0)
      this.stripGraphic.endFill()
      this.stripGraphic.beginFill(this.negativeColor)
      this.stripGraphic.lineStyle(0,this.negativeColor)
      this.stripGraphic.moveTo(x,0)
      this.stripGraphic.lineTo(x+t,t)
      this.stripGraphic.lineTo(x+t,-t)
      this.stripGraphic.lineTo(x,0)
      this.stripGraphic.endFill()
    } else {
      this.stripGraphic.lineStyle(3*stroke,this.positiveColor)
      this.stripGraphic.moveTo(x,0)
      this.stripGraphic.lineTo(x+w-t,0)
      this.stripGraphic.endFill()
      this.stripGraphic.beginFill(this.positiveColor)
      this.stripGraphic.lineStyle(0,this.positiveColor)
      this.stripGraphic.moveTo(x+w,0)
      this.stripGraphic.lineTo(x+w-t,t)
      this.stripGraphic.lineTo(x+w-t,-t)
      this.stripGraphic.lineTo(x+w,0)
      this.stripGraphic.endFill()
    }


    if (this.TYPE == this.TYPES.SHUTTLE) {
      this.stripGraphic.clear()
      this.stripGraphic.beginFill(this.color);

      const corner = Math.min(w, this._height);
      this.stripGraphic.lineStyle(stroke,0xffffff,1,0)
      this.stripGraphic._fillStyle.alpha = 1
      this.stripGraphic.drawRoundedRect(x, -this._height/2, w, this._height, corner / 5);
  
    } else {
      this.stripGraphic.beginFill(this.color);
      const corner = Math.min(w, this._height);
      this.stripGraphic.lineStyle(0,this.color)
      this.stripGraphic._fillStyle.alpha = 0.005
      this.stripGraphic.drawRoundedRect(x, -this._height/2, w, this._height, corner / 5);
  
    }
  }

  onPointerDown() {
    this.touching = true;
  }

  onPointerMove() {
    if (this.touching) {
      this.parent.updateLayoutParams();
      this.parent.drawStrip();
      this.parent.touching = false;
      this.parent.onUpdate && this.parent.onUpdate();
    }
  }

  onPointerUp() {
    this.touching = false;
    this.parent.onUpdate && this.parent.onUpdate();
  }

  pointerDown(event) {
    this.touching = true;
    this.dragged = false;
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y,
    };
  }

  pointerMove(event) {
    if (this.touching) {
      if (!this.lockX) {
        this.x = event.data.global.x + this.deltaTouch.x;

        let xMaxOut = this.maxX && this.x > this.maxX;
        let xMinOut = this.minX && this.x < this.minX;

        if (xMaxOut) {
          this.x = this.maxX;
        } else if (xMinOut) {
          this.x = this.minX;
        }
      }

      if (!this.lockY) {
        this.y = event.data.global.y + this.deltaTouch.y;

        let yMaxOut = this.maxY && this.y > this.yMax;
        let yMinOut = this.minY && this.y < this.yMin;

        if (yMaxOut) {
          this.y = this.yMax;
        } else if (yMinOut) {
          this.y = this.yMin;
        }
      }
      this.updateLayoutParams();
      this.onUpdate && this.onUpdate();
      this.dragged = true;
    }
  }

  pointerUp(event) {
    if (this.dragged) {
      this.drawBetween();
    }
    this.updateLayoutParams();
    this.touching = false;
    this.onUpdate && this.onUpdate();
  }

  pointerUpOutside(event) {
    this.touching = false;
  }
}


export class BlockRow extends PIXI.Container {
  constructor(n, width, height, app) {
    super();
    // Read In
    this.app = app;
    this.strokeCompression = 50;
    this._width = width;
    this._height = height;

    // Internal State
    this.blockTexture;

    // Children
    this.blockGraphics = new PIXI.Graphics();
    this.partialBlockGraphics = new PIXI.Graphics();
    this.label = new PIXI.Text();
    this.blocks = [];
    this.activeBlocks = [];

    this.init(n, width, height);
  }

  draw(n, blockWidth = this.blockWidth) {
    this.n = n;

    this.updateTextures(blockWidth);

    this.blocks.forEach((b, i) => {
      if (i < n) {
        this.addChild(b);
        b.texture.destroy();
        b.texture = this.blockTexture;
        if (blockWidth > 0) {
          b.x = blockWidth * i;
        } else {
          b.x = blockWidth * (i + 1);
        }
        b.alpha = 1;
      } else {
        b.alpha = 0;
        this.removeChild(b);
      }
    });
  }

  set labelText(text) {
    this.label.alpha = 1;
    this.label.text = text;
  }

  /// Slider Pointer Events

  updateTextures(width) {
    this.blockWidth = width;
    this._width = Math.abs(this.blockWidth * this.n);
    this.strokeWidth = this._height / this.strokeCompression;
    this.blockGraphics.clear();
    this.blockGraphics.lineStyle(this.strokeWidth, 0xffffff, 1, 0);
    this.blockGraphics.beginFill(0x1c77ff);
    this.blockGraphics.drawRoundedRect(
      0,
      0,
      Math.abs(width),
      this._height,
      this._height / 5
    );
    this.blockTexture = this.app.renderer.generateTexture(this.blockGraphics);
  }

  // Should call redraw after resize complete.
  resize(width = this.blockWidth) {
    this.updateTextures(width);

    this.blocks.forEach((b, i) => {
      if (i < this.n) {
        b.texture.destroy();
        b.texture = this.blockTexture;
        if (width > 0) {
          b.x = width * i;
        } else {
          b.x = width * (i + 1) - this.strokeWidth / 2;
        }
        b.alpha = 1;
      }
    });

    this.width = this._width;
  }

  init(n, width, height) {
    for (let i = 0; i < 100; i++) {
      let newBlock = new PIXI.Sprite();
      newBlock.texture = this.blockTexture;
      this.blocks.push(newBlock);
      this.addChild(newBlock);
    }

    this.draw(n, width / n, height);
  }
}

export class BinomialGrid extends PIXI.Container {
  constructor(config, app) {
    super();
    this.wholeBrick = new PIXI.Graphics();
    this.verticalTenthBrick = new PIXI.Graphics();
    this.horizontalTenthBrick = new PIXI.Graphics();
    this.partBrick = new PIXI.Graphics();

    this.config = config;
    this.app = app;

    this.sprites = [];

    for (let i = 0; i < 1000; i++) {
      let s = new PIXI.Sprite();
      s.active = false;
      this.sprites.push(s);
    }

    this.draw(config);
  }

  resize(dim) {
    this.config.oneDim = dim;
    let {
      xNumerator,
      xDenominator,
      yDenominator,
      yNumerator,
      oneDim,
    } = this.config;

    this.width = (dim * xNumerator) / xDenominator;
    this.height = (dim * yNumerator) / yDenominator;
  }

  draw(config) {
    this.sprites.forEach((s) => {
      this.removeChild(s);
    });

    this.partBrick.clear();
    this.horizontalTenthBrick.clear();
    this.verticalTenthBrick.clear();
    this.wholeBrick.clear();

    this.config = config;

    let { xNumerator, xDenominator, yDenominator, yNumerator, oneDim } = config;

    let partY = oneDim / yDenominator;
    let partX = oneDim / xDenominator;

    let partsX = xNumerator % xDenominator;
    let partsY = yNumerator % yDenominator;

    this.partStroke = Math.min(partY, partX) / Math.sqrt(15);
    this.wholeStroke = Math.sqrt(oneDim / 30);
    this.partStroke = this.wholeStroke;

    this.wholeBrick.lineStyle();

    this.wholeBrick.lineStyle(this.partStroke, 0xffffff);
    this.wholeBrick.beginFill(0x0384fc);

    this.verticalTenthBrick.lineStyle(this.partStroke, 0xffffff);
    this.verticalTenthBrick.beginFill(0xff306b);

    this.horizontalTenthBrick.lineStyle(this.partStroke, 0xffffff);
    this.horizontalTenthBrick.beginFill(0xff306b);

    this.partBrick.lineStyle(this.partStroke, 0xffffff);
    this.partBrick.beginFill(0xfcad03);

    this.partBrick.drawRoundedRect(0, 0, partX, partY, this.partStroke);
    this.verticalTenthBrick.drawRoundedRect(
      0,
      0,
      partX,
      oneDim,
      this.partStroke
    );
    this.horizontalTenthBrick.drawRoundedRect(
      0,
      0,
      oneDim,
      partY,
      this.partStroke
    );
    this.wholeBrick.drawRoundedRect(0, 0, oneDim, oneDim, this.partStroke);

    this.partBrickTexture = this.app.renderer.generateTexture(this.partBrick);
    this.wholeBrickTexture = this.app.renderer.generateTexture(this.wholeBrick);
    this.horizontalBrickTexture = this.app.renderer.generateTexture(
      this.horizontalTenthBrick
    );
    this.verticalBrickTexture = this.app.renderer.generateTexture(
      this.verticalTenthBrick
    );

    // Draw Parts
    let k = 0;
    for (let i = 0; i < xNumerator; i++) {
      for (let j = 0; j < yNumerator; j++) {
        let s = this.sprites[k];
        s.anchor.set(0, 1);
        s.texture.destroy()
        if (j >= yNumerator - partsY && i >= xNumerator - partsX) {
          s.texture = this.partBrickTexture;
          s.x = i * partX;
          s.y = -j * partY;
          this.addChild(s);
          k++;
        } else if (j % yDenominator == 0 && i >= xNumerator - partsX) {
          s.texture = this.verticalBrickTexture;
          s.x = i * partX;
          s.y = -j * partY;
          this.addChild(s);
          k++;
        } else if (i % xDenominator == 0 && j >= yNumerator - partsY) {
          s.texture = this.horizontalBrickTexture;
          s.x = i * partX;
          s.y = -j * partY;
          this.addChild(s);
          k++;
        } else if (i % xDenominator == 0 && j % yDenominator == 0) {
          s.texture = this.wholeBrickTexture;
          s.x = i * partX;
          s.y = -j * partY;
          this.addChild(s);
          k++;
        }
      }
    }
  }
}

// Math Fact Prompt:
export class MathFactPrompt extends PIXI.Text {
  constructor(facts) {
    super();
    this.problemIndex = 1;
    this.facts = facts;
    this.nextProblem(this.facts[1]);
    this.style.fontFamily = "Chalkboard SE";
  }

  set Height(height) {
    this.style.fontSize = height;
    // MOOOOO FIX THIS!
    this.nextProblem(this.currentProblem);
  }

  // currentProblem: FIRST,SECOND,TARGET,OPERATION
  nextProblem(currentProblem) {
    this.currentProblem = currentProblem;
    let string =
      " " +
      currentProblem.FIRST +
      " " +
      currentProblem.OPERATION +
      " " +
      currentProblem.SECOND +
      " =";
    this.text = string;
    this.factIndex++;
  }
}

// Math Fact Prompt:
export class Prompt extends PIXI.Text {
  constructor(text) {
    super();
    this.style.fontFamily = "Chalkboard SE";
  }

  set Height(height) {
    this.style.fontSize = height;
  }
}

// Draggable
export class Draggable extends PIXI.Sprite {
  constructor(texture) {
    super();
    this.dragged = false;
    this.touching = false;
    this.interactive = true;
    this.lockX = false;
    this.lockY = false;
    this.texture = texture;
    this.minX = null;
    this.maxX = null;
    this.minY = null;
    this.maxY = null;
    this.on("pointerdown", this.pointerDown);
    this.on("pointermove", this.pointerMove);
    this.on("pointerup", this.pointerUp);
    this.on("pointerupoutside", this.pointerUpOutside);
  }

  pointerDown(event) {
    this.touching = true;
    this.dragged = false;
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y,
    };
  }

  pointerMove(event) {
    if (this.touching) {
      if (!this.lockX) {
        this.x = event.data.global.x + this.deltaTouch.x;

        let xMaxOut = this.maxX && this.x > this.maxX;
        let xMinOut = this.minX && this.x < this.minX;

        if (xMaxOut) {
          this.x = this.maxX;
        } else if (xMinOut) {
          this.x = this.minX;
        }
      }

      if (!this.lockY) {
        this.y = event.data.global.y + this.deltaTouch.y;

        let yMaxOut = this.maxY && this.y > this.yMax;
        let yMinOut = this.minY && this.y < this.yMin;

        if (yMaxOut) {
          this.y = this.yMax;
        } else if (yMinOut) {
          this.y = this.yMin;
        }
      }
      this.dragged = true;
    }
  }

  pointerUp(event) {
    this.touching = false;
  }

  pointerUpOutside(event) {
    this.touching = false;
  }
}

// Horizontal Number Line
export class HorizontalNumberLine extends PIXI.Container {
  constructor(min, max, width, app) {
    super();
    this.labels = [];
    this.ticks = [];
    this.min = min;
    this.max = max;
    this.minFloat = min;
    this.maxFloat = max;
    this._width = width;
    this.lineThickness = width / 300;
    this.interactive = true;
    this.length = width;
    this.app = app

    this.flexPoint = 0;

    // Default values. Dictate how much you can zoom in and out.
    this.upperLimit = 50;
    this.lowerLimit = -50;
    this.upperRange = this.upperLimit - this.lowerLimit;
    this.lowerRange = 0.005;

    this.setLayoutParams(min, max);

    this.majorTick = new PIXI.Graphics();
    this.majorTick.lineStyle(this.majorTickThickness, 0x000000);
    this.majorTick.lineTo(0, this.majorTickHeight);
    this.majorTickTexture = app.renderer.generateTexture(this.majorTick);

    this.minorTick = new PIXI.Graphics();
    this.minorTick.lineStyle(this.minorTickThickness, 0x000000);
    this.minorTick.lineTo(0, this.minorTickHeight);
    this.minorTickTexture = app.renderer.generateTexture(this.minorTick);

    this.line = new PIXI.Graphics();
    this.line.lineStyle(this.lineThickness, 0x000000);
    this.line.lineTo(width, 0);
    this.line.y = this.line.y + this.lineThickness / 2;
    this.addChild(this.line);

    this.on("pointerdown", this.pointerDown);
    this.on("pointerup", this.pointerUp);
    this.on("pointerupoutside", this.pointerUp);
    this.on("pointermove", this.pointerMove);

    this.init();

    this.hitArea = new PIXI.Rectangle(0, 0, this.width, 1.5 * this.height);
  }

  hideLabels(){
    this.labels.forEach(l=>{l.visible = false})
  }

  getOne() {
    return this.length / (this.max - this.min);
  }

  getDistanceFromZeroFromValue(val) {
    return (
      this.getNumberLinePositionFromFloatValue(val) -
      this.getNumberLinePositionFromFloatValue(0)
    );
  }

  getDistanceFromZeroFromPosition(pos) {
    return pos - this.getNumberLinePositionFromFloatValue(0);
  }

  getValueForWidth(width){
    return width/this.majorDX*this.majorStep
  }

  synchWith(pointerX) {
    let roundedPositionForThis = this.roundPositionToNearestTick(pointerX);
    let valForThisFromRoundedPosition = this.getNumberLineFloatValueFromPosition(
      roundedPositionForThis
    );
    let bounds = this.getBoundsFrom(pointerX, valForThisFromRoundedPosition);
    this.draw(bounds.min, bounds.max);
  }

  getRandomValueFromRange() {
    let rand = Math.round(Math.random() / 0.01) * 0.01;
    let delta = rand * (this.maxFloat - this.minFloat);
    let randValue = this.minFloat + delta;
    let randValueRounded = this.roundValueToNearestTick(randValue);

    if (this.minorStep < 1) {
      let minStepDigitCount = digitCount(this.minorStep) - 1;
      randValueRounded = randValueRounded.toFixed(minStepDigitCount);
    }

    return randValueRounded;
  }

  roundPositionToNearestTick(xPos) {
    let val = this.getNumberLineFloatValueFromPosition(xPos);
    let roundedVal = Math.round(val / this.minorStep) * this.minorStep;
    return this.getNumberLinePositionFromFloatValue(roundedVal);
  }

  roundPositionDownToNearestTick(xPos) {
    let val = this.getNumberLineFloatValueFromPosition(xPos);
    let roundedVal = Math.floor(val / this.minorStep) * this.minorStep;
    return this.getNumberLinePositionFromFloatValue(roundedVal);
  }

  roundPositionUpToNearestTick(xPos) {
    let val = this.getNumberLineFloatValueFromPosition(xPos);
    let roundedVal = Math.ceil(val / this.minorStep) * this.minorStep;
    return this.getNumberLinePositionFromFloatValue(roundedVal);
  }

  roundValueToNearestTick(xVal) {
    let roundedVal = Math.round(xVal / this.minorStep) * this.minorStep;
    return roundedVal;
  }

  roundValueDownToNearestTick(xVal) {
    let roundedVal = Math.floor(xVal / this.minorStep) * this.minorStep;
    return roundedVal;
  }

  roundValueUpToNearestTick(xVal) {
    let roundedVal = Math.ceil(xVal / this.minorStep) * this.minorStep;
    return roundedVal;
  }

  setBoundaries(lowerLimit, upperLimit, lowerRange) {
    this.lowerLimit = lowerLimit;
    this.upperLimit = upperLimit;
    this.upperRange = this.upperLimit - this.lowerLimit;
    this.lowerRange = lowerRange;
  }

  centerZero() {
    return {
      x: this.x + this.getNumberLinePositionFromFloatValue(0),
      y: this.y,
    };
  }

  numberLineParameters(min, max, width) {
    let majorSteps = [
      0.00001,
      0.00005,
      0.0001,
      0.0005,
      0.001,
      0.005,
      0.01,
      0.05,
      0.1,
      0.5,
      1,
      5,
      10,
      50,
      100,
      500,
      1000,
      5000,
      10000,
      50000,
      100000,
    ];
    let minorSteps = [
      0.00001,
      0.00005,
      0.0001,
      0.0005,
      0.001,
      0.005,
      0.01,
      0.1,
      1,
      5,
      10,
      50,
      100,
      500,
      1000,
      5000,
      10000,
      50000,
      100000,
    ];
    let minorStepIndex = 0;
    let majorStepIndex = -1;
    let digitHeight = 0;
    let ticksNeeded = (max - min) / minorSteps[minorStepIndex];
    let majorStep = 0.0001;
    let minorStep = 0.0001;

    while (digitHeight < width / 50) {
      majorStepIndex += 1;
      let numberOfIncrements = Math.round(
        (max - min) / majorSteps[majorStepIndex]
      );
      let maxDigits = 1;
      if (majorSteps[majorStepIndex] >= 1) {
        if (min < 0) {
          maxDigits = digitCount(Math.floor(Math.abs(min))) + 1;
        } else {
          maxDigits = digitCount(Math.ceil(max));
        }
      } else {
        if (min < 0) {
          maxDigits =
            digitCount(Math.abs(Math.floor(min))) +
            digitCount(majorSteps[majorStepIndex]) +
            1;
        } else {
          maxDigits =
            digitCount(Math.ceil(max)) + digitCount(majorSteps[majorStepIndex]);
        }
      }

      let numberOfDigitWidths = (maxDigits + 1) * (numberOfIncrements - 1);

      let digitWidth = width / numberOfDigitWidths;
      digitHeight = (6 / 5) * digitWidth;
      minorStep = minorSteps[majorStepIndex - 1];
      majorStep = majorSteps[majorStepIndex];
    }

    while (ticksNeeded >= 100) {
      minorStepIndex += 1;
      ticksNeeded = (max - min) / minorSteps[minorStepIndex];
      minorStep = minorSteps[minorStepIndex];
    }

    digitHeight = width / 50;

    const params = {
      MAJOR_STEP: majorStep,
      MINOR_STEP: minorStep,
      DIGIT_HEIGHT: digitHeight,
    };
    return params;
  }

  // Pasted from somewhere else - arguments not necessary, should access class variables.
  placeLabels(values, dx) {
    this.labels.forEach((l) => {
      let currentValue = l.value;
      // If the value of this label isn't null, we know it's already active and on the number line.
      let activeLabel = currentValue != null;
      let needsToBeSet = activeLabel && values[currentValue];
      delete values[currentValue];
      // If the label is active and still a value that needs to be set, reposition it.
      if (needsToBeSet) {
        l.text = l.value;
        l.x = (l.value - this.min) * this.dx;
        l.y = 1.1 * this.majorTickHeight;
        l.style.fontSize = this.digitHeight;
        l.alpha = 1;

        // If it's active, but not part of the new active labels, remove it and set value null.
      } else if (activeLabel) {
        // Hide / remove
        l.value = null;
        l.alpha = 0;
      }
    });

    let empties = this.labels.filter((l) => l.value == null);

    let valueKeys = Object.keys(values);

    valueKeys.forEach((k) => {
      if (empties.length != 0) {
        let newActiveLbl = empties.pop();
        newActiveLbl.y = 1.1 * this.majorTickHeight;
        newActiveLbl.value = k;
        newActiveLbl.text = k;
        newActiveLbl.x = (k - this.min) * this.dx;
        newActiveLbl.alpha = 1;
      }
    });
  }

  placeTicks(values) {
    this.ticks.forEach((l, i) => {
      let currentValue = l.value;
      let activeLabel = currentValue != null;

      let needsToBeSet = activeLabel && values[currentValue];
      delete values[currentValue];

      // If the label is active and still a value that needs to be set, reposition it.
      if (needsToBeSet) {
        l.text = l.value;
        l.x = this.dx * (l.value - this.min);
        l.y = 0;
        l.alpha = 1;
        let mod = Math.abs((l.value % this.majorStep) / this.majorStep);
        if (mod < 0.01 || mod > 0.99) {
          l.texture = this.majorTickTexture;
          l.height = this.majorTickHeight
          l.width = this.majorTickThickness
        } else {
          l.texture = this.minorTickTexture;
          l.height = this.minorTickHeight
          l.width = this.minorTickThickness
        }

        // If it's active, but not part of the new active labels, remove it and set value null.
      } else if (activeLabel) {
        l.value = null;
        l.alpha = 0;
      }
    });

    let empties = this.ticks.filter((l) => l.value == null);

    let valueKeys = Object.keys(values);

    valueKeys.forEach((k) => {
      if (empties.length != 0) {
        let newActiveTick = empties.pop();
        newActiveTick.value = k;
        let mod = Math.abs(
          (newActiveTick.value % this.majorStep) / this.majorStep
        );
        if (mod < 0.01 || mod > 0.99) {
          newActiveTick.texture = this.majorTickTexture;
          newActiveTick.height = this.majorTickHeight
          newActiveTick.width= this.majorTickThickness
        } else {
          newActiveTick.texture = this.minorTickTexture;
          newActiveTick.height = this.minorTickHeight
          newActiveTick.width= this.minorTickThickness
        }
        newActiveTick.x = (k - this.min) * this.dx;
        newActiveTick.alpha = 1;
      }
    });
  }

  pointerUp() {
    this.touching = false;
    this.onUpdateComplete && this.onUpdateComplete();
  }

  pointerDown(e) {
    this.touching = true;
    let pA = e.data.getLocalPosition(this).x;
    this.vA = this.getNumberLineFloatValueFromPosition(pA);
  }

  getBoundsFrom(x, value) {
    let pM = this._width;
    let pm = 0;
    let pC = this.getNumberLinePositionFromFloatValue(this.flexPoint);
    let vC = this.flexPoint;
    let pA = x;
    let vA = value;
    let vM = vC + ((pM - pC) / (pA - pC)) * (vA - vC);
    let vMin = vM - ((pM - pm) / (pM - pC)) * (vM - vC);

    return { min: vMin, max: vM };
  }

  pointerMove(e) {
    if (this.touching) {
      let pA = e.data.getLocalPosition(this).x;
      let bounds = this.getBoundsFrom(pA, this.vA);
      this.draw(bounds.min, bounds.max);
      // Execute callback if it's available.
      this.onUpdate && this.onUpdate();
    }
  }

  zoomTo(min, max, duration, onComplete, onUpdate) {
    const update = () => {
      this.onUpdate && this.onUpdate()
      this.draw(this.min, this.max);
    };
    const complete = ()=>{
      this.onComplete && this.onComplete()
    }
    TweenLite.to(this, {
      max: max,
      min: min,
      duration: duration,
      onUpdate: update,
      onComplete: complete,
    });
  }

  getNumberLineFloatValueFromPosition(pos) {
    return (pos * this.minorStep) / this.minorDX + this.minFloat;
  }

  getNumberLineMaxFromAnchor(anchor, position) {
    let max =
      this.minFloat + ((anchor - this.minFloat) / position) * this._width;
    return max;
  }

  getNumberLineMinFromAnchor(anchor, position) {
    let min =
      this.maxFloat - (this.maxFloat - anchor) / (1 - position / this._width);
    return min;
  }

  getNumberLinePositionFromFloatValue(val) {
    let pos1 =
      ((val - this.minFloat) / (this.maxFloat - this.minFloat)) * this._width;
    return pos1;
  }

  setLayoutParams(min, max) {
    this.params = this.numberLineParameters(min, max, this._width);

    this.min = min;
    this.max = max;
    this.minFloat = min;
    this.maxFloat = max;

    this.lineThickness = this._width/300

    if (this.fractionTicks) {
      this.params.MINOR_STEP = 1 / this.denominator;
      this.params.MAJOR_STEP = 1;
    }

    this.majorStep = this.params.MAJOR_STEP;
    this.minorStep = this.params.MINOR_STEP;
    this.digitHeight = this.params.DIGIT_HEIGHT;

    this.majorDX =
      (this._width / (this.maxFloat - this.minFloat)) * this.majorStep;
    this.minorDX =
      (this._width / (this.maxFloat - this.minFloat)) * this.minorStep;

    this.dx = this._width / (this.maxFloat - this.minFloat);

    this.minorTickHeight = this._width / 60;
    this.majorTickHeight = 1.5 * this.minorTickHeight;

    this.minorTickThickness = Math.min(this.majorDX / 3, this.lineThickness);
    this.majorTickThickness = this.minorTickThickness * 1.25;
  }

  getNumbersNeeded(min, max, step) {
    let numbersNeeded = {};
    let start = Math.ceil(min / step) * step;
    let currentNumber = start;
    let digits = digitCount(step);

    while (currentNumber <= max && currentNumber >= start) {
      let cleanNumber = Math.round(currentNumber / step) * step;
      if (cleanNumber % 1 != 0) {
        cleanNumber = currentNumber.toFixed(digits - 1);
      }
      // Add this number to the list of numbers needed.
      numbersNeeded[cleanNumber] = true;
      currentNumber += step;
    }
    return numbersNeeded;
  }

  redraw(newFrame){

     this._width = newFrame.width 
     this.length = newFrame.width

     this.setLayoutParams(this.min,this.max)

     this.hitArea.width = this._width 
     this.hitArea.height = this.height


     this.line.clear()
     this.line.lineStyle(this.lineThickness, 0x000000);
     this.line.lineTo(this._width, 0);
     this.line.y = 0

     this.majorTick.clear()
     this.majorTick.lineStyle(this.majorTickThickness, 0x000000);
     this.majorTick.lineTo(0, this.majorTickHeight);
     this.majorTickTexture = this.app.renderer.generateTexture(this.majorTick);
 
     this.minorTick.clear()
     this.minorTick.lineStyle(this.minorTickThickness, 0x000000);
     this.minorTick.lineTo(0, this.minorTickHeight);
     this.minorTickTexture = this.app.renderer.generateTexture(this.minorTick);


     this.draw()
  }

  // NLD_DRAW
  draw(min = this.min, max = this.max) {

    let range = max - min;

    if (
      max < this.upperLimit &&
      min > this.lowerLimit &&
      range > this.lowerRange &&
      range < this.upperRange
    ) {
      this.setLayoutParams(min, max);
  

      let numbersNeededForLabels = this.getNumbersNeeded(
        min,
        max,
        this.majorStep
      );
      let numbersNeededForTicks = this.getNumbersNeeded(
        min,
        max,
        this.minorStep
      );

      this.placeLabels(numbersNeededForLabels);

      this.placeTicks(numbersNeededForTicks);
    }
  }

  init() {
    for (let i = 0; i <= 100; i++) {
      let newLabel = new PIXI.Text();
      newLabel.style.fontSize = this.digitHeight;
      newLabel.style.fontFamily = "Chalkboard SE";
      newLabel.style.fill = 0x000000;
      newLabel.anchor.set(0.5, 0);
      newLabel.text = i;
      newLabel.value = null;
      newLabel.alpha = 0;
      this.addChild(newLabel);
      this.labels.push(newLabel);
      newLabel.y = 1.1 * this.majorTickHeight;
    }

    for (let i = 0; i <= 200; i++) {
      let newTick = new PIXI.Sprite(this.majorTickTexture);
      newTick.anchor.set(0.5, 0);
      newTick.value = null;
      newTick.alpha = 0;
      this.addChild(newTick);
      this.ticks.push(newTick);
    }

    this.draw(this.min, this.max);
  }
}

// Vertcial Number Line
export class VerticalNumberLine extends PIXI.Container {
  constructor(min, max, length, app) {
    super();
    this.labels = [];
    this.ticks = [];
    this.min = min;
    this.max = max;
    this.minFloat = min;
    this.maxFloat = max;
    this._width = length;
    this.lineThickness = length / 300;
    this.interactive = true;
    this.length = length;

    this.flexPoint = 0;

    // Default values. Dictate how much you can zoom in and out.
    this.upperLimit = 50;
    this.lowerLimit = -50;
    this.upperRange = this.upperLimit - this.lowerLimit;
    this.lowerRange = 0.005;

    this.setLayoutParams(min, max);

    this.majorTick = new PIXI.Graphics();
    this.majorTick.lineStyle(this.majorTickThickness, 0x000000);
    this.majorTick.lineTo(-this.majorTickHeight, 0);
    this.majorTickTexture = app.renderer.generateTexture(this.majorTick);

    this.minorTick = new PIXI.Graphics();
    this.minorTick.lineStyle(this.minorTickThickness, 0x000000);
    this.minorTick.lineTo(-this.minorTickHeight, 0);
    this.minorTickTexture = app.renderer.generateTexture(this.minorTick);

    this.line = new PIXI.Graphics();
    this.line.lineStyle(this.lineThickness, 0x000000);
    this.line.lineTo(0, -length);
    this.line.y = this.line.y + this.lineThickness / 2;
    this.addChild(this.line);

    this.on("pointerdown", this.pointerDown);
    this.on("pointerup", this.pointerUp);
    this.on("pointerupoutside", this.pointerUp);
    this.on("pointermove", this.pointerMove);

    this.init();

    //this.hitArea = new PIXI.Rectangle(0,0,-1.5*this._width/10,-this._width)
    this.hitArea = new PIXI.Rectangle(-50, -length, 50, length);
  }


  hideLabels(){
    this.labels.forEach(l=>{l.visible = false})
  }

  synchWith(pointerX) {
    let roundedPositionForThis = this.roundPositionToNearestTick(pointerX);
    let valForThisFromRoundedPosition = this.getNumberLineFloatValueFromPosition(
      roundedPositionForThis
    );
    let bounds = this.getBoundsFrom(pointerX, valForThisFromRoundedPosition);
    this.draw(bounds.min, bounds.max);
  }

  getRandomValueFromRange() {
    let rand = Math.round(Math.random() / 0.01) * 0.01;
    let delta = rand * (this.maxFloat - this.minFloat);
    let randValue = this.minFloat + delta;
    let randValueRounded = this.roundValueToNearestTick(randValue);

    if (this.minorStep < 1) {
      let minStepDigitCount = digitCount(this.minorStep) - 1;
      randValueRounded = randValueRounded.toFixed(minStepDigitCount);
    }

    return randValueRounded;
  }

  roundPositionToNearestTick(xPos) {
    let val = this.getNumberLineFloatValueFromPosition(xPos);
    let roundedVal = Math.round(val / this.minorStep) * this.minorStep;
    return this.getNumberLinePositionFromFloatValue(roundedVal);
  }

  roundPositionDownToNearestTick(xPos) {
    let val = this.getNumberLineFloatValueFromPosition(xPos);
    let roundedVal = Math.floor(val / this.minorStep) * this.minorStep;
    return this.getNumberLinePositionFromFloatValue(roundedVal);
  }

  roundPositionUpToNearestTick(xPos) {
    let val = this.getNumberLineFloatValueFromPosition(xPos);
    let roundedVal = Math.ceil(val / this.minorStep) * this.minorStep;
    return this.getNumberLinePositionFromFloatValue(roundedVal);
  }

  roundValueToNearestTick(xVal) {
    let roundedVal = Math.round(xVal / this.minorStep) * this.minorStep;
    return roundedVal;
  }

  roundValueDownToNearestTick(xVal) {
    let roundedVal = Math.floor(xVal / this.minorStep) * this.minorStep;
    return roundedVal;
  }

  roundValueUpToNearestTick(xVal) {
    let roundedVal = Math.ceil(xVal / this.minorStep) * this.minorStep;
    return roundedVal;
  }

  setBoundaries(lowerLimit, upperLimit, lowerRange) {
    this.lowerLimit = lowerLimit;
    this.upperLimit = upperLimit;
    this.upperRange = this.upperLimit - this.lowerLimit;
    this.lowerRange = lowerRange;
  }

  centerZero() {
    return {
      x: this.x + this.getNumberLinePositionFromFloatValue(0),
      y: this.y,
    };
  }

  getOne() {
    return this.length / (this.max - this.min);
  }

  numberLineParameters(min, max, width) {
    let majorSteps = [
      0.00001,
      0.00005,
      0.0001,
      0.0005,
      0.001,
      0.005,
      0.01,
      0.05,
      0.1,
      0.5,
      1,
      5,
      10,
      50,
      100,
      500,
      1000,
      5000,
      10000,
      50000,
      100000,
    ];
    let minorSteps = [
      0.00001,
      0.00005,
      0.0001,
      0.0005,
      0.001,
      0.005,
      0.01,
      0.1,
      1,
      5,
      10,
      50,
      100,
      500,
      1000,
      5000,
      10000,
      50000,
      100000,
    ];
    let minorStepIndex = 0;
    let majorStepIndex = -1;
    let digitHeight = 0;
    let ticksNeeded = (max - min) / minorSteps[minorStepIndex];
    let majorStep = 0.0001;
    let minorStep = 0.0001;

    while (digitHeight < width / 50) {
      majorStepIndex += 1;
      let numberOfIncrements = Math.round(
        (max - min) / majorSteps[majorStepIndex]
      );
      let maxDigits = 1;
      if (majorSteps[majorStepIndex] >= 1) {
        if (min < 0) {
          maxDigits = digitCount(Math.floor(Math.abs(min))) + 1;
        } else {
          maxDigits = digitCount(Math.ceil(max));
        }
      } else {
        if (min < 0) {
          maxDigits =
            digitCount(Math.abs(Math.floor(min))) +
            digitCount(majorSteps[majorStepIndex]) +
            1;
        } else {
          maxDigits =
            digitCount(Math.ceil(max)) + digitCount(majorSteps[majorStepIndex]);
        }
      }

      let numberOfDigitWidths = (maxDigits + 1) * (numberOfIncrements - 1);

      let digitWidth = width / numberOfDigitWidths;
      digitHeight = (6 / 5) * digitWidth;
      minorStep = minorSteps[majorStepIndex - 1];
      majorStep = majorSteps[majorStepIndex];
    }

    while (ticksNeeded >= 100) {
      minorStepIndex += 1;
      ticksNeeded = (max - min) / minorSteps[minorStepIndex];
      minorStep = minorSteps[minorStepIndex];
    }

    digitHeight = width / 50;

    const params = {
      MAJOR_STEP: majorStep,
      MINOR_STEP: minorStep,
      DIGIT_HEIGHT: digitHeight,
    };
    return params;
  }

  // Pasted from somewhere else - arguments not necessary, should access class variables.
  placeLabels(values, dx) {
    this.labels.forEach((l) => {
      let currentValue = l.value;
      // If the value of this label isn't null, we know it's already active and on the number line.
      let activeLabel = currentValue != null;
      let needsToBeSet = activeLabel && values[currentValue];
      delete values[currentValue];
      // If the label is active and still a value that needs to be set, reposition it.
      if (needsToBeSet) {
        l.text = l.value;
        l.y = -(l.value - this.min) * this.dx;
        l.x = -1.1 * this.majorTickHeight;
        l.style.fontSize = this.digitHeight;
        l.alpha = 1;

        // If it's active, but not part of the new active labels, remove it and set value null.
      } else if (activeLabel) {
        // Hide / remove
        l.value = null;
        l.alpha = 0;
      }
    });

    let empties = this.labels.filter((l) => l.value == null);

    let valueKeys = Object.keys(values);

    valueKeys.forEach((k) => {
      if (empties.length != 0) {
        let newActiveLbl = empties.pop();
        newActiveLbl.value = k;
        newActiveLbl.text = k;
        newActiveLbl.y = -(k - this.min) * this.dx;
        newActiveLbl.alpha = 1;
      }
    });
  }

  placeTicks(ticks, values, dx, textures, majorStep) {
    this.ticks.forEach((l, i) => {
      let currentValue = l.value;
      let activeLabel = currentValue != null;

      let needsToBeSet = activeLabel && values[currentValue];
      delete values[currentValue];

      // If the label is active and still a value that needs to be set, reposition it.
      if (needsToBeSet) {
        l.text = l.value;
        l.y = -dx * (l.value - this.min);
        l.x = 0;
        l.alpha = 1;
        let mod = Math.abs((l.value % majorStep) / majorStep);
        if (mod < 0.01 || mod > 0.99) {
          l.texture = this.majorTickTexture;
          l.width = this.majorTickHeight
          l.height = this.majorTickThickness
        } else {
          l.texture = this.minorTickTexture;
          l.width = this.minorTickHeight
          l.height = this.minorTickThickness
        }

        // If it's active, but not part of the new active labels, remove it and set value null.
      } else if (activeLabel) {
        l.value = null;
        l.alpha = 0;
      }
    });

    let empties = ticks.filter((l) => l.value == null);

    let valueKeys = Object.keys(values);

    valueKeys.forEach((k) => {
      if (empties.length != 0) {
        let newActiveTick = empties.pop();
        newActiveTick.value = k;
        newActiveTick.x = 0;
        let mod = Math.abs((newActiveTick.value % majorStep) / majorStep);
        if (mod < 0.01 || mod > 0.99) {
          newActiveTick.texture = this.majorTickTexture;
          newActiveTick.width = this.majorTickHeight
          newActiveTick.height = this.majorTickThickness
        } else {
          newActiveTick.texture = this.minorTickTexture;
          newActiveTick.width = this.minorTickHeight
          newActiveTick.height= this.minorTickThickness
        }
        newActiveTick.y = -dx * (newActiveTick.value - this.min);
        newActiveTick.alpha = 1;
      }
    });
  }

  pointerUp() {
    this.touching = false;
    this.onUpdateComplete && this.onUpdateComplete();
  }

  pointerDown(e) {
    this.touching = true;
    let pA = e.data.getLocalPosition(this).y;
    this.vA = this.getNumberLineFloatValueFromPosition(pA);
  }

  getBoundsFrom(x, value) {
    let pM = this._width;
    let pm = 0;
    let pC = this.getNumberLinePositionFromFloatValue(this.flexPoint);
    let vC = this.flexPoint;
    let pA = x;
    let vA = value;
    let vM = vC + ((pM - pC) / (pA - pC)) * (vA - vC);
    let vMin = vM - ((pM - pm) / (pM - pC)) * (vM - vC);

    return { min: vMin, max: vM };
  }

  pointerMove(e) {
    if (this.touching) {
      let pA = e.data.getLocalPosition(this).y;
      let bounds = this.getBoundsFrom(pA, this.vA);
      this.draw(bounds.min, bounds.max);
      this.onUpdate && this.onUpdate();
    }
  }

  zoomTo(min, max, duration, onComplete, onUpdate) {
    const update = () => {
      onUpdate();
      this.draw(this.min, this.max);
    };
    TweenLite.to(this, {
      max: max,
      min: min,
      duration: duration,
      onUpdate: update,
      onComplete: onComplete,
    });
  }

  getNumberLineFloatValueFromPosition(pos) {
    return (pos * this.minorStep) / this.minorDX + this.minFloat;
  }

  getNumberLineMaxFromAnchor(anchor, position) {
    let max =
      this.minFloat + ((anchor - this.minFloat) / position) * this._width;
    return max;
  }

  getNumberLineMinFromAnchor(anchor, position) {
    let min =
      this.maxFloat - (this.maxFloat - anchor) / (1 - position / this._width);
    return min;
  }

  getNumberLinePositionFromFloatValue(val) {
    let pos = ((val - this.minFloat) / this.minorStep) * this.minorDX;
    let pos1 =
      ((val - this.minFloat) / (this.maxFloat - this.minFloat)) * this._width;
    return pos1;
  }

  setLayoutParams(min, max) {
    this.params = this.numberLineParameters(min, max, this.length);

    this.min = min;
    this.max = max;
    this.minFloat = min;
    this.maxFloat = max;

    this.lineThickness = this._width/300

    if (this.fractionTicks) {
      this.params.MINOR_STEP = 1 / this.denominator;
      this.params.MAJOR_STEP = 1;
    }

    this.majorStep = this.params.MAJOR_STEP;
    this.minorStep = this.params.MINOR_STEP;
    this.digitHeight = this.params.DIGIT_HEIGHT;

    this.majorDX =
      (this._width / (this.maxFloat - this.minFloat)) * this.majorStep;
    this.minorDX =
      (this._width / (this.maxFloat - this.minFloat)) * this.minorStep;

    this.dx = this.length/ (this.maxFloat - this.minFloat);

    this.minorTickHeight = this.length / 60;
    this.majorTickHeight = 1.5 * this.minorTickHeight;

    this.minorTickThickness = Math.min(this.majorDX / 3, this.lineThickness);
    this.majorTickThickness = this.minorTickThickness * 1.25;
  }

  getNumbersNeeded(min, max, step) {
    let numbersNeeded = {};
    let start = Math.ceil(min / step) * step;
    let currentNumber = start;
    let digits = digitCount(step);

    while (currentNumber <= max && currentNumber >= start) {
      let cleanNumber = Math.round(currentNumber / step) * step;
      if (cleanNumber % 1 != 0) {
        cleanNumber = currentNumber.toFixed(digits - 1);
      }
      // Add this number to the list of numbers needed.
      numbersNeeded[cleanNumber] = true;
      currentNumber += step;
    }
    return numbersNeeded;
  }

  redraw(newFrame){
    this._width = Math.min(newFrame.width,newFrame.height)
    this.length = Math.min(newFrame.width,newFrame.height)
    this.lineThickness = this._width/300
    this.line.width = this.lineThickness
    this.line.height = this.length
    this.hitArea.height = this._width 
    this.hitArea.width = 50
    this.draw()
 }


  // NLD_DRAW
  draw(min = this.min, max = this.max) {
    let range = max - min;

    if (
      max < this.upperLimit &&
      min > this.lowerLimit &&
      range > this.lowerRange &&
      range < this.upperRange
    ) {
      this.min = min;
      this.max = max;
      this.minFloat = min;
      this.maxFloat = max;

      this.setLayoutParams(min, max);

      let numbersNeededForLabels = this.getNumbersNeeded(
        min,
        max,
        this.majorStep
      );
      let numbersNeededForTicks = this.getNumbersNeeded(
        min,
        max,
        this.minorStep
      );

      this.placeLabels(numbersNeededForLabels);

      this.placeTicks(
        this.ticks,
        numbersNeededForTicks,
        this.dx,
        [this.majorTickTexture, this.minorTickTexture],
        this.majorStep
      );
    }
  }

  init() {
    for (let i = 0; i <= 100; i++) {
      let newLabel = new PIXI.Text();
      newLabel.style.fontSize = this.digitHeight;
      newLabel.style.fontFamily = "Chalkboard SE";
      newLabel.style.fill = 0x000000;
      newLabel.anchor.set(1, 0.5);
      newLabel.text = i;
      newLabel.value = null;
      newLabel.alpha = 0;
      this.addChild(newLabel);
      this.labels.push(newLabel);
      newLabel.x = -1.15 * this.majorTickHeight;
    }

    for (let i = 0; i <= 200; i++) {
      let newTick = new PIXI.Sprite(this.majorTickTexture);
      newTick.anchor.set(1, 0.5);
      newTick.value = null;
      newTick.alpha = 0;
      this.addChild(newTick);
      this.ticks.push(newTick);
    }

    this.draw(this.min, this.max);
  }
}

export class NumberLineEstimator extends PIXI.Container {
  constructor(width, min, max, partitions, target, tolerance, app) {
    super();

    // Constants
    this.BLUE = 0x4287f5;

    this.app = app;

    this.digitHeight = width / 30;

    // Set object parameters based on configuration.
    this.updateLayoutParams(width, min, max, partitions, target, tolerance);

    // Graphics Cache
    this.stripGraphic = new PIXI.Graphics();
    this.stripSprite = new PIXI.Sprite();

    this.lineGraphic = new PIXI.Graphics();
    this.tickGraphic = new PIXI.Graphics();
    this.label = new PIXI.Text();

    //

    let sharpPinTexture = new PIXI.Texture.from(CONST.ASSETS.SHARP_PIN);
    this.slider = new Draggable(sharpPinTexture);
    this.slider.minX = 0.0001;
    this.slider.maxX = this._width;
    this.slider.interactive = true;
    this.slider.lockY = true;
    this.slider.anchor.set(0.5);

    // Arrays
    this.ticks = [];
    this.labels = [];

    this.slider.on("pointerdown", this.onSliderDown);
    this.slider.on("pointermove", this.onSliderMove);
    this.slider.on("pointerup", this.onSliderUp);
    this.slider.on("pointerupoutside", this.onSliderUp);

    this.init();
  }

  set showLabels(b) {
    if (b == true) {
      this.labels.forEach((l, i) => {
        if (i > this.partitions) {
          l.alpha = 0;
        } else {
          l.alpha = 1;
        }
      });
    } else {
      this.labels.forEach((l, i) => {});
    }
  }

  playFeedback() {
    // Timelines
    this.feedbackDuration = 0.25;
    let timeline = new TimelineLite({ paused: true });
    let sliderTimeline = new TimelineLite({ paused: true });

    // Precomputations
    let originalLocation = this.stripGraphic.width;
    let range = 0.05 * this._width;

    let targetX = ((this.target - this.min) / this.range) * this._width;
    let delta = this.stripGraphic.width - targetX;

    if (Math.abs(delta) < range) {
      this.showLabels = true;
      timeline.to(this.stripGraphic, { width: targetX });
      sliderTimeline.to(this.slider, { x: targetX }).to(this.slider, {
        duration: 1,
        y: -this.parent.height,
        ease: "power2",
        onComplete: this.onComplete,
      });
    } else if (delta > 0) {
      timeline
        .to(this.stripGraphic, {
          duration: this.feedbackDuration,
          width: originalLocation - 2 * range,
        })
        .to(this.stripGraphic, {
          duration: this.feedbackDuration,
          width: originalLocation,
          ease: "bounce",
        });
    } else if (delta < 0) {
      timeline
        .to(this.stripGraphic, {
          duration: this.feedbackDuration,
          width: originalLocation + 2 * range,
        })
        .to(this.stripGraphic, {
          duration: this.feedbackDuration,
          width: originalLocation,
          ease: "bounce",
        });
    }
    timeline.play();
    sliderTimeline.play();
  }

  drawStrip(width) {
    this.stripGraphic.clear();
    this.stripGraphic.beginFill(this.BLUE);
    this.stripGraphic.drawRoundedRect(
      0,
      0,
      width,
      this.stripHeight,
      this.strokeWidth
    );
    this.stripGraphic.width = width;
  }

  updateLayoutParams(width, min, max, partitions, target, tolerance) {
    // Read In Properties
    this.min = min;
    this.max = max;
    this.range = max - min;
    this.partitions = partitions;
    this._width = width;
    this.target = target;
    this.tolerance = tolerance;

    // Derived Properties
    this.tickHeight = width / 50;
    this.stripHeight = width / 15;
    this.strokeWidth = this.tickHeight / 5;
    this.range = this.max - this.min;
    this.step = this.range / this.partitions;
  }

  draw() {
    this.stripGraphic.clear();
    this.lineGraphic.clear();
    this.drawTicks();
    this.drawLabels();
  }

  drawTicks() {
    this.ticks.forEach((t, i) => {
      t.texture = this.tickTexture;
      t.x = i > this.partitions + 1 ? 0 : (this._width / this.partitions) * i;
      t.alpha = i >= this.partitions + 1 ? 0 : 1;
      t.y = 0;
    });
  }

  nextProblem(p) {
    const max = p.MAX;
    const min = p.MIN;
    const target = p.TARGET;
    const partitions = p.PARTITIONS;
    const tolerance = 0.05 * target;
    const width = this._width;

    this.updateLayoutParams(width, min, max, partitions, target, tolerance);
    this.drawLabels();
    this.drawTicks();
    this.drawStrip(0);
    this.slider.x = 0;
    this.slider.touching = false;
    this.slider.deltaTouch = { x: 0, y: 0 };
    this.slider.y = 3 * this.tickHeight + this.slider.height / 2;
  }

  drawLabels() {
    this.labels.forEach((l, i) => {
      l.text = (this.min + i * this.step).toFixed(0);
      l.y = this.tickHeight;
      l.alpha = 0;
      l.style.fontFamily = "Chalkboard SE";
      l.x = (this._width / this.partitions) * i - l.width / 2;
      if (i == 0 || i == this.partitions) {
        l.alpha = 1;
      }
    });
  }

  onSliderDown() {
    let x = this.x;
    this.parent.drawStrip(x);
  }

  onSliderMove(e) {
    if (this.touching) {
      let x = this.x;
      this.parent.drawStrip(x);
    }
  }

  onSliderUp() {
    if (this.dragged && this.x > 1) {
      this.parent.drawStrip(this.x);
      this.parent.playFeedback(this.x);
    } else if (this.x <= 1) {
      this.parent.stripGraphic.width = 0;
    }
  }

  init() {
    // Line
    this.lineGraphic.lineStyle(this.strokeWidth, 0x000000);
    this.lineGraphic.lineTo(this._width + this.strokeWidth, 0);

    // Strip
    this.stripGraphic.beginFill(this.BLUE);
    this.stripGraphic.drawRoundedRect(
      0,
      0,
      0,
      this.stripHeight,
      this.strokeWidth
    );
    this.stripGraphic.y = -this.stripHeight;

    // Tick
    this.tickGraphic.lineStyle(this.strokeWidth, 0x000000);
    this.tickGraphic.lineTo(0, this.tickHeight);
    this.tickTexture = this.app.renderer.generateTexture(this.tickGraphic);

    // Slider
    this.slider.width = this._width / 8;
    this.slider.height = this.slider.width;
    this.slider.y = 3 * this.tickHeight + this.slider.height / 2;
    this.slider.x = 0;
    this.addChild(this.slider);

    // Ticks Array Inititalization
    for (let i = 0; i <= 12; i++) {
      let tick = new PIXI.Sprite();
      tick.texture = this.tickTexture;
      tick.x =
        i > this.partitions + 1 ? 0 : (this._width / this.partitions) * i;
      tick.alpha = i >= this.partitions + 1 ? 0 : 1;
      tick.y = 0;
      this.ticks.push(tick);
      this.addChild(tick);
    }

    // Init Labels
    for (let i = 0; i <= 12; i++) {
      let label = new PIXI.Text();
      label.style.fontSize = this.digitHeight;
      this.labels.push(label);
      this.addChild(label);
    }

    this.addChild(this.stripGraphic);
    this.stripSprite.x = 0;
    this.stripSprite.y = 0;
    this.addChild(this.lineGraphic);

    this.drawLabels();
    this.Width = 10;
  }
}

export class NumberBubble extends PIXI.Container {
  // Config: text,width,
  constructor(config) {
    super();
    // Read Ins
    this.config = config;

    // Configure Sprite
    this.sprite = new PIXI.Sprite.from(CONST.ASSETS.PURE_GLASS_BUBBLE);
    this.sprite.width = this.config.width;
    this.sprite.height = this.config.width;
    this.addChild(this.sprite);

    // Label
    this.label = new PIXI.Text();
    this.lblText = this.config.text;
    this.label.anchor.set(0.5);
    this.label.x = this.height / 2;
    this.label.y = this.height / 2;
    this.label.style.fontFamily = "Chalkboard SE";

    this.addChild(this.label);
    //this.lblText = config.text
  }

  set lblText(t) {
    this.label.text = t;
    let h = this.width / digitCount(t);
    this.label.style.fontSize = h;
  }
}

export class Strip extends PIXI.Graphics {
  constructor(config) {
    super();
    this.config = config;
    this.pixelRatio = this.config.pixelRatio;
    this.label = new PIXI.Text();
    this.label.style.fontFamily = "Chalkboard SE";
    this.label.style.fontSize = this.config.height / 2;
    this.label.text = 0;
    this.label.anchor.set(0.5);
    this.Width = 0;
    this.addChild(this.label);
  }

  hideLabel() {}

  animateTo(w) {
    const onUpdate = () => {
      this.draw(this.Width);
    };
    TweenLite.to(this, { Width: w, duration: 1, onUpdate: onUpdate });
  }

  draw(w) {
    this.value = (w * this.pixelRatio).toFixed(0);
    this.label.text = this.value;

    if (this.label.width >= w) {
      this.label.y = -this.label.height;
      this.label.x = w / 2;
    } else {
      this.label.y = this.config.height / 2;
      this.label.x = w / 2;
    }
    this.clear();
    this.beginFill(this.config.color);
    this.drawRoundedRect(0, 0, w, this.config.height, 1);
  }
}

export class RangeBubbleSelector extends PIXI.Container {
  constructor(width, min, max, partitions, target, tolerance, app) {
    super();

    // Constants
    this.BLUE = 0x4287f5;
    this.PINK = 0xeb4034;

    this.app = app;

    this.digitHeight = width / 30;

    // Set object parameters based on configuration.
    this.updateLayoutParams(width, min, max, partitions, target, tolerance);

    // Graphics Cache
    const leftStripConfig = {
      height: this.stripHeight,
      color: this.BLUE,
      pixelRatio: this.pixelRatio,
      radius: this.strokeWidth,
    };

    const rightStripConfig = {
      height: this.stripHeight,
      color: this.PINK,
      pixelRatio: this.pixelRatio,
      radius: this.strokeWidth,
    };

    this.leftStripGraphic = new Strip(leftStripConfig);
    this.rightStripGraphic = new Strip(rightStripConfig);

    this.lineGraphic = new PIXI.Graphics();
    this.tickGraphic = new PIXI.Graphics();
    this.label = new PIXI.Text();

    //

    // Arrays
    this.ticks = [];
    this.labels = [];

    this.init();
  }

  getPositionFromValue(val) {
    return ((val - this.min) / this.range) * this._width;
  }

  set showLabels(b) {
    if (b == true) {
      this.labels.forEach((l, i) => {
        if (i > this.partitions) {
          l.alpha = 0;
        } else {
          l.alpha = 1;
        }
      });
    } else {
      this.labels.forEach((l, i) => {});
    }
  }

  drawStrips(width) {
    this.leftStripGraphic.clear();
    this.rightStripGraphic.clear();
    this.leftStripGraphic.pixelRatio = this.pixelRatio;
    this.rightStripGraphic.pixelRatio = this.pixelRatio;
    this.leftStripGraphic.draw(width);
    this.rightStripGraphic.draw(this.range / this.pixelRatio - width);
    this.rightStripGraphic.x = width;
  }

  updateLayoutParams(width, min, max, partitions, target, tolerance) {
    // Read In Properties
    this.min = min;
    this.max = max;
    this.partitions = partitions;
    this._width = width;
    this.target = target;
    this.tolerance = tolerance;
    this.range = max - min;
    this.pixelRatio = this.range / this._width;

    // Derived Properties
    this.tickHeight = width / 50;
    this.stripHeight = width / 15;
    this.strokeWidth = this.tickHeight / 5;
    this.range = this.max - this.min;
    this.step = this.range / this.partitions;
  }

  roundStrips(synchMe) {
    let roundedLeftVal =
      Math.round(this.pixelRatio * this.leftStripGraphic.width) /
      this.pixelRatio;

    this.drawStrips(roundedLeftVal);
    synchMe && (synchMe.x = this.x + roundedLeftVal);
  }

  drawTicks() {
    this.ticks.forEach((t, i) => {
      t.texture = this.tickTexture;
      t.x = i > this.partitions + 1 ? 0 : (this._width / this.partitions) * i;
      t.alpha = i >= this.partitions + 1 ? 0 : 1;
      t.y = 0;
    });
  }

  loadProblem(p) {
    const max = p.MAX;
    const min = p.MIN;
    const target = p.TARGET;
    const partitions = p.PARTITIONS;
    const tolerance = 0.05 * target;
    const width = this._width;

    this.updateLayoutParams(width, min, max, partitions, target, tolerance);
    this.drawLabels();
    this.drawTicks();
    this.drawStrips(this._width / 2);
    this.roundStrips();
  }

  drawLabels() {
    this.labels.forEach((l, i) => {
      l.text = (this.min + i * this.step).toFixed(0);
      l.y = this.tickHeight;
      l.alpha = 0;
      l.style.fontFamily = "Chalkboard SE";
      l.x = (this._width / this.partitions) * i - l.width / 2;
      if (i == 0 || i == this.partitions) {
        l.alpha = 1;
      }
    });
  }

  init() {
    // Line
    this.lineGraphic.lineStyle(this.strokeWidth, 0x000000);
    this.lineGraphic.lineTo(this._width + this.strokeWidth, 0);

    // Strip
    this.leftStripGraphic.beginFill(this.BLUE);
    this.leftStripGraphic.drawRoundedRect(
      0,
      0,
      0,
      this.stripHeight,
      this.strokeWidth
    );
    this.leftStripGraphic.y = -this.stripHeight;
    this.rightStripGraphic.beginFill(0x000000);
    this.rightStripGraphic.drawRoundedRect(
      0,
      0,
      0,
      this.stripHeight,
      this.strokeWidth
    );
    this.rightStripGraphic.y = -this.stripHeight;

    // Tick
    this.tickGraphic.lineStyle(this.strokeWidth, 0x000000);
    this.tickGraphic.lineTo(0, this.tickHeight);
    this.tickTexture = this.app.renderer.generateTexture(this.tickGraphic);

    // Ticks Array Inititalization
    for (let i = 0; i <= 12; i++) {
      let tick = new PIXI.Sprite();
      tick.texture = this.tickTexture;
      tick.x =
        i > this.partitions + 1 ? 0 : (this._width / this.partitions) * i;
      tick.alpha = i >= this.partitions + 1 ? 0 : 1;
      tick.y = 0;
      this.ticks.push(tick);
      this.addChild(tick);
    }

    // Init Labels
    for (let i = 0; i <= 12; i++) {
      let label = new PIXI.Text();
      label.style.fontSize = this.digitHeight;
      this.labels.push(label);
      this.addChild(label);
    }

    this.addChild(this.leftStripGraphic);
    this.addChild(this.rightStripGraphic);
    this.addChild(this.lineGraphic);

    this.drawLabels();
  }
}

// Visual Proofs

export class VPAdditionStrips extends PIXI.Container {
  constructor(a, b, config) {
    super();
    // Config
    this.config = config;

    // Timeline
    this.timeline = new TimelineLite({ paused: true });

    // Strips
    this.stripA = new PIXI.Graphics();
    this.stripB = new PIXI.Graphics();

    // Texts
    this.labelA = new PIXI.Text();
    this.labelB = new PIXI.Text();

    // Addends
    this._a = a * this.config.pixelsPerUnit;
    this._b = b * this.config.pixelsPerUnit;
    this.a = 0;
    this.b = 0;

    // Add Children
    this.addChild(this.stripA);
    this.addChild(this.stripB);
    this.addChild(this.labelA);
    this.addChild(this.labelB);
  }

  prepareFeedback(a, b) {
    this._a = a;
    this._b = b;
    this.labelA.text = this._a;
    this.labelB.text = this._b;
    this.labelA.alpha = 0;
    this.labelB.alpha = 0;
    this.labelB.anchor.set(0.5);
    this.labelA.anchor.set(0.5);
    this.labelA.y = this.config.height / 2;
    this.labelB.y = this.config.height / 2;

    const onComplete = () => {
      TweenLite.to(this.labelB, { duration: 1, alpha: 1 });
    };

    this.timeline.to(this, {
      a: this._a,
      duration: 1,
      onUpdate: () => {
        this.drawStripA();
      },
      onComplete: onComplete,
    });
    this.timeline.to(this, {
      b: this._b,
      duration: 1,
      onUpdate: () => {
        this.drawStripB();
      },
    });
  }

  drawStripA() {
    let aw = this.a * this.config.pixelsPerUnit;

    this.labelA.text = Math.round(this.a);
    this.labelA.x = Math.abs(aw) / 2;

    this.stripA.clear();
    this.stripA.beginFill(this.config.aColor);
    this.stripA.drawRoundedRect(0, 0, aw, this.config.height, 2);
  }

  drawStripB() {
    let aw = this.a * this.config.pixelsPerUnit;
    let bw = this.b * this.config.pixelsPerUnit;

    this.labelB.text = Math.round(this.b);
    this.labelB.x = aw + Math.abs(bw) / 2;

    this.stripB.clear();
    this.stripB.beginFill(this.config.bColor);
    this.stripB.drawRoundedRect(0, 0, bw, this.config.height, 2);
    this.stripB.x = aw;
  }

  play() {
    this.timeline.play();
    TweenLite.to(this.labelA, { duration: 1, alpha: 1 });
  }

  restart() {}

  pause() {}
}


export class MagnifyingPin extends PIXI.Container {
  constructor(numberline,state){
    super()
    this.state = state

    this.grabber = new PIXI.Sprite()
    this.grabber.anchor.set(0.5)
    this.grabber.texture = this.state.texture
    this.grabber.width = this.state.width
    this.grabber.height = this.state.height
    this.numberline = numberline
    this.whisker = new PIXI.Graphics()

    this.stroke = this.state.width/20

    this.addChild(this.whisker)
    this.addChild(this.grabber)

    this.dragged = false;
    this.touching = false;
    this.interactive = true;
    this.lockX = false;
    this.lockY = false;
    this.minX = null;
    this.maxX = null;
    this.minY = null;
    this.maxY = null;
    this.on("pointerdown", this.pointerDown);
    this.on("pointermove", this.pointerMove);
    this.on("pointerup", this.pointerUp);
    this.on("pointerupoutside", this.pointerUp);
  }

  pointerDown(event) {
    this.touching = true;
    this.dragged = false;
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y,
    };
  }

  pointerMove(event) {
    if (this.touching) {
      if (!this.lockX) {
        this.x = event.data.global.x + this.deltaTouch.x;

        let xMaxOut = this.maxX && this.x > this.maxX;
        let xMinOut = this.minX && this.x < this.minX;

        if (xMaxOut) {
          this.x = this.maxX;
        } else if (xMinOut) {
          this.x = this.minX;
        }
      }

      if (!this.lockY) {
        this.y = event.data.global.y + this.deltaTouch.y;

        let yMaxOut = this.maxY && this.y > this.yMax;
        let yMinOut = this.minY && this.y < this.yMin;

        if (yMaxOut) {
          this.y = this.yMax;
        } else if (yMinOut) {
          this.y = this.yMin;
        }
      }
      this.drawWhisker()
      this.dragged = true;
    }
  }

  pointerUp(event) {
    this.value = this.numberline.getNumberLineFloatValueFromPosition(this.x)
    this.touching = false;
    this.numberline.flexPoint = this.value

    const onUpdate = ()=> {
      this.drawWhisker()
    }

    if (Math.abs(this.y - this.numberline.y) < 2*this.grabber.height) {
      this.numberline.zoomTo(this.value - this.numberline.majorStep,this.value+this.numberline.majorStep,1)
      TweenLite.to(this,{y: this.numberline.y + 3*this.grabber.height,onUpdate: onUpdate})
    }
  }



  synch(){
    this.x = this.numberline.getNumberLinePositionFromFloatValue(this.value)
  }

  drawWhisker(){
      this.whisker.clear()
      this.whisker.lineStyle(this.stroke,0x000000)
      this.whisker.moveTo(0,0)
      this.whisker.lineTo(0,this.numberline.y -this.y)
  }

}



export class Pin extends PIXI.Container {
  constructor(numberline,state){
    super()
    this.state = state

    this.grabber = new PIXI.Sprite()
    this.grabber.anchor.set(0.5)
    this.grabber.texture = this.state.texture
    this.grabber.width = this.state.width
    this.grabber.height = this.state.height
    this.numberline = numberline
    this.whisker = new PIXI.Graphics()

    this.stroke = this.state.width/20

    this.addChild(this.whisker)
    this.addChild(this.grabber)

    this.dragged = false;
    this.touching = false;
    this.interactive = true;
    this.lockX = false;
    this.lockY = false;
    this.minX = null;
    this.maxX = null;
    this.minY = null;
    this.maxY = null;
    this.on("pointerdown", this.pointerDown);
    this.on("pointermove", this.pointerMove);
    this.on("pointerup", this.pointerUp);
    this.on("pointerupoutside", this.pointerUp);
  }

  pointerDown(event) {
    this.touching = true;
    this.dragged = false;
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y,
    };
  }

  pointerMove(event) {
    if (this.touching) {
      if (!this.lockX) {
        this.x = event.data.global.x + this.deltaTouch.x;

        let xMaxOut = this.maxX && this.x > this.maxX;
        let xMinOut = this.minX && this.x < this.minX;

        if (xMaxOut) {
          this.x = this.maxX;
        } else if (xMinOut) {
          this.x = this.minX;
        }
      }

      if (!this.lockY) {
        this.y = event.data.global.y + this.deltaTouch.y;

        let yMaxOut = this.maxY && this.y > this.yMax;
        let yMinOut = this.minY && this.y < this.yMin;

        if (yMaxOut) {
          this.y = this.yMax;
        } else if (yMinOut) {
          this.y = this.yMin;
        }
      }
      this.drawWhisker()
      this.dragged = true;
    }
  }

  pointerUp(event) {
    this.value = this.numberline.getNumberLineFloatValueFromPosition(this.x)
    this.touching = false;
    this.numberline.flexPoint = this.value

  }



  synch(){
    this.x = this.numberline.getNumberLinePositionFromFloatValue(this.value)
  }

  drawWhisker(){
      this.whisker.clear()
      this.whisker.lineStyle(this.stroke,0x000000)
      this.whisker.moveTo(0,0)
      this.whisker.lineTo(0,this.numberline.y -this.y)
  }

}



export class Chip extends PIXI.Container {
  constructor(numberline,state){
    super()
    this.state = state

    this.TYPE = 'c'

    this.primeChip = new PrimeChip(state)
    this.whisker = new PIXI.Graphics()
    this.numberline = numberline

    this.stroke = this.state.radius/20

    this.addChild(this.whisker)
    this.addChild(this.primeChip)

    this.dragged = false;
    this.touching = false;
    this.interactive = true;
    this.lockX = false;
    this.lockY = false;
    this.minX = null;
    this.maxX = null;
    this.minY = null;
    this.maxY = null;
    this.on("pointerdown", this.pointerDown);
    this.on("pointermove", this.pointerMove);
    this.on("pointerup", this.pointerUp);
    this.on("pointerupoutside", this.pointerUp);
  }

  redraw(newFrame){
    this.primeChip.redraw(newFrame)
    this.drawWhisker()
  }

  pointerDown(event) {
    this.touching = true;
    this.dragged = false;
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y,
    };
  }

  pointerMove(event) {
    if (this.touching) {
      if (!this.lockX) {
        this.x = event.data.global.x + this.deltaTouch.x;

        let xMaxOut = this.maxX && this.x > this.maxX;
        let xMinOut = this.minX && this.x < this.minX;

        if (xMaxOut) {
          this.x = this.maxX;
        } else if (xMinOut) {
          this.x = this.minX;
        }
      }

      if (!this.lockY) {
        this.y = event.data.global.y + this.deltaTouch.y;

        let yMaxOut = this.maxY && this.y > this.yMax;
        let yMinOut = this.minY && this.y < this.yMin;

        if (yMaxOut) {
          this.y = this.yMax;
        } else if (yMinOut) {
          this.y = this.yMin;
        }
      }
      this.drawWhisker()
      this.dragged = true;
    }
  }

  pointerUp(event) {
    this.state.value = Math.round(this.numberline.getNumberLineFloatValueFromPosition(this.x))
    this.touching = false;
    this.primeChip.draw(this.state.value)
    this.x = this.numberline.getNumberLinePositionFromFloatValue(this.state.value)
  }



  synch(){
    this.x = this.numberline.getNumberLinePositionFromFloatValue(this.state.value)
  }

  drawWhisker(){
      this.whisker.clear()
      this.whisker.lineStyle(this.stroke,0x000000)
      this.whisker.moveTo(0,0)
      this.whisker.lineTo(0,this.numberline.y -this.y)
  }

}




export class EditableTextField extends PIXI.Container {
  constructor(text){
    super()


    this.editButton = new PIXI.Sprite.from(CONST.ASSETS.EDIT_BUTTON)
    this.editButton.interactive = true

    this.textField = new PIXI.Text()
    this.updateText(text)
    this.editButton.alpha = 1
    this.dragged = false
    this.touching = false
    this.interactive = true
    this.lockX = false 
    this.lockY = false

    this.TYPE = 'et'

    this.fadeAnimation = new TimelineLite({paused: true})
    this.fadeAnimation.to(this.editButton,{alpha: 1,duration:1})
    this.fadeAnimation.to(this.editButton,{alpha: 0,duration:0.25})

    this.on('pointerdown',this.pointerDown)
    this.on('pointermove',this.pointerMove)
    this.on('pointerup',this.pointerUp)
    this.on('pointerupoutside',this.pointerUpOutside)
    this.addChild(this.editButton)
    this.addChild(this.textField)

  }


  updateText(text){
   this.textField.text = text
   this.editButton.alpha = 0
   this.editButton.height = this.textField.height 
   this.editButton.width = this.textField.height
   this.editButton.x = this.textField.width 
   this.editButton.y = -this.textField.height
  }
 

  pointerDown(event){
    this.fadeAnimation.kill()
    this.editButton.alpha = 1
    this.touching = true
    this.dragged = false
    this.deltaTouch = {
      x: this.x - event.data.global.x,
      y: this.y - event.data.global.y
    }
  }

  
  pointerMove(event){
    if (this.touching){
      if (!this.lockX){
        this.x = event.data.global.x + this.deltaTouch.x
      } 
      if (!this.lockY){
        this.y = event.data.global.y + this.deltaTouch.y
      }
      this.dragged = true
    }
  }

  pointerUp(event){
    this.touching = false
    this.fadeAnimation.restart()
  }
  
  pointerUpOutside(event){
    this.touching = false
  }
}