export const EST_ADDITION_IN_100 = {
  1: {
    FIRST: 620,
    SECOND: 126,
    OPERATION: "+",
    TARGET: 746,
    MIN: 0,
    MAX: 1000,
    PARTITIONS: 1,
  },
  2: {
    FIRST: 53,
    SECOND: 9,
    OPERATION: "x",
    TARGET: 477,
    MIN: 0,
    MAX: 1000,
    PARTITIONS: 4,
  },
  3: {
    FIRST: 599,
    SECOND: 255,
    OPERATION: "-",
    TARGET: 344,
    MIN: 0,
    MAX: 1000,
    PARTITIONS: 4,
  },
  4: {
    FIRST: 800,
    SECOND: 9,
    OPERATION: "/",
    TARGET: 88.8,
    MIN: 0,
    MAX: 1000,
    PARTITIONS: 2,
  },
};


export const BBS_ADDITION_IN_100 = {
  1: {
    TARGET: 85,
    MIN: 50,
    MAX: 100,
    PARTITIONS: 1,
  },
  2: {
    TARGET: 54,
    MIN: 21,
    MAX: 100,
    PARTITIONS: 1,
  },
  3: {
    TARGET: 24,
    MIN: 10,
    MAX: 30,
    PARTITIONS: 1,
  },
  4: {
    TARGET: 68,
    MIN: 17,
    MAX: 80,
    PARTITIONS: 1,
  },
};


// Two digit addition under 100
const TWO_DIGIT_ADDITION_UNDER_100_P1 = {
  fact: {
    operation: "+",
    a: 43,
    b: 38,
    answer: 81
  },
  numberlineState: {
    min: 0,
    max: 100,
    minorStep: 5,
    majorStep: 25,
    denominator: 1,
  }, 
  spotlight: {
    width: 0.06
  }
}

const TWO_DIGIT_ADDITION_UNDER_100_P2 = {
  fact: {
    operation: "+",
    a: 33,
    b: 41,
    answer: 74
  },
  numberlineState: {
    min: 0,
    max: 100,
    minorStep: 5,
    majorStep: 25,
    denominator: 1,
  }, 
  spotlight: {
    width: 0.05
  }
}

const TWO_DIGIT_ADDITION_UNDER_100_P3 = {
  fact: {
    operation: "+",
    a: 25,
    b: 17,
    answer: 42 
  },
  numberlineState: {
    min: 0,
    max: 100,
    minorStep: 5,
    majorStep: 25,
    denominator: 1,
  }, 
  spotlight: {
    width: 0.05
  }
}

const TWO_DIGIT_ADDITION_UNDER_100_P4 = {
  fact: {
    operation: "+",
    a: 34,
    b: 27,
    answer: 61
  },
  numberlineState: {
    min: 0,
    max: 100,
    minorStep: 5,
    majorStep: 25,
    denominator: 1,
  }, 
  spotlight: {
    width: 0.05
  }
}

const TWO_DIGIT_ADDITION_UNDER_100_P5 = {
  fact: {
    operation: "+",
    a: 12,
    b: 39,
    answer: 51
  },
  numberlineState: {
    min: 0,
    max: 100,
    minorStep: 10,
    majorStep: 25,
    denominator: 1,
  },
  spotlight: {
    width: 0.10
  }
}

const TWO_DIGIT_ADDITION_UNDER_100_P6 = {
  fact: {
    operation: "+",
    a: 26,
    b: 18,
    answer: 44
  },
  numberlineState: {
    min: 0,
    max: 100,
    minorStep: 10,
    majorStep: 25,
    denominator: 1,
  },
  spotlight: {
    width: 0.10
  }
}


export const TWO_DIGIT_ADDITION_UNDER_100 = {
  0: TWO_DIGIT_ADDITION_UNDER_100_P1,
  1: TWO_DIGIT_ADDITION_UNDER_100_P5,
  2: TWO_DIGIT_ADDITION_UNDER_100_P3,
  3: TWO_DIGIT_ADDITION_UNDER_100_P4,
  4: TWO_DIGIT_ADDITION_UNDER_100_P5,
  5: TWO_DIGIT_ADDITION_UNDER_100_P6
}