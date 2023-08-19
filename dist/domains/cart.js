"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cart = void 0;
const network_1 = require("../network/network");
var cart;
(function (cart) {
    async function put(req) {
        const resp = await network_1.network.cli().call('/cart/put', req);
        return [resp.data, resp.err];
    }
    cart.put = put;
    async function deduct(req) {
        const resp = await network_1.network.cli().call('/cart/deduct', req);
        return [resp.data, resp.err];
    }
    cart.deduct = deduct;
    async function selectedSwitch(req) {
        const resp = await network_1.network.cli().call('/cart/select', req);
        return [resp.data, resp.err];
    }
    cart.selectedSwitch = selectedSwitch;
    async function get(req) {
        const resp = await network_1.network.cli().call('/cart/g', req);
        return [resp.data, resp.err];
    }
    cart.get = get;
    async function clean(req) {
        const resp = await network_1.network.cli().call('/cart/clean', req);
        return resp.err;
    }
    cart.clean = clean;
})(cart || (exports.cart = cart = {}));
//# sourceMappingURL=cart.js.map