"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.network = void 0;
var network;
(function (network) {
    let gScope;
    let gClient;
    function init(scope, cli) {
        gScope = scope;
        gClient = cli;
    }
    network.init = init;
    function scope() {
        if (!gScope) {
            console.error('[ network.scope ] : must init first.');
        }
        return gScope;
    }
    network.scope = scope;
    function cli() {
        if (!gClient) {
            console.error('[ network.cli ] : must init first.');
        }
        return gClient;
    }
    network.cli = cli;
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