// time: 9-10s
// sequence: maintained
// const fs = require("node:fs/promises");

// (async () => {
//     console.time("writeMany");
//     const fileHandler = await fs.open("text_million.txt", "w");

//     for (let i = 0; i < 2000000; i++) {
//         await fileHandler.write(`index ${i}\n`);
//     }
//     await fileHandler.close();
//     console.timeEnd("writeMany");
// })();

// promise all version
// sequence maintained but some data lost
// const fs = require("node:fs/promises");

// (async () => {
//     console.time("writeMany");
//     const fileHandler = await fs.open("text_million.txt", "w");

//     const writePromises = [];
//     for (let i = 0; i < 1000000; i++) {
//         // Push each promise to the array
//         writePromises.push(fileHandler.write(`index ${i}\n`));
//     }

//     try {
//         // Wait for all promises to complete (resolve or reject)
//         await Promise.all(writePromises);
//         console.timeEnd("writeMany");
//     } catch (error) {
//         console.error("Error writing to file:", error);
//     } finally {
//         // Close the file handler regardless of success or failure
//         await fileHandler.close();
//     }
// })();

// cpu usage: almost 100%
// time: 2sec
// const fs = require("node:fs");

// (() => {
//     console.time("writeMany");
//     fs.open("text_million.txt", "w", (err, fd) => {
//         for (let i = 0; i < 1000000; i++) {
//             const buf = Buffer.from(`index ${i}\n`);
//             fs.writeSync(fd, buf);
//         }
//         console.timeEnd("writeMany");
//     });
// })();

// time: 400ms
// takes too much memory

// const fs = require("node:fs/promises");

// (async () => {
//     console.time("writeMany");

//     const fileHandler = await fs.open("text_million.txt", "w");

//     const stream = fileHandler.createWriteStream();

//     for (let i = 0; i < 1000000; i++) {
//         const buff = Buffer.from(`index ${i}\n`, "utf-8");
//         stream.write(buff);
//     }
//     console.timeEnd("writeMany");
// })();

// time: 700ms
// better memory usage
const fs = require("node:fs/promises");

// 1 billion
// const numberOfWrites = 1000000000;
// 100 million
// const numberOfWrites = 100000000;
// 1 million
const numberOfWrites = 1000000;

(async () => {
    console.time("writeMany");

    const fileHandler = await fs.open("text_100million.txt", "w");

    const stream = fileHandler.createWriteStream({
        // highWaterMark: 1024 * 1024,
    });

    // console.log(stream.writableHighWaterMark); // size of our internal buffer
    // console.log(stream.writableLength); // indicates how much of our buffer is full

    // const buff = Buffer.from("string");
    // stream.write(buff);
    // console.log(stream.writableLength);

    // const buff = Buffer.alloc(16383, 10);
    // console.log(buff);
    // console.log(stream.write(buff));
    // console.log(stream.write(Buffer.alloc(1, "a")));

    // stream.on("drain", () => {
    //     console.log("We are now safe to write more!");
    // });

    // setInterval(() => {
    //     exit(0);
    // }, 1000);

    let i = 0,
        drainCount = 0;

    const writeMany = () => {
        while (i < numberOfWrites) {
            // const buff = Buffer.from(`index ${i}\n`, "utf-8");
            const buff = Buffer.from(`${i} `, "utf-8");

            if (i === numberOfWrites - 1) {
                return stream.end(buff);
            }

            if (!stream.write(buff)) {
                i++;
                break;
            }
            i++;
        }
    };

    writeMany();

    stream.on("drain", () => {
        drainCount++;
        writeMany();
    });

    stream.on("finish", () => {
        console.log(`drain: ${drainCount} times`);
        console.timeEnd("writeMany");
        fileHandler.close();
    });
})();
