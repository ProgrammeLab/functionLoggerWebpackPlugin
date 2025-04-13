// @log
function greet(name, age) {
  return `Hello ${name}, you are ${age} years old!`;
}

// This function won't be logged because it doesn't have @log comment
function calculate(a, b) {
  return a + b;
}

/**
 * multiple line function comments
 * @param {*} x
 * @param {*} y
 * @returns
 */
function multiply(x, y) {
  return x * y;
}

// arrow funciton
const arrowFunction = () => {
  console.log("hahah");
};

const obj = {
  // propertyFunc
  innerGreet: () => {
    console.log("propertyFunc");
  },
};

// Expose functions to window object for button clicks
window.greet = greet;
window.multiply = multiply;
