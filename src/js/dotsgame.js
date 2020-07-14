// Problem que setup
import * as PIXI from "pixi.js";
import * as randomCoordinates from "./randomCoordinates.js"
import Clouds from "../assets/Clouds.png";
import BlueBall from "../assets/BlueBall.png";
import OrangeBall from "../assets/OrangeBall.png";
import BlueRing from "../assets/BlueRing.png";
import PinkBall from "../assets/PinkBall.png"
import NewShapeButton from '../assets/NewShapeButton.png'
import QuestionMark from '../assets/QuestionMark.png'
import FrameButton from "../assets/FrameButton.png";
import LineButton from "../assets/LineButton.png";
import EquationButton from "../assets/EquationButton.png";
import ShuffleButton from "../assets/ShuffleButton.png";
import MoreAppsButton from "../assets/MoreAppsButton.png";
import {Keypad} from "./api.js"
import {NUMBERS} from "../AssetManager.js"


const SUBITIZER_TYPES = {
  NORMAL: 1, 
  ADDITION: 2,
  SUBTRACTION: 3,
  ADDITION_THREE_DIGIT: 4,
  PIVOT: 5,
  SPLAT: 6
}

const BALL_STATES = {
  LINE: 0,
  FRAME: 1,
  RANDOM: 2,
}

export const init = (app, setup) => {
  
    // Const
    let CENTER_STAGE_X = setup.width/2
    let CENTER_STAGE_Y = setup.height/2

    // Vars
    let dx = setup.height/10
    let balls = []
    let a = null 
    let b = null 
    let SubtractionImage = BlueRing
    let CounterImage = BlueBall
    let AdditionImage = OrangeBall
    let equation = null
    let showEquation = false

    let targetValue = setup.props.value // Default value

    
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
    newShapeButton.buttonMode = true
    newShapeButton.on('pointerdown',newShape)
    //app.stage.addChild(newShapeButton)

    let questionButton = new PIXI.Sprite.from(QuestionMark)
    questionButton.x = setup.width - 1.5*dx
    questionButton.y = dx/3 + 2*dx/2
    questionButton.width = dx
    questionButton.height = dx
    questionButton.interactive = true
    questionButton.on('pointerdown',()=> {app.help()})
    //app.stage.addChild(questionButton)

    let moreAppsButton = new PIXI.Sprite.from(MoreAppsButton)
    moreAppsButton.x = setup.width - 1.5*dx
    moreAppsButton.y = dx/4
    moreAppsButton.width = dx
    moreAppsButton.height = dx
    moreAppsButton.interactive = true
    moreAppsButton.on('pointerdown',()=> {app.goToApps()})
    //app.stage.addChild(moreAppsButton)

    let frameButton = new PIXI.Sprite.from(FrameButton)
    frameButton.x = dx/4
    frameButton.y = dx/3 + dx/2
    frameButton.width = 2*dx/2
    frameButton.height = 0.80*dx/2
    frameButton.interactive = true
    frameButton.on('pointerdown',()=> {drawFrame()})
    //app.stage.addChild(frameButton)

    let equationButton = new PIXI.Sprite.from(EquationButton)
    equationButton.x = dx/4
    equationButton.y = dx/3 + 3*dx/2
    equationButton.width = 2*dx/2
    equationButton.height = 0.80*dx/2
    equationButton.interactive = true
    equationButton.on('pointerdown',revealEquation)
    //app.stage.addChild(equationButton)

    let shuffleButton = new PIXI.Sprite.from(ShuffleButton)
    shuffleButton.x = dx/4
    shuffleButton.y = dx/3 + 4*dx/2
    shuffleButton.width = 2*dx/2
    shuffleButton.height = 0.80*dx/2
    shuffleButton.interactive = true
    shuffleButton.on('pointerdown',shuffle)
    //app.stage.addChild(shuffleButton)

    
    function checkAnswer(val){
        let answer = getNumberOfHiddenDots()
        if (val == answer){
          window.createjs.Tween.get(splat).to({alpha: 0.2},300,window.createjs.Ease.getPowInOut(4)).call(()=>{
            setTimeout(()=>{
              splat.alpha = 1
              shuffle()
            },500)
          })
        } else {
          window.createjs.Tween.get(splat).to({rotation: 2*Math.PI},500,window.createjs.Ease.getPowInOut(4)).call(()=>{
            splat.rotation = 0
          })
        }
    }


    function revealEquation(){
        if (equation) {
          showEquation = !showEquation
          let newAlpha = showEquation ? 1 : 0
          equation.forEach(e => {
              window.createjs.Tween.get(e).to({
                alpha: newAlpha
              },
              1000,
              window.createjs.Ease.getPowInOut(4)
            );
          });
        }
    }

    let lineButton = new PIXI.Sprite.from(LineButton)
    lineButton.x = dx/4
    lineButton.y = dx/3 + 2*dx/2
    lineButton.width = 2*dx/2
    lineButton.height = 0.80*dx/2
    lineButton.interactive = true
    lineButton.on('pointerdown',()=> {drawLine(balls)})
    //app.stage.addChild(lineButton)

    var splat = new PIXI.Graphics();
 

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

    function makeEquation(seq) {
      showEquation = false
      let balls = seq.reduce((sum,num)=> {return sum+num})
      let width = 50*seq.length
      let textObjects = seq.map((c)=>{
        let cs = c.toString(10)
        let t = new PIXI.Text(cs,{fontFamily: 
        "Chalkboard SE",fontSize: 50})
        return t
      })
      textObjects.forEach((o,i) => {
        o.alpha = 0
        app.stage.addChild(o)
      })
      let prevWidth = 0
      let nextX = CENTER_STAGE_X - width/2
      textObjects.forEach((o,i)=> {

        o.x = nextX
        o.y = 50
        nextX = o.x + o.width + 20

      })
      return textObjects
    }

    function getSubtractionBalls(pivot,delta){
      let a = pivot == null ? randBetween(4,10) : pivot
      let b = delta == null ? randBetween(1,a) : randBetween(1,delta+1)
      let aBalls = []
      let bBalls = []

      equation = makeEquation([a,"-",b,"=",a-b])

      for (let i = 0;i<(a-b);i++){
        let aBall = new PIXI.Sprite.from(CounterImage)
        aBalls.push(aBall)
      }

      for (let j = 0;j<b;j++){
        let bBall = new PIXI.Sprite.from(SubtractionImage)
        bBalls.push(bBall)
      }

      let allBalls = [...aBalls,...bBalls]

      for (let b of allBalls){
        makeDraggable(b)
      }
      return allBalls
    }

    function drawLine(r){
      let w = r.length * dx
      let h = dx
      r.forEach((b,i)=>{
        window.createjs.Tween.get(b).to({
          x: CENTER_STAGE_X - w/2 + i*dx,
          y: CENTER_STAGE_Y
        },
        1000,
        window.createjs.Ease.getPowInOut(4)
      );
      })
        moveSplat(BALL_STATES.LINE)
    }

    function shuffle(){
      let randomCords = randomCoordinates.generateRandomCoordinates(balls.length)
      let heightAndWidthOfCords = randomCoordinates.getHeightAndWidthOfCords(randomCords)
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
      moveSplat(BALL_STATES.RANDOM,randomCords)
    }


    function inSplat(x,y){
      let c1 = false 
      let c2 = false


      let xMin = splat.x 
      let xMax = splat.x + splat.width
      let yMin = splat.y 
      let yMax = splat.y + splat.height


      if (x < xMax && x > xMin){
        c1 = true
      }

      if (y < yMax && y > yMin){
        c2 = true
      }

      return c1 && c2
    }

    function getNumberOfHiddenDots(){
      let number = 0

    
      for (let b of balls){
        let inthesplat = inSplat(b.x+b.width/2,b.y+b.height/2)
        if (inthesplat){
          number += 1
        }
      }
      return number
    }

    function moveSplat(ballState,cords){
      switch (ballState) {
      case BALL_STATES.FRAME:
          let frameWidth = balls.length > 5 ? 5*dx : balls.length*dx
          let kX = randBetween(0,5)
          let kY = randBetween(-1,2)
          let kW = randBetween(1,5)
          let kH = randBetween(1,3)

          window.createjs.Tween.get(splat).to({
            x: CENTER_STAGE_X - frameWidth/2 + kX*dx,
            y: CENTER_STAGE_Y - dx,
            width: kW*dx,
            height: 2*dx
          },
          1000,
          window.createjs.Ease.getPowInOut(4)
        );
      break;
      case BALL_STATES.RANDOM:

          let heightAndWidthOfCords = randomCoordinates.getHeightAndWidthOfCords(cords)
          console.log()
          let i = heightAndWidthOfCords[0]
          let j = heightAndWidthOfCords[1]

          let splatWidth = dx + randBetween(0,i+1)*dx
          let splatHeight = dx + randBetween(0,j+1)*dx
          let randX = randBetween(0,i-1)*dx
          let randY= randBetween(0,j-1)*dx
          let splatX = CENTER_STAGE_X-heightAndWidthOfCords[0]/2*dx - dx/2 + randX
          let splatY = CENTER_STAGE_Y-heightAndWidthOfCords[1]/2*dx - dx/2 + randY
          
          window.createjs.Tween.get(splat).to({
            x: splatX,
            y: splatY,
            width: splatWidth,
            height: splatHeight
          },
          1000,
          window.createjs.Ease.getPowInOut(4)
        );
      break;
      case BALL_STATES.LINE: 
        let lineWidth = balls.length*dx
        let iW = randBetween(1,balls.length)
        let iH = randBetween(1,3)
        let iX = randBetween(0,balls.length)
    
        window.createjs.Tween.get(splat).to({
          x: CENTER_STAGE_X - lineWidth/2 + iX*dx,
          y: CENTER_STAGE_Y,
          height: dx,
          width: iW*dx
        },
        1000,
        window.createjs.Ease.getPowInOut(4)
     );
      break;
      default: 
          // do nothing
    }

    app.stage.addChild(splat)
  }

    function drawFrame(){
      let w = balls.length > 5 ? 5*dx : balls.length*dx
      balls.forEach((b,i)=>{
        let j = (i - i%5)/5
        window.createjs.Tween.get(b).to({
          x: CENTER_STAGE_X - w/2 + i%5*dx,
          y: CENTER_STAGE_Y - dx + j*dx
        },
        1000,
        window.createjs.Ease.getPowInOut(4)
      );
      })
      if (setup.props.type == SUBITIZER_TYPES.SPLAT){
        moveSplat(BALL_STATES.FRAME)
      }
    }

    function getPivotBalls(pivot,delta){
      let rand = randBetween(1,3)
      let pivotBalls = rand == 2 ? getSubtractionBalls(pivot,delta): getAdditionBalls(pivot,delta)
      return pivotBalls
    }

    function makeDraggable(dragMe){
      dragMe.interactive = true
      dragMe.on('pointerdown',onDragStart)
        .on('pointermove',onDragMove)
        .on('pointerup',onDragEnd)
    }

    function getSubitizationBalls(val){
      //equation = makeEquation([v])
      let nBalls = []
      for (let i = 0;i<val;i++){
        let aBall = new PIXI.Sprite.from(CounterImage)
        nBalls.push(aBall)
      }
      for (let b of nBalls){
        makeDraggable(b)
      }
      return nBalls
    }

   function shuffleArray(arr){
     let n = arr.length
     let shuffledArray = []
      for (let i = 0;i<n;i++){
        let k = randBetween(0,arr.length)
        shuffledArray.push(arr[k])
        arr.splice(k,1)
      }
      return shuffledArray
   }


    function getThreeDigitBalls(pivot,delta) {
      let a = pivot == null ? randBetween(1,10) : pivot
      let b = 10-a
      let c = randBetween(1,6)
  
      let aBalls = []
      let bBalls = []
      let cBalls = []
      let imgs = shuffleArray([CounterImage,AdditionImage,PinkBall])

      equation = makeEquation([a,"+",b,"+",c,"=",a+b+c])

      for (let i = 0;i< a;i++){
        let aBall = new PIXI.Sprite.from(imgs[0])
        aBalls.push(aBall)
      }

      for (let j = 0;j<b;j++){
        let bBall = new PIXI.Sprite.from(imgs[1])
        bBalls.push(bBall)
      }

      for (let k = 0;k<c;k++){
        let cBall = new PIXI.Sprite.from(imgs[2])
        cBalls.push(cBall)
      }


      let allBalls = [...aBalls,...bBalls,...cBalls]

      for (let b of allBalls){
        makeDraggable(b)
      }
      return allBalls
    }


    function getAdditionBalls(pivot,delta) {
      let a = pivot == null ? randBetween(1,8) : pivot
      let b = 2 + randBetween(0,9-a)
      b = delta == null ? b : randBetween(1,delta+1)
      let aBalls = []
      let bBalls = []
  

      equation = makeEquation([a,"+",b,"=",a+b])

      for (let i = 0;i< a;i++){
        let aBall = new PIXI.Sprite.from(CounterImage)
        aBalls.push(aBall)
      }

      for (let j = 0;j<b;j++){
        let bBall = new PIXI.Sprite.from(AdditionImage)
        bBalls.push(bBall)
      }

      let allBalls = [...aBalls,...bBalls]

      for (let b of allBalls){
        makeDraggable(b)
      }
      return allBalls
    }


    function includeSplat(cords){
      let heightAndWidthOfCords = randomCoordinates.getHeightAndWidthOfCords(cords)
          app.stage.removeChild(splat)
          splat.destroy(true)
          splat = new PIXI.Graphics()
          splat.beginFill(0x406cff);
          splat.x = 0
          splat.y = 0
          let splatWidth = randBetween(2,heightAndWidthOfCords[0])*dx
          let splatHeight = randBetween(2,heightAndWidthOfCords[1])*dx
          let splatX = CENTER_STAGE_X-heightAndWidthOfCords[0]/2*dx - dx/2
          let splatY = CENTER_STAGE_Y-heightAndWidthOfCords[1]/2*dx - dx/2
          splat.drawRect(0,0,splatWidth,splatHeight)
          window.createjs.Tween.get(splat).to({
            x: splatX,
            y: splatY
          },
          1000,
          window.createjs.Ease.getPowInOut(4)
        );
          revealEquation()
          makeDraggable(splat)
          splat.isSplat = true
          splat.interactive = true
          app.stage.addChild(splat)
    }

 
    function newShape(val){
        //this.interactive = false
        destroy(balls)
        balls = getSubitizationBalls(val)
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


            includeSplat(randomCords)


        for (let i = 0;i<randomCords.length;i++){
            let cord = randomCords[i]
            window.createjs.Tween.get(balls[i]).to({
                  x: CENTER_STAGE_X + (cord[0]-heightAndWidthOfCords[0]/2)*dx - dx/2,
                  y: CENTER_STAGE_Y  + (cord[1]-heightAndWidthOfCords[1]/2)*dx - dx/2
                },
                1000,
                window.createjs.Ease.getPowInOut(4)
              )
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

        if (this.isSplat){
          let newAlpha = this.alpha == 1 ? 0.35 : 1
          this.alpha = newAlpha
        }
      }

      function onDragEnd() {
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

      function load(){

      }


      function loadGame(val){
        newShape(val)
      }

    let keypad = new Keypad(50)
    keypad.doSomething = (val)=> checkAnswer(val)
    app.stage.addChild(keypad)
    keypad.load()
    keypad.draw(targetValue)
    keypad.x = window.innerWidth/2 - keypad.width/2
    keypad.y = keypad._height

    loadGame(targetValue)

}
