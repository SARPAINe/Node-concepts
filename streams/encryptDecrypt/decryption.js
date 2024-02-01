// encryption/decryption => crypto
// hashing-salting => crypto
// compression => zlib
// decoding/encoding => buffer text-encoding/decoding

const { pipeline } = require("node:stream");
const fs = require("node:fs/promises");
const { scrypt, createDecipheriv } = require("node:crypto");

(async () => {
    const readFileHandle = await fs.open("write.txt", "r");
    const writeFileHandle = await fs.open("dest.txt", "w");

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();

    const algorithm = "aes-192-cbc";
    const password = "d6F3Efeqd6F3Efeqd6F3Efeq";

    scrypt(password, "salt", 24, (err, key) => {
        if (err) throw err;
        // Then, we'll generate a random initialization vector
        // Then, we'll generate a random initialization vector
        const iv = Buffer.from("0123456789012345"); // 16 bytes
        const decipher = createDecipheriv(algorithm, key, iv);

        pipeline(readStream, decipher, writeStream, (err) => {
            if (err) throw err;
        });
    });
})();
