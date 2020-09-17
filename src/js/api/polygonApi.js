// Problem que setup
import * as PIXI from "pixi.js";



export class Draggable extends PIXI.Sprite {
  constructor(texture){
    super()
    this.dragged = false
    this.touching = false
    this.interactive = true
    this.lockX = false 
    this.lockY = false
    this.texture = texture
    this.on('pointerdown',this.pointerDown)
    this.on('pointermove',this.pointerMove)
    this.on('pointerup',this.pointerUp)
    this.on('pointerupoutside',this.pointerUpOutside)
  }

  pointerDown(event){
    console.log("Draggable Pointer Down")
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
  }
  
  pointerUpOutside(event){
    this.touching = false
  }
}

export function distance(a,b){
  let dx = a[0] - b[0]
  let dy = a[1] - b[1]
  let dx2 = dx*dx 
  let dy2 = dy*dy
  return Math.sqrt(dx2+dy2)
}


export class DraggablePoly extends Draggable {
  constructor(points,app){


    let xS = points.map(p=> p[0])
    let yS = points.map(p=> p[1])
    let minX = Math.min(...xS)
    let minY = Math.min(...yS)

    let flatPolygon = []
    points.forEach(p=>{
      flatPolygon.push(p[0]-minX)
      flatPolygon.push(p[1]-minY)
    })
    let DUMMY = 100
    let a = polygonArea(points)/DUMMY
    let f = decimalToFrac(a)
   
    var graphics = new PIXI.Graphics();
    graphics.beginFill(0xff3b55);
    graphics._fillStyle.alpha = 0.85
    graphics.lineStyle(2,0xffffff)
    graphics.drawPolygon(flatPolygon);
    graphics.endFill();

    var graphicsB = new PIXI.Graphics();
    graphicsB.beginFill(0x1291db);
    graphicsB._fillStyle.alpha = 0.85
    graphicsB.lineStyle(2,0xffffff)
    graphicsB.drawPolygon(flatPolygon);
    graphicsB.endFill();

    let t = app.renderer.generateTexture(graphics)
    let tb = app.renderer.generateTexture(graphicsB)
 
    // Construct Super
    super(t)

    this.hitArea = new PIXI.Polygon(flatPolygon)
    this.points = points
    this.textureA = t
    this.textureB = tb
    this.rotated = false
    this.pivot.x = this.width/2
    this.pivot.y = this.height/2
    this.x = minX + this.width/2
    this.y = minY + this.height/2
    this.interactive = true
    this.on('pointerdown',this.polyPointerDown)
    this.on('pointerup',this.polyPointerUp)
    this.on('pointermove',this.polyPointerMove)
    this.on('pointerleave',this.polyPointerLeave)
  }

  polyPointerLeave(){
  }

  
  polyPointerDown(){
  
  }

  polyPointerMove(){
   
  }

  // Extracts the global location of the points from the hit area.
  getPolyPoints(){
    let w = this.width 
    let h = this.height
    let originX = this.x - this.width/2
    let originY = this.y - this.height/2
    let xS = []
    let yS = []

    // Extract x and y
    this.hitArea.points.forEach((e,i)=>{
    if (i%2 == 1){
        yS.push(e)
      } else {
        xS.push(e)
      }
    })

    // Zip x and y
    let polyPoints = xS.map((x,i) =>{
      return [x,yS[i]]
    })

    // Rotate
    polyPoints = polyPoints.map(p=>{return rotatePoint(p[0]-this.width/2,p[1]-this.height/2,this.rotation)})
    // Offset
    polyPoints = polyPoints.map(p=>{return [p[0]+originX+this.width/2,p[1]+originY+this.height/2]})

    return polyPoints
  }

  // I don't think I need this here.
  polyPointerUp(){
    this.getPolyPoints()
  }
}


export function polygonArea(poly) {
  let xS = poly.map(p => p[0])
  let yS = poly.map(p => p[1])

   // Calculate value of shoelace formula 
   let n = poly.length
   let j = n - 1 
   let area = 0
   for (let i = 0; i < n; i++) { 
       area = area + (xS[j] + xS[i]) * (yS[j] - yS[i]);
       j = i;  // j is previous vertex to i 
   } 
 
   // Return absolute value (why over 2?)
   return Math.abs(area / 2)
} 

// Lines & Polygons

export function linesIntersect(l1,l2){
  let m1 = l1.m
  let m2 = l2.m 
  let b1 = l1.b
  let b2 = l2.b

  if (l1.vertical && l2.vertical){
    return false
  } else if (l1.horizontal && l2.horizontal){
    return false
  } else {

    let xIntersect = (b1 - b2)/(m2-m1)
    let yIntersect = null

    if (l1.vertical){ 
      yIntersect = l2.yOf(l1.x1)
      xIntersect = l1.x1
    } else if (l2.vertical){

      yIntersect = l1.yOf(l2.x1)
      xIntersect = l2.x1
    } else {
      yIntersect = l1.yOf(xIntersect)
    }

    // Chopping off decimals.
    yIntersect = Math.trunc(yIntersect*1000)/1000
    xIntersect = Math.trunc(xIntersect*1000)/1000


    // Padding 
    let p = -5
    let inYRange1 = l1.horizontal ? true : (yIntersect > l1.yMin+p) && (yIntersect < l1.yMax-p)
    let inXRange1 = l1.vertical ? true : (xIntersect > l1.xMin+p) && (xIntersect < l1.xMax-p)
    let inYRange2 = l2.horizontal ? true : (yIntersect > l2.yMin+p) && (yIntersect <= l2.yMax-p)
    let inXRange2 = l2.vertical ? true : (xIntersect > l2.xMin+p) && (xIntersect < l2.xMax-p)

    //console.log("inYRange1,inXRange1,inYRange2,inXRange2",inYRange1,inXRange1,inYRange2,inXRange2)

    return (inXRange1 && inXRange2 && inYRange1 && inYRange2) && [xIntersect, yIntersect]
  } 
}

class Line {
  constructor(p1,p2){
    this.start = p1 
    this.end = p2
    this.x1  = p1[0]
    this.y1 = p1[1]
    this.x2  = p2[0]
    this.y2 = p2[1]

    this.yMax = Math.max(this.y1,this.y2)
    this.yMin = Math.min(this.y1,this.y2)
    this.xMax = Math.max(this.x1,this.x2)
    this.xMin = Math.min(this.x1,this.x2)

    this.p1 = p1
    this.p2 = p2

    this.m = (this.y2-this.y1)/(this.x2-this.x1)

    // Relaxed this criteria because its need for really steep lines (the ones for grid nodees were almost perfect so it didn't matter)
    this.vertical = Math.abs(this.m) > 100 ? true : false 
    this.horizontal = Math.abs(this.m) < 0.01 ? true : false

    this.b = this.vertical ? null : this.y1 - this.m*this.x1

  }

  yOf(x){
    return this.m*x+this.b
  }

  xOf(y){
    return (y-this.b)/this.m
  }
}

function lineContains(line,p){
  // Tolerance
  let x = p[0]
  let y = p[1]
  let t = 0.001
  if (line.vertical){
    if (appxEq(line.x1,x,t)){
      if (y>line.yMin && y < line.yMax) {
        return true
      }
    }
  } else if (line.horizontal){
    if (appxEq(line.y1,y,t)){
      if (x>line.xMin && x < line.xMax) {
        return true
      }
    }
  } else if (appxEq(line.yOf(x),y,t)) {
      let inXRange = x > line.xMin && x < line.xMax
      let inYRange = y > line.yMin && y < line.yMax
      if (inXRange && inYRange){
        return true
      }
  } else {
    return false
  }
}

export function getIntersectionPoints(lineEndPoints,polyPoints){
  let line = new Line(lineEndPoints[0],lineEndPoints[1]) // Line
  let lines = getLinesFromPoly(polyPoints) // Array of Lines

  let intersectionPoints = []

  lines.forEach((l,i) => {
      let intersectionPoint = linesIntersect(l,line)
      intersectionPoints.push(intersectionPoint)
  })

  let filtered = intersectionPoints.filter(e=> e != false)
  let deduped = removeDuplicatePoints(filtered,5)
  
  return deduped
}

export function getLinesFromPoly(poly){
  let n = poly.length
  let lines = poly.map((p,i)=>{
   // console.log("making a line")
    return new Line(p,poly[(i+1)%n])
  })
  return lines
}

export function splitMultiplePolygons(line,polys){
  let newPolys  = []
  polys.forEach(p=>{
    // Returns original polygon if it can't be split.
    let splitPoly = splitPolygon(line,p)
    newPolys.push(...splitPoly)
  })
  return newPolys
}


export function pointsApproximatelyEqual(points,tolerance){
  return distance(points[0],points[1]) < tolerance
}

export function removeDuplicatePoints(points,tolerance){
  let removed = []
  points.forEach(p=>{
    let addMe = true
    removed.forEach(r=>{
      if (pointsApproximatelyEqual([p,r],tolerance)){
        addMe = false
      }
    })
    if (addMe){
      removed.push(p)
    }
  })
  return removed
}


export function splitPolygon(line,poly) {

  // Make the array of lines.
  let lines = getLinesFromPoly(poly)

  // Check to make sure it was a valid cut.
  let points = getIntersectionPoints(line,poly)
  if (points.length < 2){
    return [poly]
  }

  let primaryPoly = []
  let secondaryPoly = []
  let primary = true
  let cutter = new Line(line[0],line[1])

  lines.forEach((l,i) => {
      let intersect = linesIntersect(l,cutter)
       if (primary){
         primaryPoly.push(l.start)
       } else {
         secondaryPoly.push(l.start)
       }

       if (intersect){
         if (pointsApproximatelyEqual([intersect,l.end],5)){
         } else {
           primaryPoly.push(intersect)
           secondaryPoly.push(intersect)
           primary = !primary
         }
       }
  })
  let primaryPolyDeduped = removeDuplicatePoints(primaryPoly,5)
  let secondaryPolyDeduped = removeDuplicatePoints(secondaryPoly,5)

  return [primaryPolyDeduped,secondaryPolyDeduped]
}

export function distanceFromNearestNode(x,y,dxy){
  let deltaX = Math.abs(Math.round(x/dxy)*dxy-x)
  let deltaY = Math.abs(Math.round(y/dxy)*dxy-y)
  let distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY)
  return distance
}

export function rotatePoint(x,y,theta){
  let _x = x*Math.cos(theta) - y*Math.sin(theta)
  let _y = y*Math.cos(theta) + x*Math.sin(theta)
  return [_x,_y]
}

export function getIndexOfNearestVertice(vertices,dxy){
  let distance = 100000
  let index = null
  vertices.forEach((v,i)=>{
    let x = v[0]
    let y = v[1]
    let newDistance = distanceFromNearestNode(x,y,dxy)
    if (newDistance <  distance){
      index = i
      distance = newDistance
    }
  })
  return index
}

export function getNearestNodeMetadata(nodes,point){
  let d = 1000000
  let nearestMetadata = {}
  nodes.forEach((n,i)=>{
    let x = n.x
    let y = n.y
    let newDistance = distance([x,y],point)
    //console.log("points",n.x,n.y,point[0],point[1])
    if (newDistance <  d){
      d = newDistance
      nearestMetadata.dx = point[0] - x 
      nearestMetadata.dy = point[1] - y
      nearestMetadata.distance = newDistance
    }
  })
  return nearestMetadata
}
