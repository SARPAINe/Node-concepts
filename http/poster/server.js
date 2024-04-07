const { setEngine } = require("crypto");
const Blush = require("../blush");
// A sample object in this array would look like:
// {userId:1, token: 23434343}
const SESSIONS = [
  {
    userId: 0,
    token: "token",
  },
];

const USERS = [
  {
    id: 1,
    name: "Hoyte Uta",
    username: "hoyte123",
    password: "passhoyte",
  },
  {
    id: 2,
    name: "Posh Beta",
    username: "posh123",
    password: "passposh",
  },
  {
    id: 1,
    name: "Killer Shamsu",
    username: "shamsu123",
    password: "passshamsu",
  },
];

const POSTS = [
  {
    id: 1,
    title: "This is the first post",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    userId: 1,
  },
];

const PORT = 8000;

const server = new Blush();

// ----- Middleware ----- //
// For authentication
server.beforeEach((req, res, next) => {
  const routesToAuthenticate = [
    "GET /api/user",
    "PUT /api/user",
    "POST /api/posts",
    "DELETE /api/logout",
  ];

  if (routesToAuthenticate.includes(req.method + " " + req.url)) {
    // if we have a token cookie, then save the userId to req object
    if (req.headers.cookie) {
      const token = req.headers.cookie.split("=")[1];
      const session = SESSIONS.find((session) => session.token == token);
      if (session) {
        //send the user's profile info
        req.userId = session.userId;
        return next();
      }
    }
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
});

const parseJSON = (req, res, next) => {
  // This is only good for bodies that their size is smaller than high water mark value
  if (req.headers["content-type"] === "application/json") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString("utf-8");
    });

    req.on("end", () => {
      body = JSON.parse(body);
      req.body = body;
      return next();
    });
  } else next();
};

//for parsing json
server.beforeEach(parseJSON);

// For different routes that need the index.html file
server.beforeEach((req, res, next) => {
  const routes = ["/", "/login", "/profile", "/new-post"];
  if (routes.includes(req.url) && req.method === "GET") {
    return res.status(200).sendFile("./public/index.html", "text/html");
  } else next();
});

// ------ Files Routes ----- //
server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});

// -------- JSON Routes ---- //

// Log a user in and give them a token
server.route("post", "/api/login", (req, res) => {
  const { username, password } = req.body;

  //check if the user exists
  const user = USERS.find((user) => user.username === username);
  if (user && user.password === password) {
    // Generate a random 10 digit token
    const token = Math.floor(Math.random() * 10000000000).toString();

    // Save the generated token
    SESSIONS.push({ userId: user.id, token });

    res.setHeader("Set-Cookie", `token=${token};Path=/;`);

    res.status(200).json({ message: "Logged in successfully" });
  } else {
    res.status(401).json({ error: "Invalid username or password." });
  }
});

//Log a user out
server.route("delete", "/api/logout", (req, res) => {
  // Remove the session object from the sessions array
  const sessionIndex = SESSIONS.findIndex(
    (session) => session.userId === req.userId
  );

  if (sessionIndex > -1) {
    SESSIONS.splice(sessionIndex, 1);
  }

  res.setHeader(
    "Set-Cookie",
    `token=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );

  res.status(200).json({ message: "Logged out successfully" });
});

// Send user info
server.route("get", "/api/user", (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);
  res.json({
    username: user.username,
    name: user.name,
  });
});

// Update the user info
server.route("put", "/api/user", (req, res) => {
  const { username, name, password } = req.body;

  //Grab the user object that is currently logged in
  const user = USERS.find((user) => user.id === req.userId);

  user.username = username;
  user.name = name;
  if (password !== "") {
    user.password = password;
  }

  res.status(200).json({
    username: user.username,
    name: user.name,
    password_status: password !== "" ? "updated" : "not updated",
  });
});

// Send the list of all the posts we have
server.route("get", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id == post.userId);
    post.author = user.username;
    return post;
  });
  res.status(200).json(posts);
});

//Create a new post
server.route("post", "/api/posts", (req, res) => {
  const { title, body } = req.body;
  const post = {
    id: POSTS.length + 1,
    title,
    body,
    userId: req.userId,
  };

  POSTS.unshift(post);
  res.status(201).json({
    post,
  });
});

server.listen(PORT, () => {
  console.log(`Server has started - http://localhost:${PORT}`);
});
