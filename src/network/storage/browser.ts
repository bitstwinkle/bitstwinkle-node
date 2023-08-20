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

import {network} from "../network";

export class BrowserStorage implements network.IStorage {
    get<V>(key: string): V|null {
        const jsonStr = localStorage.getItem(key)
        if(!jsonStr){
            return null
        }
        return JSON.parse(jsonStr)
    }

    set<V>(key: string, val: V): void {
        localStorage.setItem(key, JSON.stringify(val))
    }

    clean(): void {
        localStorage.clear()
    }

    iter<V>(callback: (key: string, val: V) => void): void {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if(!key){
                continue
            }
            const val: V|null = this.get(key)
            if(!val){
                continue
            }
            callback(key, val)
        }
    }

    remove(key: string): void {
        localStorage.removeItem(key)
    }

}

