const http = require("node:http");

// agent corresponds to tcp connection
const agent = new http.Agent({ keepAlive: true });

// request object here is a duplex stream
// read from request = read server response
// write to request = send body to server
const request = http.request({
    agent: agent,
    hostname: "localhost",
    port: 8050,
    method: "POST",
    path: "/create-post",
    headers: {
        "Content-Type": "application/json",
        name: "Joe",
    },
    // either Content-Length in bytes or transfer-encoding in chunk
});

// This event is emitted only once
request.on("response", (response) => {
    console.log("--------- STATUS: ---------");
    console.log(response.statusCode);

    console.log("--------- HEADERS: ---------");
    console.log(response.headers);

    console.log("--------- BODY: ---------");
    response.on("data", (chunk) => {
        console.log(chunk.toString("utf-8"));
    });
    response.on("end", () => {
        console.log("No more data in response");
    });
});

// request.write(JSON.stringify({ title: "Title of my post" }));
// request.write(JSON.stringify({ body: "this is some text and more and more." }));

request.end(
    JSON.stringify({
        title: "Title of my post",
        body: "this is some text and more and more.",
    })
);
