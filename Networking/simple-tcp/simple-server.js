const net = require("net");

//here socket is a duplex stream
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        console.log(data);
    });
});

server.listen(3000, "127.0.0.1", () => {
    console.log("tcp server started");
    console.log(server.address());
});
