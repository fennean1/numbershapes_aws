export const normalizeCords = cords => {
  console.log("cords",cords)
  let xCords = cords.map((c)=>{return c[0]})
  let yCords = cords.map((c)=>{return c[1]})
  console.log("xCords",xCords)
  console.log("yCords",yCords)
  let xMax = Math.max(...xCords)
  let xMin = Math.min(...xCords)
  let yMax = Math.max(...yCords)
  let yMin = Math.min(...yCords)

  let normalCords = cords.map((c)=>{return [c[0]-xMin,c[1]-yMin]})

  return normalCords
}

export const getHeightAndWidthOfCords = cords => {
  let xCords = cords.map((c)=>{return c[0]})
  let yCords = cords.map((c)=>{return c[1]})
  let xMax = Math.max(...xCords)
  let xMin = Math.min(...xCords)
  let yMax = Math.max(...yCords)
  let yMin = Math.min(...yCords)

  return [Math.abs(xMax-xMin),Math.abs(yMax-yMin)]
}


export const generateCoordinateKey = (cord) => {
  let x = cord[0]
  let y = cord[1]
  let key = "" + x + y
   return key
}

// All the neighbors for a given coordinate
export const getNodesForCoordinate = (cord) => {
  let x = cord[0]
  let y = cord[1]
  let up = [x,y+1]
  let right = [x+1,y]
  let down = [x,y-1]
  let left = [x-1,y]
  return [up,right,down,left]
} 

export const getAllAvailableNodes = (dict) => {
  let keys = Object.keys(dict)
  let allNodes = []

  keys.forEach(k => {
    let nodesForThisKey = getNodesForCoordinate(dict[k])
    let filteredNodes = nodesForThisKey.filter(node => {
      let key = generateCoordinateKey(node)
      return !dict[key]
    })
    allNodes.push(...filteredNodes)
  } )
  return allNodes
}

// Generates random coordinates for a given number.
export const generateRandomCoordinates = (num) => {
  
  let curr = [0,0]
  let dict = {
    '00': curr
  }

  for (let i =0; i<num-1;i++){
      let nodes = getNodesForCoordinate(curr)
      let filteredNodes = nodes.filter(node => {
        let key = generateCoordinateKey(node)
        console.log("not in dict",!dict[key])
        return !dict[key]
      })
      console.log("nodes are empty",filteredNodes == null)

      filteredNodes = filteredNodes != null ? filteredNodes : getAllAvailableNodes(dict)

      let nodeCount = filteredNodes.length
      let randomIndex = Math.floor(Math.random() * (nodeCount));
      let randomNode = filteredNodes[randomIndex]
      let keyForRandomNode = generateCoordinateKey(randomNode)
      dict[keyForRandomNode] = randomNode
      curr = randomNode    
  }

  let dictKeys = Object.keys(dict)
  let arrayOfCords = dictKeys.map((k)=>{return dict[k]})

  

  return  normalizeCords(arrayOfCords)
}

