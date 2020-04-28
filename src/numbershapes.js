let PI = Math.PI;
let COS_60 = Math.cos(PI / 6);
let SIN_60 = Math.sin(PI / 6);
let SIN_45 = Math.sin(PI / 4);

export const ONE = (r) => {
  let a = { x: 0, y: 0 };
  return [a];
};
export const TWO = (r) => {
  let a = { x: 0, y: 0 };
  let b = { x: 0, y: 2 * r };
  return [a, b];
};

export const THREE = (r) => {
  let h = 2 * r;
  let off = h*SIN_60
  let a = { x: 0, y: 0 };
  let b = { x: -h * SIN_60, y: h * COS_60 };
  let c = { x: h * SIN_60, y: h * COS_60 };
  let vals = [a, b, c]
  let offsetVals = vals.map(v=>{
      return {x: v.x + off,y: v.y}
    })
  return offsetVals;
};

export const FOUR = (r) => {
  let h = 2 * r;
  let a = { x: 0, y: 0 };
  let b = { x: 0, y: h };
  let c = { x: h, y: 0 };
  let d = { x: h, y: h };
  return [a, b, c, d];
};

export const FIVE = (r) => {
  let h = 2 * r;
  let w = h / SIN_45;
  let a = { x: 0, y: 0 };
  let b = { x: 0, y: w };
  let c = { x: w, y: 0 };
  let d = { x: w, y: w };
  let e = { x: h * SIN_45, y: h * SIN_45 };
  return [a, b, c, d, e];
};

export const SIX = (r) => {
  let h = 2 * r;
  let w = h / SIN_45;
  let a = { x: 0, y: 0 };
  let b = { x: 0, y: h };
  let c = { x: 0, y: 2 * h };
  let d = { x: h, y: 0 };
  let e = { x: h, y: h };
  let f = { x: h, y: 2 * h };
  return [a, b, c, d, e, f];
};

export const SEVEN = (r) => {
  let h = 2 * r;
  let off = h*SIN_60
  let a = { x: 0, y: 0 };
  let b = { x: h, y: 0 };
  let c = { x: -h * SIN_60, y: h * COS_60 };
  let d = { x: h * SIN_60, y: h * COS_60 };
  let e = { x: 3 * h * SIN_60, y: h * COS_60 };
  let f = { x: 0, y: 2 * h * COS_60 };
  let g = { x: h, y: 2 * h * COS_60 };
  let vals = [a, b, c, d, e, f, g]
  let offsetVals = vals.map(v=>{
      return {x: v.x + off,y: v.y}
    })

console.log("SEVEN",offsetVals)

  return offsetVals;
};

export const EIGHT = (r) => {
  let hyp = 2 * r;
  let a = { x: 0, y: 0 };
  let b = { x: hyp, y: 0 };
  let c = { x: 2 * hyp, y: 0 };
  let d = { x: hyp * SIN_60, y: hyp * COS_60 };
  let e = { x: 3 * hyp * SIN_60, y: hyp * COS_60 };
  let f = { x: 0, y: 2 * hyp * COS_60 };
  let g = { x: hyp, y: 2 * hyp * COS_60 };
  let h = { x: 2 * hyp, y: 2 * hyp * COS_60 };

  return [a, b, c, d, e, f, g, h];
};

export const NINE = (r) => {
  let hyp = 2 * r;
  let a = { x: 0, y: 0 };
  let b = { x: hyp, y: 0 };
  let c = { x: 2 * hyp, y: 0 };
  let d = { x: 0, y: hyp };
  let e = { x: hyp, y: hyp };
  let f = { x: 2 * hyp, y: hyp };
  let g = { x: 0, y: 2 * hyp };
  let h = { x: hyp, y: 2 * hyp };
  let i = { x: 2 * hyp, y: 2 * hyp };
  return [a, b, c, d, e, f, g, h, i];
};

export const TEN = (r) => {
  let hyp = 2 * r;
  let hSIN_60 = hyp * SIN_60;
  let hCOS_60 = hyp * COS_60;
  let off = 3*hSIN_60

  let a = { x: 0, y: 0 };

  let b = { x: -hSIN_60, y: hCOS_60 };
  let c = { x: hSIN_60, y: hCOS_60 };

  let d = { x: -2 * hSIN_60, y: 2 * hCOS_60 };
  let e = { x: 0, y: 2 * hCOS_60 };
  let f = { x: 2 * hSIN_60, y: 2 * hCOS_60 };

  let g = { x: -3 * hSIN_60, y: 3 * hCOS_60 };
  let h = { x: -hSIN_60, y: 3 * hCOS_60 };
  let i = { x: hSIN_60, y: 3 * hCOS_60 };
  let j = { x: 3 * hSIN_60, y: 3 * hCOS_60 };
  let vals = [a, b, c, d, e, f, g, h, i, j];
  let offsetVals = vals.map(v=>{
      return {x: v.x + off,y: v.y}
    })

 console.log("ten",offsetVals)

  return offsetVals;
};

export const getWidthAndHeightOfNumberShape = (shape,r)=>{
    let h = 2*r 
    let xS = shape.map(s=>s.x)
    let yS = shape.map(s=>s.y)
    let maxX = Math.max(...xS)
    let maxY = Math.max(...yS)
    let width = maxX + r 
    let height = maxY + r
    return {width: width,height: height}
}

export const NUMBERSHAPES = {
  1: ONE,
  2: TWO,
  3: THREE,
  4: FOUR,
  5: FIVE,
  6: SIX,
  7: SEVEN,
  8: EIGHT,
  9: NINE,
  10:TEN,
};
