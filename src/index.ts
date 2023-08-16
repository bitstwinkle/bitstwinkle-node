import {node} from "./network/rest/node";
import {io} from "./types/io/io";
import {sys} from "./tools/sys/sys";

// console.log("Hello, Bitstwinkle!");



node.initClientEnv({
    baseURL: "http://localhost:80",
    secretPub: '0xd8460d6F1AA7f71458e939063119838dc2c70f99',
    secretPri: '0x2ae9d38c9adf4967488286b111ed3b511b57111b15e7eedca76e8caea228f99b',
})
const nodeCli = new node.Client()

async function doCall() {
    const resp: io.Response<string> = await nodeCli.call(
        '/ping',
        {
            "AAAA": "aa",
            "BBBB": "bbb",
            "BBAA": "bbb",
            "AABB": "bbb",
        })
    console.log("resp--->---->", resp)
    console.log("RUN_MODE", sys.RUN_MODE)
}

doCall()


