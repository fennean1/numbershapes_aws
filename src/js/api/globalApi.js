import * as PIXI from "pixi.js";
import { TweenMax, TimelineLite, Power2, Elastic, CSSPlugin, TweenLite, TimelineMax } from "gsap";
import {NUMBERS} from "../AssetManager.js"
import * as CONST from "./const.js";
import { StrictMode } from "react";
import { Easings } from "konva";
import { ShutterSpeedRounded } from "@material-ui/icons";



// CLASSES

export class BrickGrid extends PIXI.Container {
  constructor(){
    super()
    this.wholeBrick = new PIXI.Graphics()
    this.partBrick = new PIXI.Graphics()
  }

  draw(data){
   let {xNumerator,xDenominator,yDenominator,xNumerator,oneDim} = data 

   let partY = oneDim/yDenominator
   let partX = oneDim/xDenominator

   let wholesX = Math.floor(xNumerator/xDenominator)

   let wholesY = Math.floor(yNumerator/yDenominator)

   this.partBrick.drawRoundedRect(0,0,partX,partY)
   this.wholeBrick.drawRoundedRect(0,0,oneDim,oneDim)

   // Draw Parts


   // Draw Wholes

   for (let i = 0;i<wholesX;i++){
     for (let j=0;j<wholesY;j++){

     }
   }



  }

  resize(data){

  }


  init(data){

  }

}


// Math Fact Prompt:
export class MathFactPrompt extends PIXI.Text {
  constructor(facts){
    super()
    this.problemIndex = 1
    this.facts = facts
    this.nextProblem(this.facts[1])
    this.style.fontFamily = "Chalkboard SE";
  }

  set Height(height){
    this.style.fontSize = height
    // MOOOOO FIX THIS!
    this.nextProblem(this.currentProblem)
  }

  // currentProblem: FIRST,SECOND,TARGET,OPERATION
  nextProblem(currentProblem){
    this.currentProblem = currentProblem
    let string = " " + currentProblem.FIRST + " " + currentProblem.OPERATION + " " + currentProblem.SECOND +  " ="
    this.text = string
    this.factIndex++
  }
}


// Draggable
export class Draggable extends PIXI.Sprite {
    constructor(texture){
      super()
      this.dragged = false
      this.touching = false
      this.interactive = true
      this.lockX = false 
      this.lockY = false
      this.texture = texture
      this.minX = null 
      this.maxX = null 
      this.minY = null
      this.maxY = null
      this.on('pointerdown',this.pointerDown)
      this.on('pointermove',this.pointerMove)
      this.on('pointerup',this.pointerUp)
      this.on('pointerupoutside',this.pointerUpOutside)
    }
  
    pointerDown(event){
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

          let xMaxOut = this.maxX && this.x > this.maxX
          let xMinOut = this.minX && this.x < this.minX

          console.log("maxout minout",xMaxOut,xMinOut)

          if (xMaxOut){
            this.x = this.maxX
          } else if (xMinOut){
            this.x = this.minX
          }
        } 

        if (!this.lockY){
          this.y = event.data.global.y + this.deltaTouch.y

          let yMaxOut = this.maxY && this.y > this.yMax
          let yMinOut = this.minY && this.y < this.yMin

          if (yMaxOut){
            this.y = this.yMax
          } else if (yMinOut){
            this.y = this.yMin
          }
        }
        this.dragged = true
      }
    }
  
    pointerUp(event){
      this.touching = false
    }
    
    pointerUpOutside(event){
      this.touching = false
    }
  }

// Horizontal Number Line
export class HorizontalNumberLine extends PIXI.Container {
    constructor(min, max, width,app) {
      super();
      this.labels = [];
      this.ticks = []
      this.min = min;
      this.max = max;
      this.minFloat = min;
      this.maxFloat = max;
      this._width = width;
      this.lineThickness = width / 300;
      this.interactive = true
  
      this.flexPoint = 0
  
      // Default values. Dictate how much you can zoom in and out.
      this.upperLimit = 50
      this.lowerLimit = -50
      this.upperRange = this.upperLimit - this.lowerLimit
      this.lowerRange  = 5
  
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
      this.line.y = this.line.y + this.lineThickness/2
      this.addChild(this.line);
  
      this.on('pointerdown',this.pointerDown)
      this.on('pointerup',this.pointerUp)
      this.on('pointerupoutside',this.pointerUp)
      this.on('pointermove',this.pointerMove)
  
      this.init();

      this.hitArea = new PIXI.Rectangle(0,0,this.width,1.5*this.height)
  

    }
  
    synchWith(pointerX){
      let roundedPositionForThis = this.roundPositionToNearestTick(pointerX)
      let valForThisFromRoundedPosition = this.getNumberLineFloatValueFromPosition(roundedPositionForThis)
      let bounds = this.getBoundsFrom(pointerX,valForThisFromRoundedPosition)
      this.draw(bounds.min,bounds.max)
    }
  
    getRandomValueFromRange() {
      let rand = Math.round(Math.random()/0.01)*0.01
      let delta = rand*(this.maxFloat-this.minFloat)
      let randValue = this.minFloat+delta
      let randValueRounded = this.roundValueToNearestTick(randValue)
  
      if (this.minorStep < 1){
        let minStepDigitCount = digitCount(this.minorStep) -1
        randValueRounded = randValueRounded.toFixed(minStepDigitCount)
      }
  
      return randValueRounded
    }
  
    roundPositionToNearestTick(xPos){
      let val = this.getNumberLineFloatValueFromPosition(xPos)
      let roundedVal = Math.round(val/this.minorStep)*this.minorStep
      return this.getNumberLinePositionFromFloatValue(roundedVal)
    }
  
  
    roundPositionDownToNearestTick(xPos){
      let val = this.getNumberLineFloatValueFromPosition(xPos)
      let roundedVal = Math.floor(val/this.minorStep)*this.minorStep
      return this.getNumberLinePositionFromFloatValue(roundedVal)
    }
  
  
    roundPositionUpToNearestTick(xPos){
      let val = this.getNumberLineFloatValueFromPosition(xPos)
      let roundedVal = Math.ceil(val/this.minorStep)*this.minorStep
      return this.getNumberLinePositionFromFloatValue(roundedVal)
    }
  
  
    roundValueToNearestTick(xVal){
      let roundedVal = Math.round(xVal/this.minorStep)*this.minorStep
      return roundedVal
    }
  
    roundValueDownToNearestTick(xVal){
      let roundedVal = Math.floor(xVal/this.minorStep)*this.minorStep
      return roundedVal
    }
  
    roundValueUpToNearestTick(xVal){
      let roundedVal = Math.ceil(xVal/this.minorStep)*this.minorStep
      return roundedVal
    }
  
    setBoundaries(lowerLimit,upperLimit,lowerRange){
      this.lowerLimit = lowerLimit
      this.upperLimit = upperLimit
      this.upperRange = this.upperLimit - this.lowerLimit
      this.lowerRange = lowerRange
    }
  
    centerZero(){
      return {x: this.x + this.getNumberLinePositionFromFloatValue(0),y: this.y}
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
          if (min < 0){
            maxDigits = digitCount(Math.floor(Math.abs(min))) + 1
          } else {
            maxDigits = digitCount(Math.ceil(max));
          }
        } else {
          if (min < 0){
            maxDigits = digitCount(Math.abs(Math.floor(min)))+digitCount(majorSteps[majorStepIndex]) + 1
          } else {
            maxDigits = digitCount(Math.ceil(max))+digitCount(majorSteps[majorStepIndex]);
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
          newActiveLbl.x = (k - this.min) * this.dx;
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
          l.x = dx * (l.value - this.min);
          l.y = 0;
          l.alpha = 1;
          let mod = Math.abs(l.value%majorStep/majorStep)
          if (mod < 0.01 || mod > 0.99) {
            l.texture = textures[0];
          } else {
            l.texture = textures[1];
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
          newActiveTick.x = (k - this.min) * dx;
          newActiveTick.alpha = 1;
        }
      });
    }
  
    pointerUp(){
      this.touching = false
    }
  
    pointerDown(e){
      this.touching = true
      let pA = e.data.getLocalPosition(this).x
      this.vA = this.getNumberLineFloatValueFromPosition(pA)
    }
  
    getBoundsFrom(x,value){
      let pM = this._width 
      let pm = 0
      let pC = this.getNumberLinePositionFromFloatValue(this.flexPoint)
      let vC = this.flexPoint
      let pA = x
      let vA = value
      let vM = vC + (pM-pC)/(pA-pC)*(vA-vC)
      let vMin = vM - (pM-pm)/(pM-pC)*(vM-vC) 
  
      return {min: vMin,max: vM}
    }
  
    pointerMove(e){
      if(this.touching){
        let pA = e.data.getLocalPosition(this).x
        let bounds = this.getBoundsFrom(pA,this.vA)
        this.draw(bounds.min,bounds.max)
      }
    }
  
    zoomTo(min,max,duration,onComplete,onUpdate){
      const update = ()=>{
        onUpdate()
        this.draw(this.min,this.max)
      }
      TweenLite.to(this,{max: max,min: min,duration: duration,onUpdate: update,onComplete: onComplete})
    }
  
    getNumberLineFloatValueFromPosition(pos) {
      return (pos * this.minorStep) / this.minorDX + this.minFloat;
    }
  
    getNumberLineMaxFromAnchor(anchor,position) {
      let max = this.minFloat + (anchor - this.minFloat)/position*this._width
      return max
    }
  
    getNumberLineMinFromAnchor(anchor,position) {
  
      let min = this.maxFloat - (this.maxFloat - anchor)/(1-position/this._width)
      return min
    }
  
   getNumberLinePositionFromFloatValue(val){
      let pos = (val-this.minFloat)/this.minorStep*this.minorDX
      let pos1 = (val - this.minFloat)/(this.maxFloat-this.minFloat)*this._width
      return pos1
   }

  
    setLayoutParams(min, max) {
      this.params = this.numberLineParameters(min, max, this._width);
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
  
    // NLD_DRAW
    draw(min, max) {
  
  
      let range = max - min
  
      if (max < this.upperLimit && min > this.lowerLimit && range > this.lowerRange && range < this.upperRange ) {
  
      this.min = min;
      this.max = max;
      this.minFloat = min;
      this.maxFloat = max;
  
      this.setLayoutParams(min, max);
  
  
      let numbersNeededForLabels = this.getNumbersNeeded(min, max, this.majorStep);
      let numbersNeededForTicks = this.getNumbersNeeded(min, max, this.minorStep);
  
      this.placeLabels(
        numbersNeededForLabels,
      );
  
      this.placeTicks(
        this.ticks,
        numbersNeededForTicks,
        this.dx,
        [this.majorTickTexture, this.minorTickTexture],
        this.majorStep
      );
  
    }
  
    // Execute callback if it's available.
    this.onUpdate && this.onUpdate()
  }
  
    init() {
      for (let i = 0; i <= 100; i++) {
        let newTick = new PIXI.Sprite(this.majorTickTexture);
        newTick.anchor.set(0.5, 0);
        newTick.value = null;
        newTick.alpha = 0;
        this.addChild(newTick);
        this.ticks.push(newTick);
  
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
      this.draw(this.min, this.max);
    }
  }


  export class NumberLineEstimator extends PIXI.Container {
      constructor(width,min,max,partitions,target,tolerance,app){
        super()

        // Constants 
        this.BLUE = 0x4287f5

        this.app = app

        this.digitHeight = width/30

        // Set object parameters based on configuration.
        this.updateLayoutParams(width,min,max,partitions,target,tolerance)

        // Graphics Cache
        this.stripGraphic = new PIXI.Graphics()
        this.stripSprite = new PIXI.Sprite()

        this.lineGraphic = new PIXI.Graphics()
        this.tickGraphic = new PIXI.Graphics()
        this.label = new PIXI.Text()

        //

        let sharpPinTexture = new PIXI.Texture.from(CONST.ASSETS.SHARP_PIN)
        this.slider = new Draggable(sharpPinTexture)
        this.slider.minX = 0.0001
        this.slider.maxX = this._width
        this.slider.interactive = true
        this.slider.lockY = true
        this.slider.anchor.set(0.5)

        // Arrays
        this.ticks = []
        this.labels = []

        this.slider.on('pointerdown',this.onSliderDown)
        this.slider.on('pointermove',this.onSliderMove)
        this.slider.on('pointerup',this.onSliderUp)
        this.slider.on('pointerupoutside',this.onSliderUp)

        this.init()
      }

      set showLabels(b){
       if (b == true){
        this.labels.forEach((l,i)=>{
          if (i>this.partitions){
            l.alpha = 0
          } else {
            l.alpha = 1
          }
        })
       } else {
         this.labels.forEach((l,i)=>{
         })
       }
      }

      playFeedback(){

        // Timelines
        this.feedbackDuration = 0.25
        let timeline = new TimelineLite({paused: true})
        let sliderTimeline = new TimelineLite({paused: true})

        // Precomputations
        let originalLocation = this.stripGraphic.width
        let range = 0.05*this._width
        
        let targetX = (this.target-this.min)/this.range*this._width
        let delta = this.stripGraphic.width - targetX
      

        if (Math.abs(delta) < range ){
            this.showLabels = true
            timeline.to(this.stripGraphic,{width: targetX})
            sliderTimeline.to(this.slider,{x: targetX})
                          .to(this.slider,{duration: 1,y: -this.parent.height,ease: 'power2',onComplete: this.onComplete})
        } else if (delta > 0) {
            timeline.to(this.stripGraphic,{duration: this.feedbackDuration,width: originalLocation-2*range})
                    .to(this.stripGraphic,{duration: this.feedbackDuration,width: originalLocation,ease:'bounce'})
        } else if (delta < 0) {
            timeline.to(this.stripGraphic,{duration: this.feedbackDuration,width: originalLocation+2*range})
                     .to(this.stripGraphic,{duration: this.feedbackDuration,width: originalLocation,ease:'bounce'})
        }
        timeline.play()
        sliderTimeline.play()
      }

      drawStrip(width){
        this.stripGraphic.clear()
        this.stripGraphic.beginFill(this.BLUE)
        this.stripGraphic.drawRoundedRect(0,0,width,this.stripHeight,this.strokeWidth)
        this.stripGraphic.width = width
      }

      updateLayoutParams(width,min,max,partitions,target,tolerance){
        // Read In Properties
        this.min = min 
        this.max = max 
        this.range = max - min
        this.partitions = partitions
        this._width = width
        this.target = target
        this.tolerance = tolerance

        // Derived Properties
        this.tickHeight = width/50
        this.stripHeight = width/15
        this.strokeWidth = this.tickHeight/5
        this.range = this.max - this.min
        this.step = this.range/this.partitions
      }

      draw(){
        this.stripGraphic.clear()
        this.lineGraphic.clear()
        this.drawTicks()
        this.drawLabels()
      }

      drawTicks(){
        this.ticks.forEach((t,i)=>{
          t.texture = this.tickTexture
          t.x = i > this.partitions+1 ?  0 : this._width/this.partitions*i
          t.alpha = i >= this.partitions+1 ?  0 : 1
          t.y = 0
        })
      }

      nextProblem(p){
        const max = p.MAX 
        const min = p.MIN 
        const target = p.TARGET
        const partitions = p.PARTITIONS
        const tolerance = 0.05*target
        const width = this._width

        this.updateLayoutParams(width,min,max,partitions,target,tolerance)
        this.drawLabels()
        this.drawTicks()
        this.drawStrip(0)
        this.slider.x = 0
        this.slider.touching = false
        this.slider.deltaTouch = {x:0,y:0}
        this.slider.y = 3*this.tickHeight+this.slider.height/2 
      }

      drawLabels(){
        this.labels.forEach((l,i)=>{
          l.text = (this.min + i*this.step).toFixed(0)
          l.y = this.tickHeight
          l.alpha = 0
          l.style.fontFamily = "Chalkboard SE";
          l.x = this._width/this.partitions*i - l.width/2
          if (i == 0 || i == this.partitions){
            l.alpha = 1
          }
        })
      }


      onSliderDown(){
        let x = this.x
        this.parent.drawStrip(x)
      }

      onSliderMove(e){
        if (this.touching){
            let x = this.x
            this.parent.drawStrip(x)
        }
      }

      onSliderUp(){
        if (this.dragged && this.x > 1){
          this.parent.drawStrip(this.x)
          this.parent.playFeedback(this.x)
        } else if (this.x <= 1) {
          this.parent.stripGraphic.width = 0
        }
      }


      init(){
          // Line
          this.lineGraphic.lineStyle(this.strokeWidth,0x000000)
          this.lineGraphic.lineTo(this._width+this.strokeWidth,0)

          // Strip 
          this.stripGraphic.beginFill(this.BLUE)
          this.stripGraphic.drawRoundedRect(0,0,0,this.stripHeight,this.strokeWidth)
          this.stripGraphic.y = -this.stripHeight

          // Tick
          this.tickGraphic.lineStyle(this.strokeWidth,0x000000)
          this.tickGraphic.lineTo(0,this.tickHeight)
          this.tickTexture = this.app.renderer.generateTexture(this.tickGraphic)

          // Slider
          this.slider.width = this._width/8
          this.slider.height = this.slider.width
          this.slider.y = 3*this.tickHeight+this.slider.height/2 
          this.slider.x = 0
          this.addChild(this.slider)

          // Ticks Array Inititalization
          for (let i = 0;i<=12;i++){
             let tick = new PIXI.Sprite()
             tick.texture = this.tickTexture
             tick.x = i > this.partitions+1  ?  0 : (this._width)/this.partitions*i 
             tick.alpha = i >= this.partitions+1 ?  0 : 1
             tick.y = 0
             this.ticks.push(tick)
             this.addChild(tick)
          }

          // Init Labels
          for (let i = 0;i<=12;i++){
              let label = new PIXI.Text()
              label.style.fontSize = this.digitHeight
              this.labels.push(label)
              this.addChild(label)
          }


         this.addChild(this.stripGraphic)
         this.stripSprite.x = 0
         this.stripSprite.y = 0
         this.addChild(this.lineGraphic)

         this.drawLabels()
         this.Width = 10
      }
  }


  export class NumberBubble extends PIXI.Container {
    // Config: text,width,
    constructor(config){  
        super()
        // Read Ins
        this.config = config

        // Configure Sprite
        this.sprite = new PIXI.Sprite.from(CONST.ASSETS.PURE_GLASS_BUBBLE)
        this.sprite.width = this.config.width
        this.sprite.height = this.config.width
        this.addChild(this.sprite)
        

        // Label
        this.label = new PIXI.Text()
        this.lblText = this.config.text
        this.label.anchor.set(0.5)
        this.label.x = this.height/2
        this.label.y = this.height/2
        this.label.style.fontFamily = "Chalkboard SE"

        this.addChild(this.label)
        //this.lblText = config.text

    }

    set lblText(t){
      this.label.text = t
      let h = this.width/digitCount(t)
      this.label.style.fontSize = h
    }

  }

  export class Strip extends PIXI.Graphics{
    constructor(config){
      super()
      this.config = config 
      this.pixelRatio = this.config.pixelRatio
      this.label = new PIXI.Text()
      this.label.style.fontFamily = "Chalkboard SE"
      this.label.style.fontSize = this.config.height/2
      this.label.text = 0
      this.label.anchor.set(0.5)
      this.Width = 0
      this.addChild(this.label)
    }


    animateTo(w){
      const onUpdate = ()=>{
        this.draw(this.Width)
      }
      TweenLite.to(this,{Width: w,duration: 1,onUpdate: onUpdate})
    }

    draw(w){
      this.value = (w*this.pixelRatio).toFixed(0)
      this.label.text = this.value

      if (this.label.width >= w){
        this.label.y = - this.label.height
        this.label.x = w/2
      } else {
        this.label.y = this.config.height/2
        this.label.x = w/2
      }
      this.clear()
      this.beginFill(this.config.color)
      this.drawRoundedRect(0,0,w,this.config.height,1)
    }

  }




  export class RangeBubbleSelector extends PIXI.Container {
    constructor(width,min,max,partitions,target,tolerance,app){
      super()

      // Constants 
      this.BLUE = 0x4287f5
      this.PINK = 0xeb4034

      this.app = app

      this.digitHeight = width/30

      // Set object parameters based on configuration.
      this.updateLayoutParams(width,min,max,partitions,target,tolerance)

      // Graphics Cache
      const leftStripConfig = {
        height: this.stripHeight,
        color: this.BLUE,
        pixelRatio: this.pixelRatio,
        radius: this.strokeWidth
      }

      const rightStripConfig = {
        height: this.stripHeight,
        color: this.PINK,
        pixelRatio: this.pixelRatio,
        radius: this.strokeWidth
      }
      
      this.leftStripGraphic = new Strip(leftStripConfig)
      this.rightStripGraphic = new Strip(rightStripConfig)

      this.lineGraphic = new PIXI.Graphics()
      this.tickGraphic = new PIXI.Graphics()
      this.label = new PIXI.Text()

      //

      // Arrays
      this.ticks = []
      this.labels = []

      this.init()
    }

    getPositionFromValue(val){
      return (val-this.min)/this.range*this._width
    }

    set showLabels(b){

     if (b == true){
      this.labels.forEach((l,i)=>{
        if (i>this.partitions){
          l.alpha = 0
        } else {
          l.alpha = 1
        }
      })
     } else {
       this.labels.forEach((l,i)=>{
     
       })
     }

    }

    drawStrips(width){

      
      this.leftStripGraphic.clear()
      this.rightStripGraphic.clear()
      this.leftStripGraphic.pixelRatio = this.pixelRatio
      this.rightStripGraphic.pixelRatio = this.pixelRatio
      this.leftStripGraphic.draw(width)
      this.rightStripGraphic.draw(this.range/this.pixelRatio - width)
      this.rightStripGraphic.x = width
    }

    updateLayoutParams(width,min,max,partitions,target,tolerance){
      // Read In Properties
      this.min = min 
      this.max = max 
      this.partitions = partitions
      this._width = width
      this.target = target
      this.tolerance = tolerance
      this.range = max - min
      this.pixelRatio = this.range/this._width

      // Derived Properties
      this.tickHeight = width/50
      this.stripHeight = width/15
      this.strokeWidth = this.tickHeight/5
      this.range = this.max - this.min
      this.step = this.range/this.partitions
    }



    roundStrips(synchMe){
     let roundedLeftVal = Math.round(this.pixelRatio*this.leftStripGraphic.width)/this.pixelRatio
     
     this.drawStrips(roundedLeftVal)
     synchMe && (synchMe.x = this.x + roundedLeftVal)
    }

    drawTicks(){
      this.ticks.forEach((t,i)=>{
        t.texture = this.tickTexture
        t.x = i > this.partitions+1 ?  0 : this._width/this.partitions*i
        t.alpha = i >= this.partitions+1 ?  0 : 1
        t.y = 0
      })
    }

    loadProblem(p){
      const max = p.MAX 
      const min = p.MIN 
      const target = p.TARGET
      const partitions = p.PARTITIONS
      const tolerance = 0.05*target
      const width = this._width

      this.updateLayoutParams(width,min,max,partitions,target,tolerance)
      this.drawLabels()
      this.drawTicks()
      this.drawStrips(this._width/2)
      this.roundStrips()
    }

    drawLabels(){
      this.labels.forEach((l,i)=>{
        l.text = (this.min + i*this.step).toFixed(0)
        l.y = this.tickHeight
        l.alpha = 0
        l.style.fontFamily = "Chalkboard SE";
        l.x = this._width/this.partitions*i - l.width/2
        if (i == 0 || i == this.partitions){
          l.alpha = 1
        }
      })
    }

    init(){
        // Line
        this.lineGraphic.lineStyle(this.strokeWidth,0x000000)
        this.lineGraphic.lineTo(this._width+this.strokeWidth,0)

        // Strip 
        this.leftStripGraphic.beginFill(this.BLUE)
        this.leftStripGraphic.drawRoundedRect(0,0,0,this.stripHeight,this.strokeWidth)
        this.leftStripGraphic.y = -this.stripHeight
        this.rightStripGraphic.beginFill(0x000000)
        this.rightStripGraphic.drawRoundedRect(0,0,0,this.stripHeight,this.strokeWidth)
        this.rightStripGraphic.y = -this.stripHeight

        // Tick
        this.tickGraphic.lineStyle(this.strokeWidth,0x000000)
        this.tickGraphic.lineTo(0,this.tickHeight)
        this.tickTexture = this.app.renderer.generateTexture(this.tickGraphic)

        // Ticks Array Inititalization
        for (let i = 0;i<=12;i++){
           let tick = new PIXI.Sprite()
           tick.texture = this.tickTexture
           tick.x = i > this.partitions+1  ?  0 : (this._width)/this.partitions*i 
           tick.alpha = i >= this.partitions+1 ?  0 : 1
           tick.y = 0
           this.ticks.push(tick)
           this.addChild(tick)
        }

        // Init Labels
        for (let i = 0;i<=12;i++){
            let label = new PIXI.Text()
            label.style.fontSize = this.digitHeight
            this.labels.push(label)
            this.addChild(label)
        }


       this.addChild(this.leftStripGraphic)
       this.addChild(this.rightStripGraphic)
       this.addChild(this.lineGraphic)

       this.drawLabels()
    }
}


// Visual Proofs

export class VPAdditionStrips extends PIXI.Container {
  constructor(a,b,config){
    super()
    // Config
    this.config = config

    // Timeline
    this.timeline = new TimelineLite({paused: true})

    // Strips
    this.stripA = new PIXI.Graphics()
    this.stripB = new PIXI.Graphics()

    // Texts
    this.labelA = new PIXI.Text()
    this.labelB = new PIXI.Text()

    // Addends
    this._a = a*this.config.pixelsPerUnit 
    this._b = b*this.config.pixelsPerUnit 
    this.a = 0 
    this.b = 0

    // Add Children
    this.addChild(this.stripA)
    this.addChild(this.stripB)
    this.addChild(this.labelA)
    this.addChild(this.labelB)
  }

  prepareFeedback(a,b){
    this._a = a
    this._b = b
    this.labelA.text = this._a 
    this.labelB.text = this._b
    this.labelA.alpha = 0
    this.labelB.alpha = 0
    this.labelB.anchor.set(0.5)
    this.labelA.anchor.set(0.5)
    this.labelA.y = this.config.height/2
    this.labelB.y = this.config.height/2

    const onComplete = ()=>{
      TweenLite.to(this.labelB,{duration: 1,alpha: 1})
    }

    this.timeline.to(this,{a: this._a,duration: 1,onUpdate: ()=>{this.drawStripA()},onComplete: onComplete})
    this.timeline.to(this,{b: this._b,duration: 1,onUpdate: ()=>{this.drawStripB()}})
  }

  drawStripA(){
    let aw = this.a*this.config.pixelsPerUnit

    this.labelA.text = Math.round(this.a)    
    this.labelA.x = Math.abs(aw)/2 

    this.stripA.clear()
    this.stripA.beginFill(this.config.aColor)
    this.stripA.drawRoundedRect(0,0,aw,this.config.height,2)

  }

  drawStripB(){
    let aw = this.a*this.config.pixelsPerUnit
    let bw = this.b*this.config.pixelsPerUnit

    this.labelB.text = Math.round(this.b)
    this.labelB.x = aw + Math.abs(bw)/2

    this.stripB.clear()
    this.stripB.beginFill(this.config.bColor)
    this.stripB.drawRoundedRect(0,0,bw,this.config.height,2)
    this.stripB.x = aw
  }


  play(){
    this.timeline.play()
    TweenLite.to(this.labelA,{duration: 1,alpha: 1})
  }

  restart(){

  }

  pause(){

  }

}

  // Helpers 
  function digitCount(n) {
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