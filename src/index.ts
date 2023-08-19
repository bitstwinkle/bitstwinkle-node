import {node} from "./network/rest/node";
import {io} from "./types/io/io";
import {sys} from "./tools/sys/sys";
import {aes} from "./tools/aes/aes.node";
import {createHmac} from "crypto";
import {network} from "./network/network";
import {cart} from "./domains/cart";
import {times} from "./types/times";

// console.log("Hello, Bitstwinkle!");

// const s = new Date()
// const secPri = '0x2ae9d38c9adf4967488286b111ed3b511b57111b15e7eedca76e8caea228f99b'
// const tokenPri = '0x61b6dd872dc7cb97aeebc4f4cf253ca7814b8b370df9831a1e2655caa3e933ae'
// const entryPriKey = aes.encrypt('123456', secPri)
// console.log('secPri', secPri, (new Date().getTime() - s.getTime()))
// console.log('tokenPri', tokenPri, (new Date().getTime() - s.getTime()))
// console.log('entryPriKey', entryPriKey, (new Date().getTime() - s.getTime()))
//
// // // const entryPri = '8b4d90f8cdea11fe733b50cf4fd781c71976451514dfbb9934ff7b475e6bc865412038c51ace56f5d2ee0a97eed7cd9ce77c1c52e4137addb7f752715124c5ece7188a4ee762ddf71e95ea2b424049d9'
// const entryPri2 = 'f27e3460672a0a6e767886b6fa974423d80de27b49fea36bbb444f713b2f4614d037e9683aaa014eb9e9d3d104278f6be41d981cda022e7847f664d631dd4525dff3b6609839d8e67c5cfc0d3c33580a4a0247a0f96278b5eea5bc3a6cc9556b'
// const decryptPriKey = aes.decrypt(entryPri2, secPri)
// console.log('decryptPriKey', decryptPriKey, (new Date().getTime() - s.getTime()))
//

//
// const buf = 'Twinkle-Nonce=14de89ca0da843cb86712e5b1e859f75;Twinkle-Timestamp=1692417281945;Twinkle-Token-Pub=0x6CA6Df0A29f8b858b70AcED9a3a6efEddA28fA23;__b_o_d_y__={\"AAAA\":\"aa\",\"BBBB\":\"bbb\",\"BBAA\":\"bbb\",\"AABB\":\"bbb\",\"c\":\"xxxx\\\"\"}'
// // const buf = 'Twinkle-Nonce=14de89ca0da843cb86712e5b1e859f75;Twinkle-Timestamp=1692417281945;Twinkle-Token-Pub=0x6CA6Df0A29f8b858b70AcED9a3a6efEddA28fA23;__b_o_d_y__={\\\\"AAAA\\\\":\\\\"aa\\\\",\\\\"BBBB\\\\":\\\\"bbb\\\\",\\\\"BBAA\\\\":\\\\"bbb\\\\",\\\\"AABB\\\\":\\\\"bbb\\\\",\\\\"c\\\\":\\\\"xxxx\\\\\\\\"\\\\"}'
// const key = Buffer.from('0x65872d80b59dfb3910437de029cfcf7a1b881f8f54b4da2171faafc1dfad61d2');
// console.log("key,", key)
// const bufData = Buffer.from(buf)
// console.log("bufData,", bufData)
// const h = createHmac('sha256', key);
// h.update(bufData);
// const signature = h.digest('hex');
// console.log(signature)

// console.log(pri32); // 输出: db66ad9fffad25ae2a52cb4b3d20a65debc1047704a6bf2bdf30cab5b6bcec0c
//
// node.initClientEnv({
//     baseURL: "http://localhost:80",
//     secretPub: '0xd8460d6F1AA7f71458e939063119838dc2c70f99',
//     secretPri: '0x2ae9d38c9adf4967488286b111ed3b511b57111b15e7eedca76e8caea228f99b',
// })
// const nodeCli = new node.Client()
// //bitstwinkle://steppe/steppe_
// // jd/abc
// network.init({code: "abc", jd: "steppe_jd", vn: "steppe"}, nodeCli)
//
// async function test() {
//     const [newCart, newErr] = await cart.put({
//         commodity_id: "1",
//         id: "",
//         lead: {
//             owner: {
//                 code: 'user',
//                 id: '123456',
//             },
//             code: 'mall',
//         },
//         quantity: 1,
//         scope: network.scope(),
//     })
//     console.log(newCart, newErr)
//     const [cartM, err] = await cart.get({
//         id: null,
//         lead: {
//             owner: {
//                 code: 'user',
//                 id: '123456',
//             },
//             code: 'mall',
//         },
//         scope: network.scope()
//     })
//     if (err !== null) {
//         console.error(err)
//         return
//     }
//     console.log(times.getTime(cartM?.birth_at).getFullYear())
// }
//
// test()

// async function doCall() {
//     const resp: io.Response<string> = await nodeCli.call(
//         '/ping',
//         {
//             "AAAA": "aa",
//             "BBBB": "bbb",
//             "BBAA": "bbb",
//             "AABB": "bbb",
//             c: 'xxxx"',
//         })
//     // console.log("resp--->---->", resp)
//     console.log("RUN_MODE", sys.RUN_MODE)
// }
//
// doCall()


