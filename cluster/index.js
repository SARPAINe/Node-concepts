import express from "express";

const port = 3000;
const app = express();

console.log(`worker pid=${process.pid}`);

app.get("/heavy-time", (req, res) => {
    setTimeout(() => {
        let total = 0;
        for (let i = 0; i < 5_000_000; i++) {
            total++;
        }
        console.log("working");
        res.send(`The result of the CPU intensive task is ${total}\n`);
    }, 5000);
});

app.get("/heavy", (req, res) => {
    let total = 0;
    for (let i = 0; i < 5_000_000; i++) {
        total++;
    }
    res.send(`The result of the CPU intensive task is ${total}\n`);
});

app.get("/crash", (req, res) => {
    process.exit(1);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
