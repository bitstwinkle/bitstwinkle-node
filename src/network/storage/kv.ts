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

export class KVStorage implements network.IStorage{
    private db = new Map<string, any>

    get<V>(key: string): V {
        return this.db.get(key);
    }

    set<V>(key: string, val: V): void {
        this.db.set(key, val)
    }

    clean(): void {
        this.db.clear()
    }

    iter<V>(callback: (key: string, val: V) => void): void {
        for (const key of this.db.keys()) {
            const val = this.db.get(key)
            callback(key, val)
        }
    }

    remove(key: string): void {
        this.db.delete(key)
    }

}
