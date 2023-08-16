"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosGetParams = exports.cli = void 0;
var cli;
(function (cli) {
    cli.DEFAULT_BITSTWINKLE_URL = "http://localhost:8080";
    class KVStore {
        db = new Map;
        get(key) {
            return this.db.get(key);
        }
        set(key, val) {
            this.db.set(key, val);
        }
    }
    cli.KVStore = KVStore;
})(cli || (exports.cli = cli = {}));
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
//# sourceMappingURL=client.js.map