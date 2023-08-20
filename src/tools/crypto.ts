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

import forge from "node-forge";

export namespace crypto {
    export function sha256(data: string, token: string): string {
        const key = forge.util.createBuffer(token, 'utf8');
        const hmac = forge.hmac.create();
        hmac.start('sha256', key);
        hmac.update(data);
        return hmac.digest().toHex();
    }

    export function aesEncrypt(content: string, key: string): string {
        if (key.startsWith('0x')) {
            key = key.substring(2)
        }
        const hexKey = forge.util.createBuffer(forge.util.hexToBytes(key))
        const contentBytes = forge.util.createBuffer(content)
        const iv = forge.random.getBytesSync(16)
        const cipher = forge.cipher.createCipher('AES-CBC', hexKey);
        cipher.start({iv: iv});
        cipher.update(forge.util.createBuffer(contentBytes));
        cipher.finish();
        const encrypted = cipher.output;
        return encrypted.toHex()

    }

    export function aesDecrypt(encryptedHexStr: string, key: string): string {
        if (key.startsWith('0x')) {
            key = key.substring(2);
        }
        const hexKey = forge.util.createBuffer(forge.util.hexToBytes(key))
        const encrypted = forge.util.createBuffer(forge.util.hexToBytes(encryptedHexStr))
        const iv = encrypted.getBytes(16)
        const decipher = forge.cipher.createDecipher('AES-CBC', hexKey);
        decipher.start({iv: iv});
        decipher.update(encrypted);
        const result = decipher.finish(); // check 'result' for true/false
        if(!result){
            console.log('decipher.finish() failed: result==false')
        }
        return decipher.output.data
    }
}
