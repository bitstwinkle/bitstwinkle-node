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


import {randID} from "@/tools/unique/unique";
import {UError} from "@/types/errors/errors";
import {sign} from "@/network/security/signature";

const Security            = "security"
const Turn                = "turn"
const HeaderPrefix        = "Twinkle-" //Uniform prefix
const HeaderSecretPub   = HeaderPrefix + "Secret-Pub" //Secret Pub
const HeaderTokenPub    = HeaderPrefix + "Token-Pub"  //Token Public
const HeaderNonce       = HeaderPrefix + "Nonce"      //Nonce
const HeaderTimestamp   = HeaderPrefix + "Timestamp"  //Timestamp
const HeaderSignature   = HeaderPrefix + "Signature"  //Signature
const HeaderTokenExpire = HeaderPrefix + "Expiration" //Token Expiration

const signWithHeaderKey: string[] = [HeaderNonce, HeaderTimestamp, HeaderTokenPub]

export interface HttpRequest {
    setHeader(key: string, value: string): void
    getHeader(key: string): string
    getQueryMap(): Map<string, string[]>
    getPostForm(): Map<string, string[]>
    getBody(): string
}

export function signature(req: HttpRequest, tokenPub: string, tokenPri: string): UError {
    const nonce = randID()
    const timestamp = new Date().getTime()
    req.setHeader(HeaderTokenPub, tokenPub)
    req.setHeader(HeaderNonce, nonce)
    req.setHeader(HeaderTimestamp, timestamp.toString())
    return null
}

export function genSignature(req: HttpRequest, priKey: string): {signStr: string; err: UError} {
    const wrapper = new Map()
    if(req.getQueryMap().size > 0){
        doDataToMap(req.getQueryMap(), wrapper)
    }
    if(req.getPostForm().size > 0){
        doDataToMap(req.getPostForm(), wrapper)
    }

    const sortedKeys = Object.keys(wrapper).sort()
    let buf = ""
    for (const key of sortedKeys) {
        buf += wrapper.get(key)
    }

    const bodyStr = req.getBody()
    if(bodyStr.length>0){
        buf += bodyStr
    }

    for (const key of signWithHeaderKey) {
        buf += req.getHeader(key)
    }

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
