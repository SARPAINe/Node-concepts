const Blush = require("./blush");

const PORT = 4060;

const server = new Blush();

server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.listen(PORT, () => {
  console.log(`Server has started on port http://localhost:${PORT}`);
});
