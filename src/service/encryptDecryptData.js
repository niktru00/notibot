const crypto = require("crypto");
const fs = require("fs");

const ALGORITHM = "aes-256-cbc";

const UTF_8 = 'utf-8';
const BASE_64 = "base64";
function getRandomData(size) {

    return crypto.randomBytes(size);
}

function createKeyFile(path, data) {

    try {
        fs.writeFileSync(path, data);
    } catch (err) {
        console.log(err);
    }
}
function readKeyFile(path) {

    try {
        return fs.readFileSync(path);
    } catch (err) {
        console.log(err);
    }

}

// encrypt the message


function encrypt(plainText, key, outPutEncoding, iv) {
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    return cipher.update(plainText, UTF_8, BASE_64) + cipher.final(BASE_64);
}

//AES decryption
function decrypt(cipherText, key, outPutEncoding, iv) {
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    return decipher.update(cipherText, BASE_64, UTF_8) + decipher.final(UTF_8);
}

module.exports = {encrypt, decrypt, createKeyFile, readKeyFile, getRandomData};