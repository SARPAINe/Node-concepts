const net = require("net");
// this could have been named connection too
const socket = net.createConnection({ host: "localhost", port: "8050" }, () => {
    const buff = Buffer.alloc(2);
    buff[0] = 12;
    buff[1] = 25;
    socket.write(buff);
});

socket.on("data", (chunk) => {
    console.log("Received Response: ");
    console.log(chunk.toString("utf-8"));
    socket.end();
});

socket.on("end", () => {
    console.log("Connection closed");
});
