import * as PIXI from "pixi.js-legacy";
import * as CONST from "./const.js";
import { TweenLite } from "gsap";
import {
  Sketcher,
  Sketcher2
} from "./sketcher.js";

export const init = (app, setup) => {

   const dS = {
     annotations: [],
   }

    const App = {
      R: app.renderer,
      S: dS,
      T: {},
      L: {},
      V: {},
      C: {}
    }

    App.L.window_width = setup.width 
    App.L.window_height = setup.height

    const loader = PIXI.Loader.shared

    // Load Images
    loader.add('backGround', 'https://res.cloudinary.com/duim8wwno/image/upload/v1607622190/blue-gradient_un84kq.png')
    loader.add('minus', 'https://res.cloudinary.com/duim8wwno/image/upload/v1607622190/MinusButton_snfs15.png')
    loader.add('plus', 'https://res.cloudinary.com/duim8wwno/image/upload/v1607622190/PlusButton_cxghiq.png')
    loader.add('trash', 'https://res.cloudinary.com/duim8wwno/image/upload/v1610110971/Trash_lryrwg.png')
    loader.add('edit', 'https://res.cloudinary.com/duim8wwno/image/upload/v1607622188/EditIcon_ixof8l.png')
    loader.add('openBrush', 'https://res.cloudinary.com/duim8wwno/image/upload/v1610397628/Painting%20Circles/openBrush_pfkuxn.png')
    loader.add('closedBrush', 'https://res.cloudinary.com/duim8wwno/image/upload/v1610397810/Painting%20Circles/closedBrush_zwn9p6.png')
    loader.add('incrementOneBtn', 'https://res.cloudinary.com/duim8wwno/image/upload/v1611509432/Painting%20Circles/IncrementOneBtn_m5gm2g.png')
    
    
    // Assign to sprite object.
    loader.load((loader, resources) => {
        App.T.backGround = resources.backGround.texture
        App.T.minus = resources.minus.texture
        App.T.plus = resources.plus.texture
        App.T.edit = resources.edit.texture
        App.T.trash = resources.trash.texture
        App.T.openBrush = resources.openBrush.texture
        App.T.closedBrush = resources.closedBrush.texture
        App.T.incrementOneBtn = resources.incrementOneBtn.texture
    });

    function objectPointerUp(){
      this.parent.removeChild(this)
      this.destroy(true)
      const i = App.S.annotations.indexOf(this)
      App.S.annotations.splice(i,1)
      App.S.annotations.forEach(a=>{
        console.log("poop")
      })
      console.log("annotations",App.S.annotations)
      console.log("appchildren",app.stage.children)
      console.log("this",this)
    }

  App.C.addAnnotation = sprite => {
    sprite.on("pointerup",objectPointerUp)
    App.S.annotations.push(sprite)
    app.stage.addChild(sprite)
  }

  // Loading Script
  function load(state) {

    // Need to restructure to more efficiently extract state
    const initStateSketcher = {
      strokeWidth: 5,
      startColor: 0xffffff,
      paths: [],
    }

    App.V.sketcher = new Sketcher(initStateSketcher,App)
    app.stage.addChild(App.V.sketcher)

  }

  // Call load script
  loader.onComplete.add(load)

};
