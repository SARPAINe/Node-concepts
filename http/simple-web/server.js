const Blush = require("../blush");

const PORT = 4060;

const server = new Blush();

server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});

server.route("post", "/login", (req, res) => {
  res.status(400).json({ message: "Bad login info." });
});

server.beforeEach((req, res, next) => {
  console.log("Middleware 1");
  console.log("body", req);
  next();
});

server.beforeEach((req, res, next) => {
  console.log("Middleware 2");
  next();
});

server.listen(PORT, () => {
  console.log(`Server has started on port http://localhost:${PORT}`);
});
