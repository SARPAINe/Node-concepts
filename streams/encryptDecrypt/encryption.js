// encryption/decryption => crypto
// hashing-salting => crypto
// compression => zlib
// decoding/encoding => buffer text-encoding/decoding

const { Transform, pipeline } = require("node:stream");
const fs = require("node:fs/promises");
const crypto = require("node:crypto");

class Encrypt extends Transform {
    _transform(chunk, encoding, callback) {
        console.log(chunk);
        const chunkInString = chunk.toString("utf-8");
        console.log(chunkInString);
        const chunkInBuffer = Buffer.from(chunkInString);
        console.log(chunkInBuffer);
        // this.push(chunkInBuffer);
        callback(null, chunk);
        // callback(null, encryptBuffer(chunk));
    }
}

const algorithm = "aes-256-ctr",
    password = Buffer.from("d6F3Efeq", "utf-8");

const encryptBuffer = (chunk) => {
    var cipher, result, iv;

    // Create an iv
    iv = crypto.randomBytes(16);

    // Create a new cipher
    cipher = crypto.createCipheriv(algorithm, password, iv);

    // Create the new chunk
    result = Buffer.concat([iv, cipher.update(chunk, "utf-8"), cipher.final()]);

    return result;
};

(async () => {
    const readFileHandle = await fs.open("read.txt", "r");
    const writeFileHandle = await fs.open("write.txt", "w");

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();

    const encrypt = new Encrypt();
    //use pipeline in production
    // readStream.pipe(encrypt).pipe(writeStream);
    pipeline(readStream, encrypt, writeStream, (err) => {
        if (err) throw err;
    });
})();
