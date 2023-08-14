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


import {InternalAxiosRequestConfig} from "axios/index";
import {randID} from "../../tools/unique/unique";
import {sign} from "./signature";
import {UError} from "../../types/errors/errors";

const Security            = "security"
const Turn                = "turn"
const HEADER_PREFIX        = "Twinkle-" //Uniform prefix
const HeaderSecretPub   = HEADER_PREFIX + "Secret-Pub" //Secret Pub
const HEADER_TOKEN_PUB    = HEADER_PREFIX + "Token-Pub"  //Token Public
const HEADER_NONCE       = HEADER_PREFIX + "Nonce"      //Nonce
const HEADER_TIMESTAMP   = HEADER_PREFIX + "Timestamp"  //Timestamp
const HEADER_SIGNATURE   = HEADER_PREFIX + "Signature"  //Signature
const Header_Token_Expire = HEADER_PREFIX + "Expiration" //Token Expiration

const signWithHeaderKey: string[] = [HEADER_NONCE, HEADER_TIMESTAMP, HEADER_TOKEN_PUB]

export interface HttpRequest {
    setHeader(key: string, value: string): void
    getHeader(key: string): string
    getQueryMap(): Map<string, string[]>
    getPostForm(): Map<string, string[]>
    getBody(): string
}

export function signature(req: InternalAxiosRequestConfig, tokenPub: string, tokenPri: string): UError {
    const nonce = randID()
    const timestamp = new Date().getTime()
    req.headers[HEADER_NONCE] = nonce
    req.headers[HEADER_TIMESTAMP] = timestamp.toString()
    req.headers[HEADER_TOKEN_PUB] = tokenPub
    genSignature(req, "-----")

    return null
}

export function genSignature(req: InternalAxiosRequestConfig, priKey: string): {signStr: string; err: UError} {
    const wrapper = new Map()

    const params =req.params;

    if (params) {
        Object.keys(params).forEach((key: string) => {
            const value = params[key];
            console.error("----------->",`${key}: ${value}`);
        });
    }

    // req.params
    // const urlSearchParams = new URLSearchParams(req.url.search);
    // console.error("----------->","urlSearchParams", urlSearchParams)
    // urlSearchParams
    // if(req.params.size > 0){
    //     doDataToMap(req.getQueryMap(), wrapper)
    // }
    // if(req.getPostForm().size > 0){
    //     doDataToMap(req.getPostForm(), wrapper)
    // }
    // req.bo
    //
    // const sortedKeys = Object.keys(wrapper).sort()
    // let buf = ""
    // for (const key of sortedKeys) {
    //     buf += wrapper.get(key)
    // }
    //
    // const bodyStr = req.getBody()
    // if(bodyStr.length>0){
    //     buf += bodyStr
    // }
    //
    // for (const key of signWithHeaderKey) {
    //     buf += req.getHeader(key)
    // }

    const buf = ""
    const { signStr, err} = sign(buf, priKey)
    return { signStr, err }
}

function doDataToMap(inputData: Map<string, string[]>, wrapper: Map<string, string>): UError {
    if(inputData.size === 0){
        return null
    }

    inputData.forEach((values: string[], key: string) => {
        switch (values.length){
            case 0:
                return
            case 1:
                wrapper.set(key, values[0])
                return
        }
        let buf = ""
        values.forEach((value: string) => {
            buf += value
        })
        wrapper.set(key, buf)
    })

    return null
}
