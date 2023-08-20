"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.network = void 0;
const security_1 = require("./security/security");
const sys_1 = require("../tools/sys");
var network;
(function (network) {
    let gOptions;
    let gStorage;
    let gClient;
    let gToken = new security_1.security.Token();
    function init(options) {
        gOptions = options;
        return null;
    }
    network.init = init;
    function use(storage, cli) {
        gStorage = storage;
        gClient = cli;
        network.storage().set('token', new security_1.security.Token());
        if (sys_1.sys.isRd()) {
            network.storage().iter((key, val) => {
                console.log("[ network.storage ] ", key, val);
            });
        }
    }
    network.use = use;
    function options() {
        return gOptions;
    }
    network.options = options;
    function scope() {
        if (!gOptions || !gOptions.scope) {
            console.error('[ network.scope ] : must init first.');
        }
        return gOptions.scope;
    }
    network.scope = scope;
    function storage() {
        if (!gStorage) {
            console.error('[ network.storage ] : must init first.');
        }
        return gStorage;
    }
    network.storage = storage;
    function cli() {
        if (!gClient) {
            console.error('[ network.cli ] : must init first.');
        }
        return gClient;
    }
    network.cli = cli;
    function token() {
        const iToken = storage().get("token");
        if (iToken === null) {
            return gToken;
        }
        return gToken;
    }
    network.token = token;
    function upToken(iToken) {
        gToken.from(iToken);
        storage().set("token", gToken);
    }
    network.upToken = upToken;
    function Success(data) {
        return new Response(data, null);
    }
    network.Success = Success;
    function Error(err) {
        return new Response(null, err);
    }
    network.Error = Error;
    class Response {
        data;
        err;
        constructor(data, err) {
            this.data = data;
            if (err) {
                this.err = err;
            }
            else {
                this.err = null;
            }
        }
        isSuccess() {
            return this.err != null;
        }
        getData() {
            return this.data;
        }
    }
    network.Response = Response;
})(network || (exports.network = network = {}));
//# sourceMappingURL=network.js.map