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

import * as crypto from 'crypto';

export namespace aes {

    export function encrypt(content: string, key: string): string {
        if(key.startsWith('0x')){
            key = key.substring(2)
        }
        const keyBuf = Buffer.from(key, 'hex')

        const plaintext = Buffer.from(content, 'utf8');
        console.log('plaintext', plaintext, "content", content)

        const iv = crypto.randomBytes(16);
        if (!iv) {
            console.log('crypto.randomBytes(16) error: !iv')
            return '';
        }


        console.log('entry iv: ', iv)

        let block: crypto.Cipher;
        try {
            block = crypto.createCipheriv('aes-256-cbc', keyBuf, iv);
        } catch (err) {
            console.log('crypto.createCipheriv error', err)
           return ''
        }

        // const padding = 16 - plaintext.length % 16;
        // console.log('entry padding:', padding)
        // const paddedPlaintext = Buffer.concat([plaintext, Buffer.alloc(padding, padding)]);
const paddedPlaintext = plaintext
        console.log("paddedPlaintext", paddedPlaintext)

        const ciphertext: Buffer = Buffer.concat([iv, block.update(paddedPlaintext), block.final()]);


        console.log('entry result: ', ciphertext.toString('hex'))

        return ciphertext.toString('hex');
    }

    export function decrypt(content: string, key: string): string {
        try{
            if(key.startsWith('0x')){
                key = key.substring(2)
            }
            const keyBuf: Buffer = Buffer.from(key, 'hex')
            console.log("keyBuf", keyBuf)
            const ciphertext: Buffer = Buffer.from(content, 'hex')
            console.log("ciphertext", ciphertext)
            const iv: Buffer = ciphertext.subarray(0, 16)
            console.log("iv", iv)
            const block: crypto.Decipher = crypto.createDecipheriv('aes-256-cbc', keyBuf, iv)
            let decrypted: Buffer = block.update(ciphertext.subarray(16));
            console.log('decrypted', decrypted)
            decrypted = Buffer.concat([decrypted, block.final()]);

            // 去除填充字节
            // const padding = decrypted[decrypted.length - 1];
            // decrypted = decrypted.subarray(0, decrypted.length - padding);

            return decrypted.toString()
        }catch (error){
            console.log('aes.decrypt failed', error)
            return ''
        }
    }
}
