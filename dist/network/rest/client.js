"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightClient = void 0;
const axios_1 = __importDefault(require("axios"));
const security_1 = require("../security/security");
const http_1 = require("../security/http");
const DEFAULT_BITSTWINKLE_URL = "http://localhost:8080";
class Client {
    options;
    axiosInstance;
    constructor(options) {
        this.options = options;
        this.axiosInstance = axios_1.default.create({
            baseURL: this.options.BaseURL,
        });
        this.init();
    }
    axios() {
        return this.axiosInstance;
    }
}
class LightClient extends Client {
    lightToken;
    constructor(options) {
        super(options);
        this.lightToken = (0, security_1.getEmptyToken)();
    }
    init() {
        this.axiosInstance.interceptors.request.use((request) => {
            (0, http_1.signature)(request, this.lightToken.tokenPub, this.lightToken.token);
            return request;
        }, (error) => {
            return Promise.reject(error);
        });
        this.axiosInstance.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            return Promise.reject(error);
        });
        return null;
    }
    exchangeToken() {
        return null;
    }
}
exports.LightClient = LightClient;
class NodeClient extends Client {
    constructor(options) {
        super(options);
        this.init();
    }
    exchangeToken() {
        return null;
    }
    init() {
        this.axiosInstance.interceptors.request.use((config) => {
            config.headers['x'] = 'xx';
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        this.axiosInstance.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            return Promise.reject(error);
        });
        return null;
    }
}
//# sourceMappingURL=client.js.map