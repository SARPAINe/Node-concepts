//creates a buffer with a byte size of 100
let buf = Buffer.alloc(100);

// console.log(buf);

const len = buf.write("Hello world");
console.log(len);

const buffLen = Buffer.byteLength(buf);
console.log(buffLen);

let buf1 = Buffer.from("xyz");
console.log(buf1[0]);
console.log(buf1[1]);
console.log(buf1[2]);
console.log(buf1.byteLength);
console.log(typeof buf1);

//hex to decimal, decimal to character as per ascii
console.log(buf1.toString());

let buf2 = Buffer.from("xyz");
console.log(Buffer.compare(buf1, buf2));

buf1 = Buffer.from("x");
buf2 = Buffer.from("y");
//will return -1
console.log(Buffer.compare(buf1, buf2));

buf1 = Buffer.from("y");
buf2 = Buffer.from("x");
//will return 1
console.log(Buffer.compare(buf1, buf2));

// Buffer concat
buf1 = Buffer.from("x");
buf2 = Buffer.from("y");
buf3 = Buffer.from(`"`);

buf = Buffer.concat([buf1, buf2, buf3]);
console.log(buf);
console.log(buf.toString());

//Buffer Entries
for (a of buf.entries()) console.log(a);

//Buffer fill
buf = Buffer.alloc(10).fill("abc");
console.log(buf.toString());

//edit a buffer by assigning decimal value
buf[0] = 120; //hex value of decimal 120 is 78, ascii char is x
buf[1] = 123;
console.log(buf.toString());

//buffer from
console.log("Buffer from");
buf = Buffer.from([120, 121, 122], "ascii");
console.log(buf.toString());

// Create a buffer from an arraybuffer
let ab = new ArrayBuffer(10);
let view = new DataView(ab);

view.setInt8(0, 120);
view.setInt8(1, 122);
view.setInt8(2, 120);
view.setInt8(3, 120);
// Specify offset and length
buf = Buffer.from(ab, 0, 2);
console.log(buf);

//buff includes
console.log("Buffer includes");
buf = Buffer.from("this is a buffer");
console.log(buf.includes("this"));
console.log(buf.includes("this is"));
console.log(buf.includes("thiss"));

//buffer isEncoding
console.log("Buffer isEncoding");
console.log(Buffer.isEncoding("utf-8"));
console.log(Buffer.isEncoding("hey"));
console.log(Buffer.isEncoding("hex"));

//buffer slice
buf1 = Buffer.from("uvwxyz");
buf2 = buf1.slice(2, 5);
console.log(buf2);
console.log(buf2.toString());

//buff toJSON
console.log(buf1.toJSON());
