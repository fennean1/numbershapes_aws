function printList() {

    for (let i = 1;i<=100;i++){
  
        let printMe;
  
        printMe = i%3 == 0 ? "Jack": i
        printMe = i%5 == 0 ? "Hammer" : printMe
        printMe = i%15 == 0 ? "JackHammer" : printMe
        
        console.log(printMe)
    }
  
  }