import express from "express";
import { randomUUID } from "node:crypto";
import fs from "node:fs";

const port = 3000;
const app = express();

console.log(`worker pid=${process.pid}`);

app.get("/heavy", (req, res) => {
    fs.open("text_million.txt", "w", (err, fd) => {
        for (let i = 0; i < 2000000; i++) {
            const buf = Buffer.from(`index ${i}\n`);
            fs.writeSync(fd, buf);
        }
        res.send("done");
    });
});

app.get("/small", (req, res) => {
    let total = randomUUID();
    res.send(`The result is ${total}\n`);
});

app.get("/crash", (req, res) => {
    process.exit(1);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
