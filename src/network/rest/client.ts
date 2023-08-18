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

import {io} from "../../types/io/io";
import {InternalAxiosRequestConfig} from "axios";


export namespace cli {
    export const DEFAULT_BITSTWINKLE_URL = "http://localhost:8080"

    export interface IStore {
        get<V>(key: string): V
        set<V>(key: string, val: V): void
    }

    export interface Client {
        call<D, R>(api: string, data: D): Promise<io.Response<R>>
    }

    export class KVStore implements IStore{
        private db = new Map<string, any>

        get<V>(key: string): V {
            return this.db.get(key);
        }

        set<V>(key: string, val: V): void {
            this.db.set(key, val)
        }

    }
}

export function axiosGetParams(req: InternalAxiosRequestConfig): Map<string, string> {
    const wrapper = new Map<string, string>()

    if (req.params) {
        Object.keys(req.params).forEach((key: string) => {
            wrapper.set(key, req.params[key])
        });
    }

    if(req.url){
        const idx = req.url.search('\\?')
        if(idx>-1) {
            const urlQuery = req.url.substring(idx)
            const urlSearchParams = new URLSearchParams(urlQuery);
            urlSearchParams.forEach((value: string, key: string) => {
                wrapper.set(key, value)
            });
        }
    }

    return wrapper
}
