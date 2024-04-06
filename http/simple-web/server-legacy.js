const http = require("node:http");
const fs = require("node:fs/promises");
const server = http.createServer();

server.on("request", async (request, response) => {
  if (request.url === "/" && request.method === "GET") {
    response.setHeader("Content-Type", "text/html");

    const fileHandle = await fs.open("./public/index.html", "r");

    const fileStream = fileHandle.createReadStream();

    fileStream.pipe(response);
  }

  if (request.url === "/styles.css" && request.method === "GET") {
    response.setHeader("Content-Type", "text/css");

    const fileHandle = await fs.open("./public/styles.css", "r");

    const fileStream = fileHandle.createReadStream();

    fileStream.pipe(response);
  }

  if (request.url === "/script.js" && request.method === "GET") {
    response.setHeader("Content-Type", "text/javascript");

    const fileHandle = await fs.open("./public/script.js", "r");

    const fileStream = fileHandle.createReadStream();

    fileStream.pipe(response);
  }

  if (request.url === "/login" && request.method === "POST") {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = 200;
    const body = {
      message: "Logging you in..",
    };
    response.end(JSON.stringify(body));
  }

  if (request.url === "/user" && request.method === "PUT") {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = 401;
    const body = {
      message: "You first have to log in..",
    };
    response.end(JSON.stringify(body));
  }

  //upload route
  // should use put since request is idempotent, i am not really changing the state of the server
  if (request.url === "/upload" && request.method === "PUT") {
    response.setHeader("Content-Type", "application/json");
    const fileHandle = await fs.open("./storage/image.jpeg", "w");
    const fileStream = fileHandle.createWriteStream();

    request.pipe(fileStream);

    request.on("end", () => {
      response.end(
        JSON.stringify({ message: "File was uploaded succesfully!" })
      );
    });
  }
});

server.listen(9000, () => {
  console.log(`Web server is live at http://localhost:9000`);
});
