"use strict";
/*
 *
 *  *  * Copyright (C) 2023 The Developer bitstwinkle
 *  *  *
 *  *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  *  * you may not use this file except in compliance with the License.
 *  *  * You may obtain a copy of the License at
 *  *  *
 *  *  *      http://www.apache.org/licenses/LICENSE-2.0
 *  *  *
 *  *  * Unless required by applicable law or agreed to in writing, software
 *  *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  *  * See the License for the specific language governing permissions and
 *  *  * limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSignature = exports.signature = void 0;
const unique_1 = require("@/tools/unique/unique");
const signature_1 = require("@/network/security/signature");
const Security = "security";
const Turn = "turn";
const HeaderPrefix = "Twinkle-"; //Uniform prefix
const HeaderSecretPub = HeaderPrefix + "Secret-Pub"; //Secret Pub
const HeaderTokenPub = HeaderPrefix + "Token-Pub"; //Token Public
const HeaderNonce = HeaderPrefix + "Nonce"; //Nonce
const HeaderTimestamp = HeaderPrefix + "Timestamp"; //Timestamp
const HeaderSignature = HeaderPrefix + "Signature"; //Signature
const HeaderTokenExpire = HeaderPrefix + "Expiration"; //Token Expiration
const signWithHeaderKey = [HeaderNonce, HeaderTimestamp, HeaderTokenPub];
function signature(req, tokenPub, tokenPri) {
    const nonce = (0, unique_1.randID)();
    const timestamp = new Date().getTime();
    req.setHeader(HeaderTokenPub, tokenPub);
    req.setHeader(HeaderNonce, nonce);
    req.setHeader(HeaderTimestamp, timestamp.toString());
    return null;
}
exports.signature = signature;
function genSignature(req, priKey) {
    const wrapper = new Map();
    if (req.getQueryMap().size > 0) {
        doDataToMap(req.getQueryMap(), wrapper);
    }
    if (req.getPostForm().size > 0) {
        doDataToMap(req.getPostForm(), wrapper);
    }
    const sortedKeys = Object.keys(wrapper).sort();
    let buf = "";
    for (const key of sortedKeys) {
        buf += wrapper.get(key);
    }
    const bodyStr = req.getBody();
    if (bodyStr.length > 0) {
        buf += bodyStr;
    }
    for (const key of signWithHeaderKey) {
        buf += req.getHeader(key);
    }
    const { signStr, err } = (0, signature_1.sign)(buf, priKey);
    return { signStr, err };
}
exports.genSignature = genSignature;
function doDataToMap(inputData, wrapper) {
    if (inputData.size == 0) {
        return null;
    }
    inputData.forEach((values, key) => {
        switch (values.length) {
            case 0:
                return;
            case 1:
                wrapper.set(key, values[0]);
                return;
        }
        let buf = "";
        values.forEach((value) => {
            buf += value;
        });
        wrapper.set(key, buf);
    });
    return null;
}
