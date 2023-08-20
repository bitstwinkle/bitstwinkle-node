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

import {errors} from "../types/errors";
import {ref} from "../types/ref";
import {security} from "./security/security";
import {sys} from "../tools/sys";

export namespace network {

    export type Options = {
        access: string
        scope: ref.Scope
        secret: {
            pub: string
            pri: string
        } | null
        onLogin: (() => void) | null
    }

    export interface IStorage {
        get<V>(key: string): V|null
        set<V>(key: string, val: V): void
        remove(key: string): void
        clean(): void
        iter<V>(callback: (key: string, val: V) => void): void
    }

    export interface IClient {
        call<D, R>(api: string, data: D): Promise<Response<R>>
    }

    let gOptions: Options
    let gStorage: IStorage
    let gClient: IClient
    let gToken: security.Token = new security.Token()

    export function init(options: Options) {
        gOptions = options
        //todo add verify use throw new Error
        return null
    }

    export function use(storage: IStorage, cli: IClient) {
        gStorage = storage
        gClient = cli
        network.storage().set('token', new security.Token())
        if (sys.isRd()) {
            network.storage().iter((key: string, val: any) => {
                console.log("[ network.storage ] ", key, val)
            })
        }
    }

    export function options(): Options {
        return gOptions
    }

    export function scope(): ref.Scope {
        if(!gOptions || !gOptions.scope){
            console.error('[ network.scope ] : must init first.')
        }
        return gOptions.scope
    }

    export function storage(): IStorage {
        if(!gStorage){
            console.error('[ network.storage ] : must init first.')
        }
        return gStorage
    }

    export function cli(): IClient {
        if(!gClient){
            console.error('[ network.cli ] : must init first.')
        }
        return gClient
    }

    export function token(): security.Token {
        const iToken: security.IToken | null = storage().get("token")
        if(iToken===null){
            return gToken
        }
        return gToken
    }

    export function upToken(iToken: security.IToken) {
        gToken.from(iToken)
        storage().set("token", gToken)
    }

    export function Success<T>(data: T): Response<T> {
        return new Response<T>(data, null)
    }

    export function Error<T>(err: errors.Error): Response<T> {
        return new Response<T>(null, err)
    }

    export class Response<T> {
        data: T | null
        err: errors.Error

        public constructor(data: T | null, err: errors.Error) {
            this.data = data
            if (err) {
                this.err = err
            } else {
                this.err = null
            }
        }

        isSuccess(): boolean {
            return this.err != null
        }

        getData(): T | null {
            return this.data
        }
    }
}

