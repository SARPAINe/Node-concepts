const fs = require("node:fs/promises");
let totalChunks = 0;
(async () => {
    const fileHandleRead = await fs.open("src.txt", "r");
    const fileHandleWrite = await fs.open("dest.txt", "w");

    // const streamRead = fileHandleRead.createReadStream({ highWaterMark: 400 });\
    const streamRead = fileHandleRead.createReadStream();
    const streamWrite = fileHandleWrite.createWriteStream();

    // const chunkSize = streamRead.readableHighWaterMark;

    const stats = await fs.stat("src.txt");
    const totalBytes = stats.size;
    let bytesCompleted = 0;

    let onePercent = Math.ceil(totalBytes / 100);

    // console.log(streamRead.readableHighWaterMark);

    streamRead.on("data", (chunk) => {
        bytesCompleted += chunk.length;

        if (bytesCompleted >= onePercent) {
            console.log(
                // `${((bytesCompleted / totalBytes) * 100).toFixed(2)}% done`
                `${Math.floor((bytesCompleted / totalBytes) * 100)}% done`
            );
            onePercent += Math.ceil(totalBytes / 100); // Increment to the next threshold
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
