"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crypto = void 0;
const node_forge_1 = __importDefault(require("node-forge"));
var crypto;
(function (crypto) {
    function sha256(data, token) {
        const key = node_forge_1.default.util.createBuffer(token, 'utf8');
        const hmac = node_forge_1.default.hmac.create();
        hmac.start('sha256', key);
        hmac.update(data);
        return hmac.digest().toHex();
    }
    crypto.sha256 = sha256;
    function aesEncrypt(content, key) {
        if (key.startsWith('0x')) {
            key = key.substring(2);
        }
        const hexKey = node_forge_1.default.util.createBuffer(node_forge_1.default.util.hexToBytes(key));
        const contentBytes = node_forge_1.default.util.createBuffer(content);
        const iv = node_forge_1.default.random.getBytesSync(16);
        const cipher = node_forge_1.default.cipher.createCipher('AES-CBC', hexKey);
        cipher.start({ iv: iv });
        cipher.update(node_forge_1.default.util.createBuffer(contentBytes));
        cipher.finish();
        const encrypted = cipher.output;
        return encrypted.toHex();
    }
    crypto.aesEncrypt = aesEncrypt;
    function aesDecrypt(encryptedHexStr, key) {
        if (key.startsWith('0x')) {
            key = key.substring(2);
        }
        const hexKey = node_forge_1.default.util.createBuffer(node_forge_1.default.util.hexToBytes(key));
        const encrypted = node_forge_1.default.util.createBuffer(node_forge_1.default.util.hexToBytes(encryptedHexStr));
        const iv = encrypted.getBytes(16);
        const decipher = node_forge_1.default.cipher.createDecipher('AES-CBC', hexKey);
        decipher.start({ iv: iv });
        decipher.update(encrypted);
        const result = decipher.finish();
        if (!result) {
            console.log('decipher.finish() failed: result==false');
        }
        return decipher.output.data;
    }
    crypto.aesDecrypt = aesDecrypt;
})(crypto || (exports.crypto = crypto = {}));
//# sourceMappingURL=crypto.js.map