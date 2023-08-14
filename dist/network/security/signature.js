"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = void 0;
const crypto_1 = require("crypto");
function sign(data, token) {
    const key = Buffer.from(token);
    const h = (0, crypto_1.createHmac)('sha256', key);
    h.update(data);
    const signature = h.digest('hex');
    return { signStr: signature, err: null };
}
exports.sign = sign;
//# sourceMappingURL=signature.js.map