

// Takes a number a counts the digits.
export function digitCount(n) {
    var count = 1;
  
    if (n >= 1) {
      while (n / 10 >= 1) {
        n /= 10;
        ++count;
      }
      return count;
    } else {
      ++count;
      while (n % 1 != 0) {
        n *= 10;
        ++count;
      }
      return count - 1;
    }
  }
  

// 
export function appxEq(a,b,t){
    return Math.abs(a-b) < t
  }


export function decimalToFrac(dec) {
    for (let i=1;i<100;i++){
      for (let j=0;j<=i;j++){
        if (Math.abs(j/i - dec) < 0.001) {
          return [j,i]
        }
      }
    }
  }