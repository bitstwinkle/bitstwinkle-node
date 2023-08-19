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

import {io} from "../types/io/io";
import {UError} from "../types/io/errors";
import {errors} from "../types/errors";
import {ref} from "../types/ref";

export namespace network {
    export interface IClient {
        call<D, R>(api: string, data: D): Promise<Response<R>>
    }

    let gScope: ref.Scope
    let gClient: IClient

    export function init(scope: ref.Scope, cli: IClient) {
        gScope = scope
        gClient = cli
    }

    export function scope(): ref.Scope {
        if(!gScope){
            console.error('[ network.scope ] : must init first.')
        }
        return gScope
    }

    export function cli(): IClient {
        if(!gClient){
            console.error('[ network.cli ] : must init first.')
        }
        return gClient
    }

    export function Success<T>(data: T): Response<T> {
        return new Response<T>(data, null)
    }

    export function Error<T>(err: UError): Response<T> {
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

