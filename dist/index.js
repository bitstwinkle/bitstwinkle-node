"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./network/rest/node");
const network_1 = require("./network/network");
const cart_1 = require("./domains/cart");
const times_1 = require("./types/times");
node_1.node.initClientEnv({
    baseURL: "http://localhost:80",
    secretPub: '0xd8460d6F1AA7f71458e939063119838dc2c70f99',
    secretPri: '0x2ae9d38c9adf4967488286b111ed3b511b57111b15e7eedca76e8caea228f99b',
});
const nodeCli = new node_1.node.Client();
network_1.network.init({ code: "abc", jd: "steppe_jd", vn: "steppe" }, nodeCli);
async function test() {
    const [newCart, newErr] = await cart_1.cart.put({
        commodity_id: "1",
        id: "",
        lead: {
            owner: {
                code: 'user',
                id: '123456',
            },
            code: 'mall',
        },
        quantity: 1,
        scope: network_1.network.scope(),
    });
    console.log(newCart, newErr);
    const [cartM, err] = await cart_1.cart.get({
        id: null,
        lead: {
            owner: {
                code: 'user',
                id: '123456',
            },
            code: 'mall',
        },
        scope: network_1.network.scope()
    });
    if (err !== null) {
        console.error(err);
        return;
    }
    console.log(times_1.times.getTime(cartM?.birth_at).getFullYear());
}
test();
//# sourceMappingURL=index.js.map