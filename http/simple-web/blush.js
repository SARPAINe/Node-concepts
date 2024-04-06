const http = require("node:http");
const fs = require("node:fs/promises");

class Blush {
  constructor() {
    this.server = http.createServer();

    this.routes = {};

    this.server.on("request", (req, res) => {
      //send a file back to the client
      res.sendFile = async (path, mime) => {
        const fileHandle = await fs.open(path, "r");
        const fileStream = fileHandle.createReadStream();

        res.setHeader("Content-Type", mime);
        fileStream.pipe(res);
      };
      this.routes[req.method.toLowerCase() + req.url](req, res);
    });
  }

  listen(port, cb) {
    this.server.listen(port, () => {
      cb();
    });
  }

  route(method, path, cb) {
    this.routes[method + path] = cb;
  }
}

module.exports = Blush;
