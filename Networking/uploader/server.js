const net = require("net");
const fs = require("fs/promises");

const server = net.createServer(() => {});

server.on("connection", (socket) => {
    console.log("New connection!");

    let fileHandle;
    socket.on("data", async (data) => {
        fileHandle = await fs.open(`storage/test.txt`, "w");
        const fileStream = fileHandle.createWriteStream();

        // Writing to our destination file
        fileStream.write(data);
    });

    socket.on("end", () => {
        console.log("Connection ended!");
        fileHandle.close();
    });
});

server.listen(5050, "::1", () => {
    console.log("Uploader server opened on", server.address());
});
