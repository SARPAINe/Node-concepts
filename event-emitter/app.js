// const EventEmitter = require("events");
const EventEmitter = require("./events");

class Emitter extends EventEmitter {}

const myEvent = new Emitter();

myEvent.on("announce", () => {
    console.log(`A new announcement!`);
});

myEvent.on("announce", (topic) => {
    console.log(`A new announcement! topic: ${topic}`);
});

myEvent.once("join", () => {
    console.log(`A new user joined.`);
});

myEvent.once("join", (username) => {
    console.log(`A new user joined, username: ${username}`);
});

// myEvent.emit("announce");
myEvent.emit("announce", "salary");
// myEvent.emit("announce");
myEvent.emit("announce", "salary");
// myEvent.emit("announce");
myEvent.emit("announce", "salary");
myEvent.emit("join", "shaharin");
// myEvent.emit("join", "shaharin");
