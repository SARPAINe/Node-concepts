const fs = require("node:fs");
const file = fs.readFileSync("/home/shaharin/Pictures/Screenshots/white.png");

console.log(file.byteLength);
console.log(file.toString("hex"));
console.log(file.toString("hex").length);
