const crypto = require("node:crypto");

const algorithm = "aes-256-cbc";
const password = "d6F3Efeq";

const encryptBuffer = (data) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, password, iv);
    const encrypted = Buffer.concat([
        iv,
        cipher.update(data, "utf-8"),
        cipher.final(),
    ]);
    return encrypted;
};

(async () => {
    console.log(encryptBuffer(Buffer.from("fools")));
})();
