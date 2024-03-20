const net = require("net");
// this could have been named connection too
const connection = net.createConnection(
    { host: "127.0.0.1", port: "3000" },
    () => {
        const buff = Buffer.alloc(2);
        buff[0] = 12;
        buff[1] = 25;
        connection.write(buff);
        connection.write("I am here for you");
    }
);
