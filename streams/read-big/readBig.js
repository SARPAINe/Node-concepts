const { count } = require("node:console");
const fs = require("node:fs/promises");
let totalChunks = 0;
(async () => {
    const fileHandleRead = await fs.open("src.txt", "r");
    const fileHandleWrite = await fs.open("dest.txt", "w");

    // const streamRead = fileHandleRead.createReadStream({ highWaterMark: 400 });
    const streamRead = fileHandleRead.createReadStream();
    const streamWrite = fileHandleWrite.createWriteStream();

    const stats = await fs.stat("src.txt");
    const totalBytes = stats.size;

    const onePercent = Math.ceil(totalBytes / 100);
    console.log(onePercent);

    // console.log(streamRead.readableHighWaterMark);

    streamRead.on("data", (chunk) => {
        totalChunks++;
        // if (totalChunks % 100 === 0) {
        //     console.log(`${totalChunks}`);
        // }
        if (totalChunks % onePercent === 0) {
            console.log(`${(totalChunks / onePercent).toFixed(2)}% done`);
        }
        if (!streamWrite.write(chunk)) {
            streamRead.pause();
        }
        // console.log(`chunk: ${chunk}`);
    });

    streamWrite.on("drain", () => {
        streamRead.resume();
    });

    streamRead.on("end", async () => {
        await fileHandleRead.close();
        await fileHandleWrite.close();
        console.log("File copy completed.");
    });
})();
