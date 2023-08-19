"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.node = void 0;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../../types/io/errors");
const security_1 = require("../security/security");
const client_1 = require("./client");
const sys_1 = require("../../tools/sys/sys");
const io_1 = require("../../types/io/io");
const aes_1 = require("../../tools/aes/aes");
const NodeExchangeTokenURL = '/security/turn';
var node;
(function (node) {
    const gLocalStore = new client_1.cli.KVStore();
    function initClientEnv(options) {
        if (!options) {
            throw new Error('require option');
        }
        if (options.baseURL.length == 0) {
            options.baseURL = client_1.cli.DEFAULT_BITSTWINKLE_URL;
        }
        if (options.secretPub.length == 0 || options.secretPri.length == 0) {
            throw new Error('require options.secretPub and options.secretPri');
        }
        gLocalStore.set('options', options);
        gLocalStore.set('token', new security_1.security.Token());
    }
    node.initClientEnv = initClientEnv;
    class Client {
        options;
        axiosInstance;
        token;
        constructor() {
            this.options = gLocalStore.get('options');
            this.token = gLocalStore.get('token');
            this.axiosInstance = axios_1.default.create({
                baseURL: this.options.baseURL,
            });
            this.doInit();
        }
        async call(api, data) {
            if (sys_1.sys.isRd()) {
                console.log('[ system run mode ] : ', sys_1.sys.RUN_MODE);
            }
            const resp = await this.axiosInstance.post(api, data);
            return resp.data;
        }
        exchangeToken() {
            this.doExchangeToken();
        }
        doInit() {
            this.axiosInstance.interceptors.request.use(async (req) => {
                if (sys_1.sys.isRd()) {
                    console.log('[ api: ', req.url, "] ", req.data);
                }
                if (req.url?.endsWith(NodeExchangeTokenURL)) {
                    const err = security_1.security.injectSecret(this.options.secretPub, this.options.secretPri, (k, v) => {
                        req.headers[k] = v;
                    }, () => {
                        return (0, client_1.axiosGetParams)(req);
                    }, () => {
                        return req.data;
                    });
                    if (err) {
                        console.log("[ node.client.injectSecret ] node auth security.injectSecret failed", err);
                    }
                    return req;
                }
                if (!this.token.isAvailable()) {
                    const err = await this.doExchangeToken();
                    if (err != null) {
                        console.log("[ client.node.doExchangeToken ] failed", err);
                        throw new Error(err.message);
                    }
                }
                if (sys_1.sys.isRd()) {
                    console.log('[ client.node.token ]', this.token);
                }
                const err = security_1.security.injectToken(this.token.tokenPub, this.token.tokenPri, (k, v) => {
                    req.headers[k] = v;
                }, () => {
                    return (0, client_1.axiosGetParams)(req);
                }, () => {
                    return req.data;
                });
                if (err) {
                    console.log("[ node.client.injectToken ] node auth security.injectToken failed", err);
                }
                return req;
            }, (error) => {
                if (sys_1.sys.isRd()) {
                    console.log('[ api.err: ', error.request.path, '] ', error);
                }
                return Promise.reject({
                    data: null,
                    err: {
                        type: errors_1.errors.SYSTEM,
                        code: 'LOCAL_ERROR',
                        message: error.message,
                    }
                });
            });
            this.axiosInstance.interceptors.response.use((resp) => {
                security_1.security.analyzeResponse((k) => {
                    return resp.headers[k];
                });
                if (sys_1.sys.isRd()) {
                    console.log('[ api.resp: ', resp.request.path, '][', resp.status, "] ", resp.data);
                }
                const customResponse = {
                    ...resp,
                    data: io_1.io.Success(resp.data)
                };
                return customResponse;
            }, (error) => {
                if (!error.request || !error.response) {
                    const customResponse = {
                        ...error.response,
                        data: io_1.io.Error({
                            code: "LOCAL_ERROR", type: errors_1.errors.SYSTEM,
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
                    data: io_1.io.Error(error.response.data)
                };
                return customResponse;
            });
        }
        async doExchangeToken() {
            const resp = await this.call('/security/turn', {});
            if (resp.err != null) {
                return resp.err;
            }
            if (resp.data) {
                this.token.from(resp.data);
                this.token.tokenPri = aes_1.aes.decrypt(this.token.tokenPri, this.options.secretPri);
                gLocalStore.set("token", this.token);
            }
            return null;
        }
    }
    node.Client = Client;
})(node || (exports.node = node = {}));
//# sourceMappingURL=node.js.map