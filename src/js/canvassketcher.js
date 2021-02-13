
export function run(setup){

var canvas = setup.canvas
var ctx;
var prev = {x:0,y:0}
var curr = {x:0,y:0}
var hole = {x:0,y:0}


    function init() {
        canvas.width = setup.width 
        canvas.height = setup.height
        canvas.addEventListener("touchstart",  function(event) {event.preventDefault()})
        canvas.addEventListener("touchmove",   function(event) {event.preventDefault()})
        canvas.addEventListener("touchend",    function(event) {event.preventDefault()})
        canvas.addEventListener("touchcancel", function(event) {event.preventDefault()})

        ctx = canvas.getContext("2d");
    
        canvas.addEventListener("pointermove", pointerMove);
        canvas.addEventListener("pointerdown", pointerDown);
        canvas.addEventListener("pointerup", pointerUp);
        canvas.addEventListener("pointerout", pointerOut);
    }
    
    let i = 0
    function pointerDown(e){
        this.touching = true
        hole = {x: e.x, y:e.y}
        prev = hole
        curr = prev
    }

    function pointerMove(e){
      if (this.touching){
        i++
        hole = prev
        prev = curr
        curr = {x: e.x, y:e.y}
        if (i%2 == 0){
            ctx.beginPath();
            ctx.moveTo(hole.x, hole.y);
            //console.log("hole,prev,curr",hole,prev,curr)
            ctx.bezierCurveTo(hole.x,hole.y,prev.x,prev.y,curr.x,curr.y);
            ctx.stroke();
        }
      }
    }

    function pointerUp(){
        this.touching = false
    }

    function pointerOut(){
        this.touching = false
    }
   

    init()
}