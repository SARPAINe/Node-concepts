const fs = require("fs");

//When running setTimeout() with a delay of 0ms and an I/O async method, the order of execution can never be guaranteed. since 0ms is not actually 0ms, it is overwrriten as 1ms, so event loop might enter the timer queue at 0.05ms, at that time timer queue will be empty
// setTimeout(() => console.log("this is setTimeout 1"), 0);

// fs.readFile("./index.js", () => {
//   console.log("this is readFile 1");
// });

// fs.readFile(__filename, () => {
//   console.log("this is readFile 1");
// });

// process.nextTick(() => console.log("this is process.nextTick 1"));
// Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
// setTimeout(() => console.log("this is setTimeout 1"), 0);
// setImmediate(() => console.log("this is setImmediate 1"));

// for (let i = 0; i < 2000000000; i++) {}

// fs.readFile(__filename, () => {
//   console.log("this is readFile 1");
//   setImmediate(() => console.log("this is setImmediate 1"));
// });

// process.nextTick(() => console.log("this is process.nextTick 1"));
// Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
// setTimeout(() => console.log("this is setTimeout 1"), 0);

// for (let i = 0; i < 2000000000; i++) {}

fs.readFile(__filename, () => {
    console.log("this is readFile 1");
    setImmediate(() => console.log("this is setImmediate 1"));
    process.nextTick(() =>
        console.log("this is inner process.nextTick inside readFile")
    );
    Promise.resolve().then(() =>
        console.log("this is inner Promise.resolve inside readFile")
    );
});

process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is setTimeout 1"), 0);

for (let i = 0; i < 2000000000; i++) {}