"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = md5;
var crypto_1 = require("crypto");
function md5(input) {
    return (0, crypto_1.createHash)('md5').update(input).digest('hex');
}
