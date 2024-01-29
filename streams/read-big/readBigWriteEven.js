const fs = require("node:fs/promises");
let totalChunks = 0;
(async () => {
    const fileHandleRead = await fs.open("src.txt", "r");
    const fileHandleWrite = await fs.open("dest.txt", "w");

    // const streamRead = fileHandleRead.createReadStream({ highWaterMark: 400 });\
    const streamRead = fileHandleRead.createReadStream();
    const streamWrite = fileHandleWrite.createWriteStream();

    // const chunkSize = streamRead.readableHighWaterMark;

    // console.log(streamRead.readableHighWaterMark);

    let split = "";
    // let traverse = 0;

    //there is some error some garbage data is being logged check 146944 in dest
    streamRead.on("data", (chunk) => {
        // traverse++;
        let numbers = chunk.toString("utf-8").split(" ");
        if (Number(numbers[0]) !== Number(numbers[1] - 1)) {
            if (split) {
                numbers[0] = split + numbers[0];
            }
        }
        if (
            Number(numbers[numbers.length - 2]) + 1 !=
            Number(numbers[numbers.length - 1])
        ) {
            split = numbers.pop();
        }

        // if (traverse < 6) {
        //     console.log(numbers[0]);
        //     console.log(numbers[1]);
        //     console.log(numbers[numbers.length - 2]);
        //     console.log(numbers[numbers.length - 1]);
        //     console.log("\n");
        // }

        numbers.forEach((number) => {
            let n = Number(number);

            if (n % 2 === 0) {
                if (!streamWrite.write(`${n}\n`)) {
                    streamRead.pause();
                }
            }
        });
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
