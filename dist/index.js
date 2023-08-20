"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const network_1 = require("./network/network");
const cart_1 = require("./domains/cart");
const times_1 = require("./types/times");
const kv_1 = require("./network/storage/kv");
const browser_1 = require("./network/client/browser");
network_1.network.init({
    access: "http://localhost:80",
    onLogin: null,
    scope: { code: "abc", jd: "steppe_jd", vn: "steppe" },
    secret: {
        pub: '0xd8460d6F1AA7f71458e939063119838dc2c70f99',
        pri: '0x2ae9d38c9adf4967488286b111ed3b511b57111b15e7eedca76e8caea228f99b'
    },
});
network_1.network.use(new kv_1.KVStorage(), new browser_1.BrowserClient());
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