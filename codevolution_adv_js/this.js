// function sayMyName(name) {
//   console.log(`Hello my name is ${name}`);
//   console.log(this);
// }

// sayMyName("Walter White"); // Hello my name is Walter White
// sayMyName("Heisenberg"); // Hello my name is Heisenberg

const person = {
  name: "Jesse Pinkman",
  sayMyName: function () {
    console.log(`Hello my name is ${this.name}`);
    console.log(this);
  },
};

person.sayMyName(); // Hello my name is Jesse Pinkman
// this is the exammple of implicit binding. It states that when a function is called by a preceding dot, the object before that dot is this.

function sayMyName() {
  console.log(`Hello my name is ${this.name}`);
  console.log(this);
}

sayMyName.call(person); // Hello my name is Jesse Pinkman
// this is the example of explicit binding. It states that when a function’s call or apply method is used, this is explicitly defined. This refers to the object that is passed as an argument in the call or apply method.

function Person(name) {
  this.name = name;
  console.log(this);
}

const p1 = new Person("Walter White"); // person {}
console.log(p1.name);
// this is the example of new binding. It states that when a function is called with new keyword, this refers to the newly created object.

// when a function is called with new keyword this keyword will always reference a new empty object.
globalThis.name = "Global Object";
sayMyName(); // Hello my name is Global Object
// this is the example of default binding. when none of the three conditions are met, this refers to the global object. In strict mode, this will be undefined.
