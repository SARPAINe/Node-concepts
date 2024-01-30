const { Writable } = require("node:stream");
const fs = require("node:fs");

class FileWriteStream extends Writable {
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark });

        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chunksSize = 0;
        this.writesCount = 0;
    }

    _construct(callback) {
        fs.open(this.fileName, "w", (err, fd) => {
            if (err) {
                callback(err);
            } else {
                this.fd = fd;
                callback();
            }
        });
    }

    _write(chunk, encoding, callback) {
        // console.log(this.fd);
        this.chunks.push(chunk);
        this.chunksSize += chunk.length;

        if (this.chunksSize > this.writableHighWaterMark) {
            fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
                if (err) {
                    return callback(err);
                } else {
                    this.chunks = [];
                    this.chunksSize = 0;
                    ++this.writesCount;
                    callback();
                }
            });
        } else {
            callback();
        }
    }

    _final(callback) {
        fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
            if (err) return callback(err);
            else {
                ++this.writesCount;
                this.chunks = [];
                callback();
            }
        });
    }

    _destroy(error, callback) {
        console.log("Number of writes: ", this.writesCount);
        if (this.fd) {
            fs.close(this.fd, (err) => {
                callback(err || error);
            });
        } else {
            callback(error);
        }
    }
}

// const stream = new FileWriteStream({
//     highWaterMark: 1800,
//     fileName: "text.txt",
// });
// stream.write(Buffer.from("this is some string"));
// stream.end(Buffer.from("Our last write "));

// stream.on("finish", () => {
//     console.log("Stream was finished");
// });

// 1 billion
// const numberOfWrites = 1000000000;
// 100 million
// const numberOfWrites = 100000000;
// 1 million
const numberOfWrites = 1000000;

(async () => {
    console.time("writeMany");

    // const fileHandler = await fsPromises.open("text_million.txt", "w");

    const stream = new FileWriteStream({
        // highWaterMark: 1800,
        fileName: "text_million.txt",
    });
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
    });
})();
