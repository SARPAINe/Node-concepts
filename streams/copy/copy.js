const fs = require("node:fs/promises");
const { pipeline } = require("node:stream");

//fastest solution but takes the largest memory
//as whole file is inside of a single buffer
// (async () => {
//     const destFile = await fs.open("text-copy.txt", "w");
//     const result = await fs.readFile("text.txt");

//     // console.log(result);
//     await destFile.write(result);
// })();

//some data loss for unknown reason
// (async () => {
//     console.time("copy");

//     const srcFile = await fs.open("text_billion.txt", "r");
//     const destFile = await fs.open("text-copy.txt", "w");

//     let bytesRead = 1;
//     while (bytesRead > 0) {
//         const readResult = await srcFile.read();
//         bytesRead = readResult.bytesRead;

//         if (bytesRead !== 16384) {
//             // console.log(readResult.buffer.indexOf(0));
//             const newBufferSize = readResult.buffer.indexOf(0);
//             const newBuffer = Buffer.alloc(newBufferSize);
//             readResult.buffer.copy(newBuffer, 0, 0, newBufferSize);
//             destFile.write(newBuffer);
//         } else {
//             destFile.write(readResult.buffer);
//         }
//     }
//     console.timeEnd("copy");
// })();

(async () => {
    console.time("copy");

    const srcFile = await fs.open("text_100million.txt", "r");
    const destFile = await fs.open("text-copy.txt", "w");

    const readStream = srcFile.createReadStream();
    const writeStream = destFile.createWriteStream();

    // readStream.pipe(writeStream);
    // readStream.on("end", () => {
    //     console.timeEnd("copy");
    // });
    // Don't use pipe in production, use pipeline instead! It will automatically
    // handle the cleanings for you and give you an easy way for error handling
    pipeline(readStream, writeStream, (err) => {
        console.log(err);
        console.timeEnd("copy");
    });
})();
