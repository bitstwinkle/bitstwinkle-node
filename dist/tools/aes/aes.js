"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aes = void 0;
const crypto = __importStar(require("crypto"));
var aes;
(function (aes) {
    function encrypt(content, key) {
        if (key.startsWith('0x')) {
            key = key.substring(2);
        }
        const keyBuf = Buffer.from(key, 'hex');
        const plaintext = Buffer.from(content, 'utf8');
        const iv = crypto.randomBytes(16);
        if (!iv) {
            console.log('[ crypto.randomBytes(16) ] error: !iv');
            return '';
        }
        let block;
        try {
            block = crypto.createCipheriv('aes-256-cbc', keyBuf, iv);
        }
        catch (err) {
            console.log('[ crypto.createCipheriv ] error', err);
            return '';
        }
        const ciphertext = Buffer.concat([iv, block.update(plaintext), block.final()]);
        return ciphertext.toString('hex');
    }
    aes.encrypt = encrypt;
    function decrypt(content, key) {
        try {
            if (key.startsWith('0x')) {
                key = key.substring(2);
            }
            const keyBuf = Buffer.from(key, 'hex');
            const ciphertext = Buffer.from(content, 'hex');
            const iv = ciphertext.subarray(0, 16);
            const block = crypto.createDecipheriv('aes-256-cbc', keyBuf, iv);
            let decrypted = block.update(ciphertext.subarray(16));
            decrypted = Buffer.concat([decrypted, block.final()]);
            return decrypted.toString();
        }
        catch (error) {
            console.log('[ aes.decrypt failed ]', error);
            return '';
        }
    }
    aes.decrypt = decrypt;
})(aes || (exports.aes = aes = {}));
//# sourceMappingURL=aes.js.map