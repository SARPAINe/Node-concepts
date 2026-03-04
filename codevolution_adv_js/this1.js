class Gadget {
  constructor(name) {
    this.name = name;
  }

  logModel(){
    console.log(`The model of this gadget is ${this.name}`);
  }

  logArrowModel = () => {
    console.log(`Arrow: The model of this gadget is ${this.name}`);
  }
}

const g1 = new Gadget("iPhone");
g1.logModel(); // The model of this gadget is iPhone
g1.logArrowModel(); // The model of this gadget is iPhone
const f1=g1.logModel;
const f2 = g1.logArrowModel; // The model of this gadget is iPhone
f2(); // The model of this gadget is iPhone
f1.bind(g1)(); // The model of this gadget is iPhone

function Animal(name) {
  this.name = name;
  this.logName = function () {
    console.log(`The name of this animal is ${this.name}`);
  };
  this.logArrowName = () => {
    console.log(`The name of this animal is ${this.name}`);
  };
}

const a1 = new Animal("Dog");
a1.logName(); // The name of this animal is Dog
const f3 = a1.logName; // The name of this animal is Dog
f3(); // The name of this animal is Dog
a1.logArrowName(); // The name of this animal is Dog
const f4 = a1.logArrowName; // The name of this animal is Dog
f4(); // The name of this animal is Dog

