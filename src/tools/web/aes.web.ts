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

import CryptoJS from "crypto-js/core";

export namespace aes {

    export function encrypt(content: string, key: string): string {
        if (key.startsWith('0x')) {
            key = key.substring(2)
        }
        const keyBuf = CryptoJS.enc.Hex.parse(key)
        const plaintext = CryptoJS.enc.Utf8.parse(content)
        const iv = CryptoJS.lib.WordArray.random(16);
        const encrypted = CryptoJS.AES.encrypt(plaintext, keyBuf, { iv: iv }).toString();
        console.log('Encrypted:', encrypted);
        return encrypted
    }

    export function decrypt(content: string, key: string): string {
        if (key.startsWith('0x')) {
            key = key.substring(2)
        }
        const keyBuf = CryptoJS.enc.Hex.parse(key)
        const ciphertext = CryptoJS.enc.Hex.parse(content)
        const iv = CryptoJS.lib.WordArray.create(ciphertext.words, 16);

        const decrypted = CryptoJS.AES.decrypt(content, keyBuf, { iv: iv }).toString(CryptoJS.enc.Utf8);
        console.log('Decrypted:', decrypted);
        return decrypted
    }
}

