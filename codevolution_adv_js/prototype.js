// let bikeFunction = function () {

// };
// console.log(bikeFunction.prototype);
// let bike = { name: "Ninja" };
// console.log(bike.__proto__); //undefined

let bikeFunction = function (name) {
  this.name = name;
};

console.log(bikeFunction.prototype); // bikeFunction {}

bikeFunction.prototype.start = function () {
  return `engine of ${this.name} starting`;
};

console.log(bikeFunction.prototype); // bikeFunction { start: [Function] }

let bike = new bikeFunction("Ninja");
console.log(bike.__proto__);

function Car(name) {
  this.name = name;
}

Car.prototype.start = function () {
  return `engine of ${this.name} starting`;
};

let c1 = new Car("Ferrari");
let c2 = new Car("Bugatti");

c2.speak = function () {
  console.log("Hello " + this.start());
};

c2.speak();

console.log(c1.__proto__); // Car { start: [Function] }
console.log(c2.__proto__); // Car { start: [Function] }
console.log(c1.__proto__ === c2.__proto__); // true
console.log(c1.__proto__ === Car.prototype);
console.log(c2.__proto__ === Car.prototype);
console.log(Car.prototype);
console.log(c1.constructor === Car);
console.log("Prototype of c1: ", Object.getPrototypeOf(c1));

// Prototype Inheritance
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

Person.prototype.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

function SuperHero(firstName, lastName) {
  Person.call(this, firstName, lastName);
  this.isSuperHero = true;
}

SuperHero.prototype = Object.create(Person.prototype);
SuperHero.prototype.constructor = SuperHero;

SuperHero.prototype.fightCrime = function () {
  return `${this.getFullName()} fighting crime`;
};

const batman = new SuperHero("Bruce", "Wayne");
console.log(batman.getFullName());
console.log(batman.fightCrime());

// Another prototype inheritance example
let alien = { kind: "alien" };
let person = { kind: "person" };

// let zack = Object.create(person); // creates a new object with the prototype set to person
// does the same thing as below
let zack = {};
zack.__proto__ = person; // sets the prototype of zack to person

console.log(zack.kind);

zack.__proto__ = alien; // sets the prototype of zack to alien
console.log(zack.kind);

console.log(alien.isPrototypeOf(zack)); // true

// Prototype lookups are dynamic
// When you access a property on an object, JavaScript will first look at the object itself to see if it has that property. If it doesn't, it will look at the object's prototype. If the prototype doesn't have the property, it will look at the prototype's prototype, and so on, until it finds the property or reaches the end of the prototype chain.

// You can add properties to an object at any time, the prototype chain lookup will find the new property as expected
let animal = {};
let tiger = {};
tiger.__proto__ = animal;

// zack doesn't respond to kind at this point
console.log(tiger.kind); //=> undefined

// let's add kind to person
animal.kind = "animal";

// now zack responds to kind
// because it finds 'kind' in person
console.log(tiger.kind); //=> 'person'

// new/updated properties are assigned to the object itself, not the prototype
console.log(Object.getPrototypeOf(tiger));

function parent() {
  return {
    foo: 42,
    bar: "baz",
  };
}

console.log(parent.prototype.__proto__); // Object {}
parent.prototype.__proto__.baz = "I should not belong here";
let child = new parent();
console.log(child.__proto__); // parent {}
console.log(child.baz); // I should not belong here

console.log(child.hasOwnProperty("foo")); // true
console.log(child.hasOwnProperty("baz")); // false
console.log(parent.hasOwnProperty("baz")); // false
