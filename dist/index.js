"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./network/rest/client");
console.log("Hello, Bitstwinkle!");
const lightCli = new client_1.LightClient({ BaseURL: "http://localhost:80" });
const formData = new URLSearchParams();
formData.append('username', 'john');
formData.append('password', 'secret');
lightCli.axios().request({
    method: "post",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: "http://localhost:80/ping.do?a=5&b=6",
    params: {
        "aX": "aaaa",
        "bX": true,
    },
    data: formData.toString()
});
//# sourceMappingURL=index.js.map