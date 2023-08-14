"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSignature = exports.signature = void 0;
const unique_1 = require("../../tools/unique/unique");
const signature_1 = require("./signature");
const Security = "security";
const Turn = "turn";
const HEADER_PREFIX = "Twinkle-";
const HeaderSecretPub = HEADER_PREFIX + "Secret-Pub";
const HEADER_TOKEN_PUB = HEADER_PREFIX + "Token-Pub";
const HEADER_NONCE = HEADER_PREFIX + "Nonce";
const HEADER_TIMESTAMP = HEADER_PREFIX + "Timestamp";
const HEADER_SIGNATURE = HEADER_PREFIX + "Signature";
const Header_Token_Expire = HEADER_PREFIX + "Expiration";
const signWithHeaderKey = [HEADER_NONCE, HEADER_TIMESTAMP, HEADER_TOKEN_PUB];
function signature(req, tokenPub, tokenPri) {
    const nonce = (0, unique_1.randID)();
    const timestamp = new Date().getTime();
    req.headers[HEADER_NONCE] = nonce;
    req.headers[HEADER_TIMESTAMP] = timestamp.toString();
    req.headers[HEADER_TOKEN_PUB] = tokenPub;
    genSignature(req, "-----");
    return null;
}
exports.signature = signature;
function genSignature(req, priKey) {
    const wrapper = new Map();
    const params = req.params;
    if (params) {
        Object.keys(params).forEach((key) => {
            const value = params[key];
            console.error("----------->", `${key}: ${value}`);
        });
    }
    const buf = "";
    const { signStr, err } = (0, signature_1.sign)(buf, priKey);
    return { signStr, err };
}
exports.genSignature = genSignature;
function doDataToMap(inputData, wrapper) {
    if (inputData.size === 0) {
        return null;
    }
    inputData.forEach((values, key) => {
        switch (values.length) {
            case 0:
                return;
            case 1:
                wrapper.set(key, values[0]);
                return;
        }
        let buf = "";
        values.forEach((value) => {
            buf += value;
        });
        wrapper.set(key, buf);
    });
    return null;
}
//# sourceMappingURL=http.js.map