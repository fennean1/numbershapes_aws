import * as PIXI from "pixi.js-legacy";
import blueGradient from "../assets/blue-gradient.png";
import MagnifyingGlass from "../assets/MagnifyingGlass.png";
import * as CONST from "./const.js";
import {
  TweenLite,TimelineLite
} from "gsap";
import {ArrayModel, Axis, digitCount, KHNumberline, MathFactPrompt} from "./api_kh.js";

import {TWO_DIGIT_ADDITION_UNDER_100} from "./problemSets.js"

export const init = (app, setup) => {

const loader = PIXI.Loader.shared; // PixiJS exposes a premade instance for you to use.
const sprites = {};
const renderer = app.renderer

// Load Images
loader.add('backGround', 'https://res.cloudinary.com/duim8wwno/image/upload/v1609776412/Spotlight%20Game/SpotlightBackground.svg')
loader.add('descriptor', 'https://res.cloudinary.com/duim8wwno/image/upload/v1609778182/Spotlight%20Game/SpotlightDescriptor_zlj6ho.svg')
loader.add('rig', 'https://res.cloudinary.com/duim8wwno/image/upload/v1609944696/Spotlight%20Game/Rig_ux5kku.svg')
loader.add('descriptorFront', 'https://res.cloudinary.com/duim8wwno/image/upload/v1609945515/Spotlight%20Game/DescriptorFront_wd0gi1.svg')
loader.add('descriptorBack', 'https://res.cloudinary.com/duim8wwno/image/upload/v1609945578/Spotlight%20Game/DescriptorBack.svg')
loader.add('canLights', 'https://res.cloudinary.com/duim8wwno/image/upload/v1609945515/Spotlight%20Game/CanLights_comxky.svg')
loader.add('spotLight', 'https://res.cloudinary.com/duim8wwno/image/upload/v1609946946/Spotlight%20Game/Spotlight_pfn09v.svg')
loader.add('litCanLights','https://res.cloudinary.com/duim8wwno/image/upload/v1610029224/Spotlight%20Game/litCanLights_luaodi.svg')



// Assign to sprite object.
loader.load((loader, resources) => {
    sprites.backGround = resources.backGround.texture
    sprites.descriptor = resources.descriptor.texture
    sprites.rig = resources.rig.texture
    sprites.descriptorBack = resources.descriptorBack.texture
    sprites.descriptorFront = resources.descriptorFront.texture
    sprites.canLights = resources.canLights.texture
    sprites.litCanLights = resources.litCanLights.texture
    sprites.spotLight = resources.spotLight.texture
});


  // Layout Vars
  let window_width = setup.width
  let window_height = setup.height
  let window_frame = {width: window_width,height: window_height}
  
  // Problem Set
  let P = {
    problemSet: TWO_DIGIT_ADDITION_UNDER_100,
    currentIndex: 0,
  }


  // localtState

  let S = {}


  const sampleQuestionOne = {
    fact: {
      operation: "+",
      a: 43,
      b: 38,
      answer: 81
    },
    numberlineState: {
      min: 0,
      max: 150,
      minorStep: 10,
      majorStep: 50,
      denominator: 1,
      length: window_width,
    }
  }
    

  // Animation 
  let spotLightFlashTimelineRight = new TimelineLite({paused: true})
  let spotLightFlashTimelineLeft = new TimelineLite({paused: true})


  // Should be updated any time a change is made on the screens


 // View
  let V = {}

// Model
  let M = {
    frame: {width: setup.width,height: setup.height},
    features: setup.features,
    backGround: true,
    grid: {
      width: 10,
      height: 10,
      x: 4,
      y: 5,
    },
    axis: {
      yState: {
        min: 0,
        max: 10,
      },
      xState: {
        min: 0,
        max: 10,
      }
    },
    objects: {}
  }


  // Objects


  function backgroundPointerDown(e) {
    this.touching = true 
    S.spotLightX = e.data.global.x
    drawSpotlight()
  }

  function backgroundPointerMove(e) {
    if (this.touching){
      S.spotLightX = e.data.global.x
     drawSpotlight()
     this.dragged = true
    } 
  }
  function backgroundPointerUp(e){
    this.touching = false
  }

  function spotLightPointerDown(){

    let {answer} = P.problemSet[P.currentIndex].fact

    if (answer < this.max && answer > this.min ){
      S.spotLightColor = 0xfff200
    
      drawSpotlight(S.spotLightX)
   
      V.prompt.text = answer
      let answerPosition = V.numberline.getPositionFromVal(answer)

      const digits = digitCount(answer)

      TweenLite.to(V.prompt,{duration: 1,width: 25*digits,height:50,x: answerPosition,y: V.numberline.y+ V.numberline.majorTickHeight,ease: 'bounce'})

      setTimeout(()=>{
        P.currentIndex += 1
        loadProblem(P.problemSet[P.currentIndex])
      },3000)


    } else if (answer < this.min) {
      spotLightFlashTimelineLeft.kill()
      spotLightFlashTimelineLeft.restart()
    } else if (answer > this.max){
      spotLightFlashTimelineRight.kill()
      spotLightFlashTimelineRight.restart()
    }


  }


  function drawSpotlight(){

    const x = S.spotLightX
    const sR = window_width*P.problemSet[P.currentIndex].spotlight.width
    const yAnch = V.spotLight.y + V.spotLight.height


    V.spotLight.min = V.numberline.getValFromPosition(x-sR)
    V.spotLight.max = V.numberline.getValFromPosition(x+sR)

    let dy = V.numberline.y-V.spotLight.y
    let dx = window_width/2 - x 
    const angle = Math.atan(dx/dy)

    const canRatio = (V.spotLight.width/2)/(V.spotLight.height*0.85)
    const canAngle = Math.atan(canRatio)
  
    const canRightX = V.spotLight.x - V.spotLight.height*Math.sin(angle-canAngle)
    const canRightY = V.spotLight.y + V.spotLight.height*Math.cos(angle-canAngle)
    const canLeftX = V.spotLight.x - V.spotLight.height*Math.sin(angle+canAngle)
    const canLeftY = V.spotLight.y + V.spotLight.height*Math.cos(angle+canAngle)


    V.spotLight.angle = angle*180/Math.PI

    V.numberline.highlight([x-sR,x+sR])

    V.shine.clear()
    V.shine.beginFill(S.spotLightColor,0.5)
    V.shine.moveTo(canLeftX,canLeftY)
    V.shine.lineTo(x-sR,window_height*3/4)
    V.shine.lineTo(x+sR,window_height*3/4)
    V.shine.lineTo(canRightX,canRightY)
    V.shine.lineTo(canLeftX,canLeftY)
    V.shine.drawEllipse(x,window_height*3/4,sR,sR/10)
  }

  function loadProblem(p){
    V.prompt.text = "" + p.fact.a +" "+ p.fact.operation + " " + p.fact.b 
    V.prompt.style.fontSize = V.descriptorBack.height
    V.prompt.x = window_width/2
    V.prompt.y = V.descriptorFront.height/2
    V.prompt.width = 7*V.prompt.style.fontSize/2
    V.prompt.height = V.prompt.style.fontSize


    S.spotLightX = window_width/2
    S.spotLightColor = 0xfc45eff
    drawSpotlight()



    V.numberline.state = p.numberlineState
    V.numberline.draw()

  }

  // Called on resize
  let execute;
  function resize(newFrame) {
  clearTimeout(execute);
  execute = setTimeout(()=>{
      draw(newFrame)
    },500);
  }

  function draw(newFrame){
    M.frame = newFrame
    app.renderer.resize(newFrame.width,newFrame.height)
    V.backGround.width = newFrame.width
    V.backGround.height = newFrame.height
  }

  // Loading Script
  function load() {
     
      S.spotLightColor = 0xfc45eff
  
      V.backGround = new PIXI.Sprite(sprites.backGround)
      V.backGround.interactive = true
      V.backGround.width = window_frame.width
      V.backGround.height = window_frame.height

        
      V.rig= new PIXI.Sprite(sprites.rig)
      V.rig.anchor.set(0.5,0)
      V.rig.width = window_frame.width
      V.rig.height = V.rig.width /5
      V.rig.x = window_frame.width/2

           
      V.leftCanLights= new PIXI.Sprite(sprites.canLights)
      V.leftCanLights.anchor.set(0,0.5)
      V.leftCanLights.width = window_frame.width/6
      V.leftCanLights.height = V.leftCanLights.width/3.5
      V.leftCanLights.x = 0
      V.leftCanLights.y = V.rig.height*3/5

             
      V.rightCanLights= new PIXI.Sprite(sprites.canLights)
      V.rightCanLights.anchor.set(1,0.5)
      V.rightCanLights.width = window_frame.width/6
      V.rightCanLights.height = V.rightCanLights.width/3.5
      V.rightCanLights.x = window_frame.width
      V.rightCanLights.y = V.rig.height*3/5

      V.leftCanLightsLit= new PIXI.Sprite(sprites.litCanLights)
      V.leftCanLightsLit.alpha = 0
      V.leftCanLightsLit.anchor.set(0,0.5)
      V.leftCanLightsLit.width = window_frame.width/6
      V.leftCanLightsLit.height = V.leftCanLightsLit.width/3.5
      V.leftCanLightsLit.x = 0
      V.leftCanLightsLit.y = V.rig.height*3/5

                 
      V.rightCanLightsLit= new PIXI.Sprite(sprites.litCanLights)
      V.rightCanLightsLit.alpha = 0
      V.rightCanLightsLit.anchor.set(1,0.5)
      V.rightCanLightsLit.width = window_frame.width/6
      V.rightCanLightsLit.height = V.rightCanLightsLit.width/3.5
      V.rightCanLightsLit.x = window_frame.width
      V.rightCanLightsLit.y = V.rig.height*3/5

            

      V.descriptorFront = new PIXI.Sprite(sprites.descriptorFront)
      V.descriptorFront.anchor.set(0.5,0)
      V.descriptorFront.width = window_frame.width/2
      V.descriptorFront.height = V.descriptorFront.width /4
      V.descriptorFront.x = window_frame.width/2


      V.descriptorBack = new PIXI.Sprite(sprites.descriptorBack)
      V.descriptorBack.anchor.set(0.5,0.5)
      V.descriptorBack.width = V.descriptorFront.width*0.87
      V.descriptorBack.height = V.descriptorBack.width * 0.10
      V.descriptorBack.x = window_frame.width/2
      V.descriptorBack.y = V.descriptorFront.height

      let textureRatio = sprites.spotLight.height/sprites.spotLight.width
      V.spotLight= new PIXI.Sprite(sprites.spotLight)
      V.spotLight.anchor.set(0.5,0)
      V.spotLight.width = window_frame.width/20
      V.spotLight.height = V.spotLight.width * textureRatio
      V.spotLight.y = V.descriptorBack.y - V.descriptorBack.height/2
      V.spotLight.x = window_frame.width/2
      V.spotLight.angle = 45

      // Animations 
      spotLightFlashTimelineRight.to(V.rightCanLightsLit,{alpha: 1,duration: 0.25})
      spotLightFlashTimelineRight.to(V.rightCanLightsLit,{alpha: 0,duration: 0.25})
      spotLightFlashTimelineRight.to(V.rightCanLightsLit,{alpha: 1,duration: 0.25})
      spotLightFlashTimelineRight.to(V.rightCanLightsLit,{alpha: 0,duration: 0.25})

      spotLightFlashTimelineLeft.to(V.leftCanLightsLit,{alpha: 1,duration: 0.25})
      spotLightFlashTimelineLeft.to(V.leftCanLightsLit,{alpha: 0,duration: 0.25})
      spotLightFlashTimelineLeft.to(V.leftCanLightsLit,{alpha: 1,duration: 0.25})
      spotLightFlashTimelineLeft.to(V.leftCanLightsLit,{alpha: 0,duration: 0.25})


      V.spotLight.interactive = true 
      V.spotLight.on('pointerdown',spotLightPointerDown)



      V.shine = new PIXI.Graphics()


      V.backGround.on('pointerdown',backgroundPointerDown)
      V.backGround.on('pointermove',backgroundPointerMove)
      V.backGround.on('pointerup',backgroundPointerUp)


      V.numberline = new KHNumberline(P.problemSet[P.currentIndex].numberlineState,renderer,window_frame)
      V.numberline.y = window_height*3/4


      V.prompt = new PIXI.Text()
      V.prompt.style.fill = 0xffffff 
      V.prompt.anchor.set(0.5,0.5)
      V.prompt.x = window_width/2
      V.prompt.y = V.descriptorFront.height/2


      // Layering
      app.stage.addChild(V.backGround)
      app.stage.addChild(V.rig)
      app.stage.addChild(V.descriptorBack)
      app.stage.addChild(V.spotLight)
      app.stage.addChild(V.shine)
      app.stage.addChild(V.descriptorFront)
      app.stage.addChild(V.prompt)
      app.stage.addChild(V.numberline)
      app.stage.addChild(V.leftCanLights)
      app.stage.addChild(V.rightCanLights)
      app.stage.addChild(V.leftCanLightsLit)
      app.stage.addChild(V.rightCanLightsLit)

      loadProblem(P.problemSet[P.currentIndex])


    //draw(S.frame)
  }




  // Call load script
  loader.onComplete.add(load); // called once when the queued resources all load.

  // Not sure where else to put this.
  app.resize = (frame) => resize(frame);

};


