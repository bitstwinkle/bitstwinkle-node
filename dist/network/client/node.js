"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeClient = void 0;
const network_1 = require("../network");
const axios_1 = __importDefault(require("axios"));
const sys_1 = require("../../tools/sys");
const axios_2 = require("./axios");
class NodeClient {
    axiosInstance;
    constructor() {
        this.axiosInstance = axios_1.default.create({
            baseURL: network_1.network.options().access,
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
    doInit() {
        this.axiosInstance.interceptors.request.use(axios_2.axiosOnBeforeReq, axios_2.axiosOnReqError);
        this.axiosInstance.interceptors.response.use(axios_2.axiosOnAfterResp, axios_2.axiosOnRespError);
    }
}
exports.NodeClient = NodeClient;
//# sourceMappingURL=node.js.map