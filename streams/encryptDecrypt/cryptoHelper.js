const { scrypt, createCipheriv, createDecipheriv } = require("crypto");

const algorithm = "aes-192-cbc";
const password = "d6F3Efeqd6F3Efeqd6F3Efeq";

const encrypt = async (data) => {
    return new Promise((resolve, reject) => {
        scrypt(password, "salt", 24, (err, key) => {
            if (err) reject(err);

            // Use a fixed IV for simplicity (you might want to use a more secure method)
            const iv = Buffer.from("0123456789012345"); // 16 bytes

            const cipher = createCipheriv(algorithm, key, iv);

            // let encrypted = cipher.update(data, "utf-8", "hex");
            let encrypted = cipher.update(data, "utf-8", "ascii");
            // encrypted += cipher.final("hex");
            encrypted += cipher.final("ascii");

            resolve(encrypted);
        });
    });
};

const decrypt = async (encryptedData) => {
    return new Promise((resolve, reject) => {
        scrypt(password, "salt", 24, (err, key) => {
            if (err) reject(err);

            // Use the same fixed IV used during encryption
            const iv = Buffer.from("0123456789012345"); // 16 bytes

            const decipher = createDecipheriv(algorithm, key, iv);

            // let decrypted = decipher.update(encryptedData, "hex", "utf8");
            let decrypted = decipher.update(encryptedData, "ascii", "utf-8");
            // decrypted += decipher.final("utf8");
            decrypted += decipher.final("utf-8");

            resolve(decrypted);
        });
    });
};

if (require.main === module) {
    (async () => {
        try {
            let encrypted = await encrypt(Buffer.from("fools"));
            console.log(`Encrypted value: ${encrypted}`);
            let decrypted = await decrypt(encrypted);
            console.log(`Decrypted value: ${decrypted}`);
        } catch (error) {
            console.error(error);
        }
    })();
}

module.exports = { encrypt, decrypt };
