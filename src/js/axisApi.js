
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


function getOptimalMarkings(min, max, width) {
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
    majorStep: majorStep,
    minorSTep: minorStep,
    digitHeight: digitHeight,
  };
  return params;
}

// In Progress
export class Axis {
  constructor(state) {

    this.state = {
      min: -10,
      max: 10,
      majorStep: 1,
      minorStep: 1,
      length: 100
    }

  }
  
  updateState(){
    
    const {min,max,length} = this.state

    this.majorSpacing = (max - min)/this.state.majorStep
    this.minorSpacing = (max - min)/this.state.minorStep

    // In pixels per unit length of number line.
    this.unitSpacing = this.majorSpacing/this.majorStep
    this.numbersNeeded = getNumbersNeeded(min,max)

  }

  getPositionFromValue(val,anchor = this.state.min){
    return (val - anchor)*this.unitSpacing
  }

}

  export class Axis2D {
    constructor(){

      this.yState = {
        min: 0,
        max: 10,
        length: 100,
      }

      this.xState = {
        min: 0,
        max: 10,
        length: 100,
      }

      this.yAxis = new Axis(this.yState)
      this.xAxis = new Axis(this.xState)

    }
  }