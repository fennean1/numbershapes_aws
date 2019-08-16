// Problem que setup
import * as PIXI from "pixi.js";
import * as randomCoordinates from "./randomCoordinates.js"
import Clouds from "./assets/Clouds.png";
import BlueBall from "./assets/BlueBall.png";
import OrangeBall from "./assets/OrangeBall.png";
import BlueRing from "./assets/BlueRing.png";
import NewShapeButton from './assets/NewShapeButton.png'
import QuestionMark from './assets/QuestionMark.png'

const SUBITIZER_TYPES = {
  NORMAL: 1, 
  ADDITION: 2,
  SUBTRACTION: 3,
  ADDITION_THREE_DIGIT: 4,
  PIVOT: 5,
}

export const init = (app, setup) => {
    // Meta
    console.log("window.width,window.height",window.innerWidth,window.innerHeight)
    console.log(setup.width,setup.height,"setup.width")

    // Const
    let CENTER_STAGE_X = setup.width/2
    let CENTER_STAGE_Y = setup.height/2

    // Vars
    let dx = setup.height/10
    let balls = []
    app.stage.backGround = 0xffffff
    app.stage.alpha = 0
    window.createjs.Tween.get(app.stage).to({
        alpha: 1
      },
      1000,
      window.createjs.Ease.getPowInOut(4)
    );

    // Setup
    let backGround = new PIXI.Sprite.from(Clouds)
    backGround.x = 0
    backGround.y = 0 
    backGround.width = setup.width
    backGround.height = setup.height
    app.stage.addChild(backGround)

    let newShapeButton = new PIXI.Sprite.from(NewShapeButton)
    newShapeButton.x = dx/4
    newShapeButton.y = dx/4
    newShapeButton.width = 5*dx/2 
    newShapeButton.height = dx/2
    newShapeButton.interactive = true
    newShapeButton.on('pointerdown',newShape)
    app.stage.addChild(newShapeButton)

    let questionButton = new PIXI.Sprite.from(QuestionMark)
    questionButton.x = setup.width - 1.5*dx
    questionButton.y = dx/4
    questionButton.width = dx
    questionButton.height = dx
    questionButton.interactive = true
    questionButton.on('pointerdown',()=> {app.help()})
    app.stage.addChild(questionButton)



    // Init Balls
    // Helpers
    function randBetween(a,b){
      return  a + Math.floor(Math.random() * (b-a));
    }
    function destroy(objects){
      for (let o of objects){
        app.stage.removeChild(o)
        o.destroy(true)
      }
    }

    function getSubtractionBalls(pivot){

      let a = pivot == null ? randBetween(4,11) : pivot
      console.log("a",a)
      let b = randBetween(1,a)
      let aBalls = []
      let bBalls = []

      for (let i = 0;i<(a-b);i++){
        let aBall = new PIXI.Sprite.from(BlueBall)
        aBalls.push(aBall)
      }

      for (let j = 0;j<b;j++){
        let bBall = new PIXI.Sprite.from(BlueRing)
        bBalls.push(bBall)
      }

      let allBalls = [...aBalls,...bBalls]

      for (let b of allBalls){
        b.interactive = true
        b.on('pointerdown',onDragStart)
          .on('pointermove',onDragMove)
          .on('pointerup',onDragEnd)
      }
      return allBalls
    }

    function getPivotBalls(pivot){
      let rand = randBetween(1,11)
      console.log("RANDOME SHIT",rand)
      let pivotBalls = rand > 5 ? getSubtractionBalls(pivot) : getAdditionBalls(pivot)
      return pivotBalls
    }

    function getAdditionBalls(pivot){
      let a = pivot == null ? randBetween(1,11) : pivot
      console.log("a",a)
      let b = 1 + randBetween(0,10-a)
      let aBalls = []
      let bBalls = []

      for (let i = 0;i< a;i++){
        let aBall = new PIXI.Sprite.from(BlueBall)
        aBalls.push(aBall)
      }

      for (let j = 0;j<b;j++){
        let bBall = new PIXI.Sprite.from(OrangeBall)
        bBalls.push(bBall)
      }

      let allBalls = [...aBalls,...bBalls]

      for (let b of allBalls){
        b.interactive = true
        b.on('pointerdown',onDragStart)
          .on('pointermove',onDragMove)
          .on('pointerup',onDragEnd)
      }
      return allBalls
    }

    // Type needs to come from setup.type
    function initBallsFromType(type){
    
    switch (type){
      case SUBITIZER_TYPES.NORMAL: 
      let n = randBetween(4,11)
      let nBalls = []

      for (let i = 0;i<n;i++){
        let aBall = new PIXI.Sprite.from(BlueBall)
        nBalls.push(aBall)
      }
      for (let b of nBalls){
        b.interactive = true
        b.on('pointerdown',onDragStart)
          .on('pointermove',onDragMove)
          .on('pointerup',onDragEnd)
      }
      return nBalls
        break;
      case SUBITIZER_TYPES.SUBTRACTION:
        return getSubtractionBalls()
      // Code
        break;
      case SUBITIZER_TYPES.ADDITION:
         return getAdditionBalls()
        break;
      case SUBITIZER_TYPES.ADDITION_THREE_DIGIT:
      // Code
        break;
      case SUBITIZER_TYPES.PIVOT:
        return getPivotBalls(5)
        // Code
       break;
      default: 
      console.log("balls")
    }
    }

    function help(){
      app.help()
    }

    function newShape(){
        destroy(balls)
        balls = initBallsFromType(setup.props.type)
        let randomCords = randomCoordinates.generateRandomCoordinates(balls.length)
        let heightAndWidthOfCords = randomCoordinates.getHeightAndWidthOfCords(randomCords)

    for (let b of balls){
        window.createjs.Tween.get(b).to({
              x: -dx,
              y: -dx
            },
            1000,
            window.createjs.Ease.getPowInOut(4)
          );
          b.width = dx
          b.height = dx
          app.stage.addChild(b)
    }

    for (let i = 0;i<randomCords.length;i++){
        let cord = randomCords[i]
        window.createjs.Tween.get(balls[i]).to({
              x: CENTER_STAGE_X + (cord[0]-heightAndWidthOfCords[0]/2)*dx - dx/2,
              y: CENTER_STAGE_Y  + (cord[1]-heightAndWidthOfCords[1]/2)*dx - dx/2
            },
            1000,
            window.createjs.Ease.getPowInOut(4)
          );
    }

}

    // Dragging functions   
    function onDragStart(event) {
        let touchedAtX = event.data.getLocalPosition(this.parent).x;
        let touchedAtY = event.data.getLocalPosition(this.parent).y;
        this.deltaTouch = [this.x - touchedAtX, this.y - touchedAtY];
        app.stage.addChild(this);
        this.data = event.data;
        this.dragging = true;
      }

      function onDragEnd() {
        console.log("FRAC ENDED");
        this.data = null;
        this.dragging = false;
      }

      function onDragMove() {
        if (this.dragging) {
          let pointerPosition = this.data.getLocalPosition(this.parent);
          this.y = pointerPosition.y + this.deltaTouch[1];
          this.x = pointerPosition.x + this.deltaTouch[0];
        }
      }
}
