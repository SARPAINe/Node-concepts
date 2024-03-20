import express from "express";
import { randomInt, randomUUID } from "node:crypto";
import fs from "node:fs";
import fsPromise from "node:fs/promises";

// const port = 3005;
const app = express();

console.log(`worker pid=${process.pid}`);
app.get("/heavy_async", (req, res) => {
    const data = Array.from({ length: 2000000 }, (_, i) => `index ${i}\n`).join(
        ""
    );

    fs.writeFile("text_million.txt", data, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            res.send("done");
        }
    });
});

app.get("/heavy", async (req, res) => {
    const label = randomInt(100);
    console.time(`heavy ${label}`);

    fs.open(`text_million_${label}.txt`, "w", (err, fd) => {
        for (let i = 0; i < 2000000; i++) {
            const buf = Buffer.from(`index ${i}\n`);
            fs.write(fd, buf, () => {});
        }
        fs.close(fd, () => {
            console.timeEnd(`heavy ${label}`);
        });
        res.send("done\n");
    });
});

app.get("/heavy_nonblock", (req, res) => {
    const label = randomInt(100);
    console.time(`heavy ${label}`);

    fs.open(`text_million_${label}.txt`, "w", (err, fd) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
        }

        let counter = 0;

        function writeNext() {
            if (counter < 2000000) {
                const buf = Buffer.from(`index ${counter}\n`);
                fs.write(fd, buf, (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                        fs.close(fd, () => {
                            res.status(500).send("Internal Server Error");
                        });
                    } else {
                        counter++;
                        writeNext();
                    }
                });
            } else {
                fs.close(fd, () => {
                    console.timeEnd(`heavy ${label}`);
                });
            }
        }

        writeNext();
    });
});

app.get("/heavy_promise", async (req, res) => {
    const label = randomInt(100);
    console.time(`heavy ${label}`);
    const file = await fsPromise.open(`text_million_${label}.txt`, "w");
    for (let i = 0; i < 2000000; i++) {
        const buf = Buffer.from(`index ${i}\n`);
        await file.writeFile(buf);
    }
    console.timeEnd(`heavy ${label}`);
    await file.close();
    res.send("done\n");
});

app.get("/small", (req, res) => {
    let total = randomUUID();
    res.send(`The result is ${total}\n`);
});

app.get("/crash", (req, res) => {
    process.exit(1);
});

const instanceId = parseInt(process.env.pm_id) || 0;
const port = 3005 + instanceId;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
