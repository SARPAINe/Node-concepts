// encryption/decryption => crypto
// hashing-salting => crypto
// compression => zlib
// decoding/encoding => buffer text-encoding/decoding

const { pipeline } = require("node:stream");
const fs = require("node:fs/promises");
const { scrypt, createCipheriv } = require("node:crypto");

(async () => {
    const readFileHandle = await fs.open("text_million.txt", "r");
    const writeFileHandle = await fs.open("write.txt", "w");

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();

    //use pipeline in production
    // readStream.pipe(encrypt).pipe(writeStream);

    const algorithm = "aes-192-cbc";
    const password = "d6F3Efeqd6F3Efeqd6F3Efeq";

    scrypt(password, "salt", 24, (err, key) => {
        if (err) throw err;
        // Then, we'll generate a random initialization vector
        const iv = Buffer.from("0123456789012345"); // 16 bytes
        const cipher = createCipheriv(algorithm, key, iv);

        pipeline(readStream, cipher, writeStream, (err) => {
            if (err) throw err;
        });
    });
})();
