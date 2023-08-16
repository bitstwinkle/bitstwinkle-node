"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmptyNodeToken = exports.getEmptyToken = exports.security = void 0;
const crypto_1 = require("crypto");
const unique_1 = require("../../tools/unique/unique");
const sys_1 = require("../../tools/sys/sys");
const class_transformer_1 = require("class-transformer");
const bodyInside = '__b_o_d_y__';
function doSign(signHeader, headers, params, body, token) {
    let buf = '';
    if (signHeader && headers) {
        for (const key of signHeader) {
            buf += key + '=';
            buf += headers.get(key);
        }
    }
    if (params) {
        const sortedKeys = Object.keys(params).sort();
        if (sys_1.sys.isRd()) {
            console.log("security.doSign.sortedKeys: ", sortedKeys);
        }
        for (const key of sortedKeys) {
            buf += key + '=';
            buf += params.get(key);
        }
    }
    if (body) {
        buf += bodyInside + '=' + body;
    }
    const key = Buffer.from(token);
    const h = (0, crypto_1.createHmac)('sha256', key);
    h.update(buf);
    const signature = h.digest('hex');
    return { signStr: signature, err: null };
}
const Security = "security";
const Turn = "turn";
const HEADER_PREFIX = "Twinkle-";
const HEADER_RUN_MODE = HEADER_PREFIX + "Run-Mode";
const HEADER_SECRET_PUB = HEADER_PREFIX + "Secret-Pub";
const HEADER_TOKEN_PUB = HEADER_PREFIX + "Token-Pub";
const HEADER_NONCE = HEADER_PREFIX + "Nonce";
const HEADER_TIMESTAMP = HEADER_PREFIX + "Timestamp";
const HEADER_SIGNATURE = HEADER_PREFIX + "Signature";
const HEADER_TOKEN_EXPIRE = HEADER_PREFIX + "Expiration";
var security;
(function (security) {
    class Token {
        refreshTokenPub;
        refreshTokenExpire;
        refreshTokenPri;
        tokenPub;
        tokenExpire;
        tokenPri;
        constructor() {
            this.refreshTokenPub = '';
            this.refreshTokenPub = '';
            this.refreshTokenExpire = new Date(0);
            this.refreshTokenPri = '';
            this.tokenPub = '';
            this.tokenExpire = new Date(0);
            this.tokenPri = '';
        }
        clone(src) {
            console.log('src', src, ', this', this);
            this.tokenPub = src.token_pub;
            this.tokenPri = src.token_pri;
            this.tokenPri = src.token;
        }
        isAvailable() {
            if (this.tokenPri.length === 0 || this.tokenPub.length === 0) {
                if (sys_1.sys.isRd()) {
                    console.log('[ security.isAvailable ] token empty, or tokenPub empty');
                }
                return false;
            }
            if (this.tokenExpire < new Date()) {
                if (sys_1.sys.isRd()) {
                    console.log('[ security.isAvailable ] token expire');
                }
                return false;
            }
            return true;
        }
    }
    __decorate([
        (0, class_transformer_1.Expose)({ name: 'token_pub' }),
        __metadata("design:type", String)
    ], Token.prototype, "tokenPub", void 0);
    security.Token = Token;
    function injectSecret(secretPub, secretPri, setHeader, getParams, getBody) {
        const nonce = (0, unique_1.randID)();
        const timestamp = new Date().getTime();
        setHeader(HEADER_NONCE, nonce);
        setHeader(HEADER_TIMESTAMP, timestamp);
        setHeader(HEADER_SECRET_PUB, secretPub);
        const { signStr, err } = doSign([HEADER_NONCE, HEADER_TIMESTAMP, HEADER_SECRET_PUB], new Map().
            set(HEADER_NONCE, nonce).
            set(HEADER_TIMESTAMP, timestamp).
            set(HEADER_TOKEN_PUB, secretPub), getParams(), getBody(), secretPri);
        if (err) {
            console.log("security.injectToken.err", err);
            return err;
        }
        if (err) {
            return err;
        }
        setHeader(HEADER_SIGNATURE, signStr);
        if (sys_1.sys.isRd()) {
            console.log('security.injectSecret: signStr=', signStr);
        }
        return null;
    }
    security.injectSecret = injectSecret;
    function injectToken(tokenPub, tokenPri, setHeader, getParams, getBody) {
        const nonce = (0, unique_1.randID)();
        const timestamp = new Date().getTime();
        setHeader(HEADER_NONCE, nonce);
        setHeader(HEADER_TIMESTAMP, timestamp);
        setHeader(HEADER_TOKEN_PUB, tokenPub);
        const { signStr, err } = doSign([HEADER_NONCE, HEADER_TIMESTAMP, HEADER_TOKEN_PUB], new Map().
            set(HEADER_NONCE, nonce).
            set(HEADER_TIMESTAMP, timestamp).
            set(HEADER_TOKEN_PUB, tokenPub), getParams(), getBody(), tokenPri);
        if (err) {
            console.log("security.injectToken.err", err);
            return err;
        }
        setHeader(HEADER_SIGNATURE, signStr);
        if (sys_1.sys.isRd()) {
            console.log('security.injectToken: signStr=', signStr);
        }
        return null;
    }
    security.injectToken = injectToken;
    function analyzeResponse(get) {
        const strRunMode = get(HEADER_RUN_MODE);
        sys_1.sys.SetRunMode(sys_1.sys.modeOf(strRunMode));
    }
    security.analyzeResponse = analyzeResponse;
})(security || (exports.security = security = {}));
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
function getEmptyNodeToken() {
    return {
        tokenPub: '',
        tokenExpire: new Date(0),
        token: '',
    };
}
exports.getEmptyNodeToken = getEmptyNodeToken;
//# sourceMappingURL=security.js.map