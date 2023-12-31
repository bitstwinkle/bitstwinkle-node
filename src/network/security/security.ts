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

import {errors} from "../../types/errors";
import {unique} from "../../tools/unique";
import {sys} from "../../tools/sys";
import {Expose} from "class-transformer";
import {crypto} from "../../tools/crypto";

const bodyInside = '__b_o_d_y__'

function doSign(
    signHeader: string[],
    headers: Map<string, string>,
    params: Map<string, string>,
    body: string | null,
    token: string,
): { signStr: string; err: errors.Error } {
    let buf = ''

    if (signHeader && headers) {
        for (const key of signHeader) {
            buf += key + '='
            buf += headers.get(key)
            buf += ';'
        }
    }

    if (params) {
        const sortedKeys = Object.keys(params).sort()
        if (sys.isRd() && sortedKeys.length>0) {
            console.log("[ security.doSign ] sortedKeys: ", sortedKeys)
        }
        for (const key of sortedKeys) {
            buf += key + '='
            buf += params.get(key)
            buf += ';'
        }
    }

    if (body) {
        const bodyStr = JSON.stringify(body)
        const bodyPureStr = bodyStr.replaceAll(/"/g, '\"')
        buf += bodyInside + '=' + bodyPureStr
    }

    if (sys.isRd()) {
        console.log("[ security.doSign ] buf to sign:", buf, " use token: " + token)
    }

    const signature = crypto.sha256(buf, token);
    return {signStr: signature, err: null};
}

const Security = "security"
const Turn = "turn"
const HEADER_PREFIX = "Twinkle-" //Uniform prefix
const HEADER_RUN_MODE = HEADER_PREFIX + "Run-Mode" //Uniform prefix
const HEADER_SECRET_PUB = HEADER_PREFIX + "Secret-Pub" //Secret Pub
const HEADER_TOKEN_PUB = HEADER_PREFIX + "Token-Pub"  //Token Public
const HEADER_NONCE = HEADER_PREFIX + "Nonce"      //Nonce
const HEADER_TIMESTAMP = HEADER_PREFIX + "Timestamp"  //Timestamp
const HEADER_SIGNATURE = HEADER_PREFIX + "Signature"  //Signature
const HEADER_TOKEN_EXPIRE = HEADER_PREFIX + "Expiration" //Token Expiration


export namespace security {

    export type IToken = {
        token_pub: string
        token_expire: string
        token_pri: string
        token: string
    }
    export class Token {
        public refreshTokenPub: string
        public refreshTokenExpire: Date
        public refreshTokenPri: string

        @Expose({name: 'token_pub'})
        public tokenPub: string
        public tokenExpire: Date
        public tokenPri: string

        constructor() {
            this.refreshTokenPub = ''
            this.refreshTokenPub = ''
            this.refreshTokenExpire = new Date(0)
            this.refreshTokenPri = ''
            this.tokenPub = ''
            this.tokenExpire = new Date(0)
            this.tokenPri = ''
        }

        from(src: IToken) {
            // this.refreshTokenPub = src.refreshTokenPub
            // this.refreshTokenExpire = src.refreshTokenExpire
            // this.refreshTokenPri = src.refreshTokenPri
            this.tokenPub = src.token_pub
            this.tokenExpire = new Date(parseInt(src.token_expire))
            this.tokenPri = src.token_pri
        }

        isAvailable(): boolean {
            if (this.tokenPri.length === 0 || this.tokenPub.length === 0) {
                if (sys.isRd()) {
                    console.log('[ security.isAvailable ] token empty, or tokenPub empty')
                }
                return false
            }
            if (this.tokenExpire < new Date()) {
                if (sys.isRd()) {
                    console.log('[ security.isAvailable ] token expire')
                }
                return false
            }
            return true
        }

        isRefreshAvailable(): boolean {
            if (this.refreshTokenPri.length === 0 || this.refreshTokenPub.length === 0) {
                if (sys.isRd()) {
                    console.log('[ security.isAvailable ] refresh token empty, or refresh token pub empty')
                }
                return false
            }
            if (this.refreshTokenExpire < new Date()) {
                if (sys.isRd()) {
                    console.log('[ security.isAvailable ] refresh token expire')
                }
                return false
            }
            return true
        }
    }

    export function injectSecret(
        secretPub: string,
        secretPri: string,
        setHeader: (k: any, v: any) => void,
        getParams: () => Map<string, string>,
        getBody: () => string|null,
    ): errors.Error {
        const nonce = unique.randID()
        const timestamp = new Date().getTime()

        setHeader(HEADER_NONCE, nonce)
        setHeader(HEADER_TIMESTAMP, timestamp)
        setHeader(HEADER_SECRET_PUB, secretPub)

        const {signStr, err} = doSign(
            [HEADER_NONCE, HEADER_TIMESTAMP],
            new Map().
                set(HEADER_NONCE, nonce).
                set(HEADER_TIMESTAMP, timestamp).
                set(HEADER_SECRET_PUB, secretPub),
            getParams(),
            getBody(),
            secretPri,
        )
        if (err) {
            console.log("[ security.injectSecret ] err", err)
            return err
        }
        if (err) {
            return err
        }
        setHeader(HEADER_SIGNATURE, signStr)
        if (sys.isRd()) {
            console.log('[ security.injectSecret ] signStr=', signStr)
        }
        return null
    }

    export function injectToken(
        tokenPub: string,
        tokenPri: string,
        setHeader: (k: any, v: any) => void,
        getParams: () => Map<string, string>,
        getBody: () => string|null,
    ): errors.Error {
        const nonce = unique.randID()
        const timestamp = new Date().getTime()

        setHeader(HEADER_NONCE, nonce)
        setHeader(HEADER_TIMESTAMP, timestamp)
        setHeader(HEADER_TOKEN_PUB, tokenPub)

        const {signStr, err} = doSign(
            [HEADER_NONCE, HEADER_TIMESTAMP],
            new Map().
                set(HEADER_NONCE, nonce).
                set(HEADER_TIMESTAMP, timestamp).
                set(HEADER_TOKEN_PUB, tokenPub),
            getParams(),
            getBody(),
            tokenPri,
            )
        if (err) {
            console.log("[ security.injectToken ] err", err)
            return err
        }
        setHeader(HEADER_SIGNATURE, signStr)
        if (sys.isRd()) {
            console.log('[ security.injectToken ] signStr=', signStr)
        }
        return null
    }

    export function analyzeResponse(get: (k: string) => any): void {
        const strRunMode: string = get(HEADER_RUN_MODE)
        sys.SetRunMode(sys.modeOf(strRunMode))
    }
}

export type LightToken = {
    refreshTokenPub: string
    refreshTokenExpire: Date
    refreshToken: string
    tokenPub: string
    tokenExpire: Date
    token: string
}

export type NodeToken = {
    tokenPub: string
    tokenExpire: Date
    token: string
}

export function getEmptyToken(): LightToken {
    return {
        refreshTokenPub: '',
        refreshTokenExpire: new Date(0),
        refreshToken: '',
        tokenPub: '',
        tokenExpire: new Date(0),
        token: '',
    }
}

export function getEmptyNodeToken(): NodeToken {
    return {
        tokenPub: '',
        tokenExpire: new Date(0),
        token: '',
    }
}

