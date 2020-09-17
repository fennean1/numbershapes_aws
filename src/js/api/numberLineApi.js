import * as PIXI from "pixi.js";
import {digitCount} from "helperApi.js"


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
    this.onUpdateComplete && this.onUpdateComplete()
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
