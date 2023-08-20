"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosGetParams = exports.doTurnByRefreshToken = exports.doTurnBySecret = exports.axiosOnRespError = exports.axiosOnAfterResp = exports.axiosOnReqError = exports.axiosOnBeforeReq = void 0;
const axios_1 = __importDefault(require("axios"));
const sys_1 = require("../../tools/sys");
const crypto_1 = require("../../tools/crypto");
const security_1 = require("../security/security");
const errors_1 = require("../../types/errors");
const network_1 = require("../network");
async function axiosOnBeforeReq(req) {
    if (sys_1.sys.isRd()) {
        console.log('[ api: ', req.url, "] ", req.data);
    }
    let token = network_1.network.token();
    if (!token.isAvailable()) {
        if (token.isRefreshAvailable()) {
            const err = await doTurnByRefreshToken();
            if (err !== null) {
                return Promise.reject({
                    data: null,
                    err: {
                        type: errors_1.errors.SYSTEM,
                        code: 'req_err',
                        message: err.message,
                    }
                });
            }
            token = network_1.network.storage().get('token');
        }
        else {
            if (network_1.network.options().secret != null) {
                const err = await doTurnBySecret();
                if (err !== null) {
                    return Promise.reject({
                        data: null,
                        err: {
                            type: errors_1.errors.SYSTEM,
                            code: 'req_err',
                            message: err.message,
                        }
                    });
                }
                token = network_1.network.storage().get('token');
            }
            else {
                const onLoginFunc = network_1.network.options().onLogin;
                if (onLoginFunc) {
                    onLoginFunc();
                    return Promise.reject({
                        data: null,
                        err: {
                            type: errors_1.errors.APPLICATION,
                            code: 'req_err',
                            message: 'redirect to login...',
                        }
                    });
                }
            }
        }
    }
    const err = security_1.security.injectToken(token.tokenPub, token.tokenPri, (k, v) => {
        req.headers[k] = v;
    }, () => {
        return axiosGetParams(req);
    }, () => {
        return req.data;
    });
    if (err) {
        console.log("[ axios.injectToken ] axios auth security.injectToken failed", err);
    }
    return req;
}
exports.axiosOnBeforeReq = axiosOnBeforeReq;
function axiosOnReqError(error) {
    if (sys_1.sys.isRd()) {
        console.log('[ api.err: ', error.request.path, '] ', error);
    }
    return Promise.reject({
        data: null,
        err: {
            type: errors_1.errors.SYSTEM,
            code: 'req_err',
            message: error.message,
        }
    });
}
exports.axiosOnReqError = axiosOnReqError;
function axiosOnAfterResp(resp) {
    security_1.security.analyzeResponse((k) => {
        return resp.headers[k];
    });
    if (sys_1.sys.isRd()) {
        console.log('[ api.resp: ', resp.request.path, '][', resp.status, "] ", resp.data);
    }
    const customResponse = {
        ...resp,
        data: network_1.network.Success(resp.data)
    };
    return customResponse;
}
exports.axiosOnAfterResp = axiosOnAfterResp;
function axiosOnRespError(error) {
    if (!error.request || !error.response) {
        const customResponse = {
            ...error.response,
            data: network_1.network.Error({
                code: "resp_err", type: errors_1.errors.SYSTEM,
                message: error.message
            })
        };
        return customResponse;
    }
    if (sys_1.sys.isRd()) {
        console.log('[ api.resp.err: ', error.request.path, '][', error.response.status, "] ", error.response.data);
    }
    const customResponse = {
        ...error.response,
        data: network_1.network.Error(error.response.data)
    };
    return customResponse;
}
exports.axiosOnRespError = axiosOnRespError;
async function axiosOnBeforeSecretReq(req) {
    if (sys_1.sys.isRd()) {
        console.log('[ api: ', req.url, "] ", req.data);
    }
    const err = security_1.security.injectSecret(network_1.network.options().secret?.pub, network_1.network.options().secret?.pri, (k, v) => {
        req.headers[k] = v;
    }, () => {
        return axiosGetParams(req);
    }, () => {
        return req.data;
    });
    if (err) {
        console.log("[ axios.axiosOnBeforeSecretReq ] axios auth security.injectSecret failed", err);
        return Promise.reject({
            data: null,
            err: {
                type: errors_1.errors.SYSTEM,
                code: 'req_err',
                message: err.message,
            }
        });
    }
    return req;
}
async function doTurnBySecret() {
    const secretAxios = axios_1.default.create({
        baseURL: network_1.network.options().access,
    });
    secretAxios.interceptors.request.use(axiosOnBeforeSecretReq, axiosOnReqError);
    secretAxios.interceptors.response.use(axiosOnAfterResp, axiosOnRespError);
    const axiosResp = await secretAxios.post('/security/access/secret', {});
    const resp = axiosResp.data;
    if (resp.err != null) {
        return resp.err;
    }
    if (resp.data) {
        const iToken = resp.data;
        iToken.token_pri = crypto_1.crypto.aesDecrypt(iToken.token_pri, network_1.network.options().secret?.pri);
        network_1.network.upToken(iToken);
    }
    return null;
}
exports.doTurnBySecret = doTurnBySecret;
async function axiosOnBeforeRefreshReq(req) {
    if (sys_1.sys.isRd()) {
        console.log('[ api: ', req.url, "] ", req.data);
    }
    const token = network_1.network.token();
    if (!token.isAvailable()) {
        return Promise.reject({
            data: null,
            err: {
                type: errors_1.errors.CODING,
                code: 'token_unavailable',
                message: 'assert token available',
            }
        });
    }
    const err = security_1.security.injectSecret(token.refreshTokenPub, token.refreshTokenPri, (k, v) => {
        req.headers[k] = v;
    }, () => {
        return axiosGetParams(req);
    }, () => {
        return req.data;
    });
    if (err) {
        console.log("[ axios.axiosOnBeforeRefreshReq ] axios auth security.injectSecret failed", err);
        return Promise.reject({
            data: null,
            err: {
                type: errors_1.errors.SYSTEM,
                code: 'req_err',
                message: err.message,
            }
        });
    }
    return req;
}
async function doTurnByRefreshToken() {
    const refreshAxios = axios_1.default.create({
        baseURL: network_1.network.options().access,
    });
    refreshAxios.interceptors.request.use(axiosOnBeforeRefreshReq, axiosOnReqError);
    refreshAxios.interceptors.response.use(axiosOnAfterResp, axiosOnRespError);
    const axiosResp = await refreshAxios.post('/security/access/refresh', {});
    const resp = axiosResp.data;
    if (resp.err != null) {
        return resp.err;
    }
    if (resp.data) {
        const srcToken = network_1.network.token();
        const iToken = resp.data;
        iToken.token_pri = crypto_1.crypto.aesDecrypt(iToken.token_pri, srcToken.refreshTokenPri);
        network_1.network.upToken(iToken);
    }
    return null;
}
exports.doTurnByRefreshToken = doTurnByRefreshToken;
function axiosGetParams(req) {
    const wrapper = new Map();
    if (req.params) {
        Object.keys(req.params).forEach((key) => {
            wrapper.set(key, req.params[key]);
        });
    }
    if (req.url) {
        const idx = req.url.search('\\?');
        if (idx > -1) {
            const urlQuery = req.url.substring(idx);
            const urlSearchParams = new URLSearchParams(urlQuery);
            urlSearchParams.forEach((value, key) => {
                wrapper.set(key, value);
            });
        }
    }
    return wrapper;
}
exports.axiosGetParams = axiosGetParams;
//# sourceMappingURL=axios.js.map