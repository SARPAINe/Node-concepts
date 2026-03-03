// here setImmediate will win over setTimeout, because setImmediate is designed to execute after the current poll phase of the event loop, while setTimeout with a delay of 0 will be executed in the next iteration of the event loop, which happens after the current poll phase. Therefore, "immediate" will be logged before "timeout".

const fs = require('fs');
fs.readFile('file.txt', () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
  Promise.resolve().then(() => console.log("promise"));
});

Promise.resolve().then(() => console.log("promise outside"));
setTimeout(() => console.log("timeout outside"), 0);
setImmediate(() => console.log("immediate outside"));

// 
// console.log("start");

// setTimeout(() => {
//   console.log("timeout");
// }, 0);

// setImmediate(() => {
//   console.log("immediate");
// });

// console.log("end");