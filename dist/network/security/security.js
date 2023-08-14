"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmptyToken = void 0;
function getEmptyToken() {
    return {
        refreshTokenPub: '',
        refreshTokenExpire: new Date(0),
        refreshToken: '',
        tokenPub: '',
        tokenExpire: new Date(0),
        token: '',
    };
}
exports.getEmptyToken = getEmptyToken;
//# sourceMappingURL=security.js.map