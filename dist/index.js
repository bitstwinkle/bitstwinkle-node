"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aes_1 = require("./tools/aes/aes");
const s = new Date();
const secPri = '0x2ae9d38c9adf4967488286b111ed3b511b57111b15e7eedca76e8caea228f99b';
const tokenPri = '0x61b6dd872dc7cb97aeebc4f4cf253ca7814b8b370df9831a1e2655caa3e933ae';
const entryPriKey = aes_1.aes.encrypt('123456', secPri);
console.log('secPri', secPri, (new Date().getTime() - s.getTime()));
console.log('tokenPri', tokenPri, (new Date().getTime() - s.getTime()));
console.log('entryPriKey', entryPriKey, (new Date().getTime() - s.getTime()));
const entryPri2 = 'f27e3460672a0a6e767886b6fa974423d80de27b49fea36bbb444f713b2f4614d037e9683aaa014eb9e9d3d104278f6be41d981cda022e7847f664d631dd4525dff3b6609839d8e67c5cfc0d3c33580a4a0247a0f96278b5eea5bc3a6cc9556b';
const decryptPriKey = aes_1.aes.decrypt(entryPri2, secPri);
console.log('decryptPriKey', decryptPriKey, (new Date().getTime() - s.getTime()));
//# sourceMappingURL=index.js.map