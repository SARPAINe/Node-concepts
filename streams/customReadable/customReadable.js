const { Readable } = require("node:stream");
const fs = require("node:fs");
const fsPromise = require("node:fs/promises");

class FileReadStream extends Readable {
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark });
        // super();
        this.fileName = fileName;
        this.fd = null;
        this.readCount = 0;
    }

    _construct(callback) {
        fs.open(this.fileName, "r", (err, fd) => {
            if (err) {
                callback(err);
            } else {
                this.fd = fd;
                callback();
            }
        });
    }

    _read(n) {
        ++this.readCount;
        const buf = Buffer.alloc(n);
        // if (this.readCount == 3) {
        // when null is pushed read is over
        //     this.push(null);
        // }
        fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
            if (err) {
                this.destroy(err);
            } else {
                //<72 73 74 00 00 00> bytesRead will be 3
                this.push(bytesRead > 0 ? buf.subarray(0, bytesRead) : null);
            }
        });
    }

    _destroy(err, callback) {
        if (this.fd) {
            console.log(`Total read count: ${this.readCount}`);
            fs.close(this.fd, (er) => callback(er || err));
        } else {
            callback(err);
        }
    }
}

(async () => {
    const fileHandleWrite = await fsPromise.open("dest.txt", "w");

    // const streamRead = fileHandleRead.createReadStream({ highWaterMark: 400 });\
    const streamRead = new FileReadStream({
        fileName: "text_million.txt",
        // highWaterMark: 30000,
    });
    const streamWrite = fileHandleWrite.createWriteStream();

    // const chunkSize = streamRead.readableHighWaterMark;

    const stats = await fsPromise.stat("text_million.txt");
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
        await fileHandleWrite.close();
        console.log("File copy completed.");
    });
})();
