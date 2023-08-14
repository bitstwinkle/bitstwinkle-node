import {LightClient} from "./network/rest/client";

console.log("Hello, Bitstwinkle!");



const lightCli = new LightClient({BaseURL: "http://localhost:80"})

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
})