const { Duplex } = require("node:stream");
const fs = require("node:fs");

class DuplexStream extends Duplex {
    constructor({
        writableHighWaterMark,
        readableHighWaterMark,
        readFileName,
        writeFileName,
    }) {
        super({ readableHighWaterMark, writableHighWaterMark });
        this.readFileName = readFileName;
        this.writeFileName = writeFileName;
        this.readFd = null;
        this.writeFd = null;
        this.chunks = [];
        this.chunksSize = 0;
    }

    _construct(callback) {
        fs.open(this.readFileName, "r", (err, readFd) => {
            if (err) return callback(err);
            this.readFd = readFd;
            fs.open(this.writeFileName, "w", (err, writeFd) => {
                if (err) return callback(err);
                this.writeFd = writeFd;
                callback();
            });
        });
    }

    _write(chunk, encoding, callback) {
        this.chunks.push(chunk);
        this.chunksSize += chunk.length;

        if (this.chunksSize > this.writableHighWaterMark) {
            fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
                if (err) {
                    return callback(err);
                }
                this.chunks = [];
                this.chunksSize = 0;
                callback();
            });
        } else {
            // when we're done, we should call the callback function
            callback();
        }
    }

    _read(size) {
        const buff = Buffer.alloc(size);
        fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
            if (err) return this.destroy(err);
            // null is to indicate the end of the stream
            this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
        });
    }

    _final(callback) {
        fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
            if (err) return callback(err);
            this.chunks = [];
            callback();
        });
    }

    _destroy(error, callback) {
        fs.close(this.readFd, () => {
            fs.close(this.writeFd, () => {
                callback(error);
            });
        });
    }
}

const duplex = new DuplexStream({
    readFileName: "read.txt",
    writeFileName: "write.txt",
    // writableHighWaterMark: 63,
});

// duplex.write(Buffer.from("this is a string 0\n"));
// duplex.write(Buffer.from("this is a string 1\n"));
// duplex.write(Buffer.from("this is a string 2\n"));
// duplex.end(Buffer.from("end of write\n"));

// duplex.on("data", (chunk) => {
//     console.log(chunk.toString("utf-8"));

// });

duplex.on("data", (chunk) => {
    if (!duplex.write(chunk)) {
        duplex.pause();
    }
});

duplex.on("drain", () => {
    duplex.resume();
});

duplex.on("end", async () => {
    duplex.end(); // so that last chunk which is smaller than writableHighWater mark gets written
    console.log("File write completed.");
});
