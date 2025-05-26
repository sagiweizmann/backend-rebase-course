const crypto = require('crypto');

const salt = 'himalayan';
const signaturekey = 'backend-rebase course';
const plaintext = 'SOLID';
const iv = 'deadbeefdecafbad';

const derivedKey = crypto.scryptSync(signaturekey, salt, 32);
const cipher = crypto.createCipheriv('AES-256-CBC', derivedKey, iv);

let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
ciphertext += cipher.final('hex');

console.log("🔗 Visit: https://course.ronklein.co.il/" + ciphertext);