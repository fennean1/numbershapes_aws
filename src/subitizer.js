// Problem que setup
import * as PIXI from "pixi.js";
import * as randomCoordinates from "./randomCoordinates.js"
import Clouds from "./assets/Clouds.png";
import BlueBall from "./assets/BlueBall.png";
import NewShapeButton from './assets/NewShapeButton.png'

export const init  = (app, setup) => {
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

    // Init Balls
    for (let i = 0; i<10;i++) {
        let ball = new PIXI.Sprite.from(BlueBall)
        ball.interactive = true
        ball.on('pointerdown',onDragStart)
            .on('pointermove',onDragMove)
            .on('pointerup',onDragEnd)
        ball.width = dx 
        ball.height = dx
        ball.x = -dx
        ball.y = -dx
        balls.push(ball)
        app.stage.addChild(ball)
    }

    let newShapeButton = new PIXI.Sprite.from(NewShapeButton)
    newShapeButton.x = dx/4
    newShapeButton.y = dx/4
    newShapeButton.width = 5*dx/2 
    newShapeButton.height = dx/2
    newShapeButton.interactive = true
    newShapeButton.on('pointerdown',newShape)
    app.stage.addChild(newShapeButton)

    function newShape(){
        //app.help()
        let randValue =  4 + Math.floor(Math.random() * (6));
        let randomCords = randomCoordinates.generateRandomCoordinates(randValue)
        let heightAndWidthOfCords = randomCoordinates.getHeightAndWidthOfCords(randomCords)

    for (let b of balls){
        window.createjs.Tween.get(b).to({
              x: -dx,
              y: -dx
            },
            1000,
            window.createjs.Ease.getPowInOut(4)
          );
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
