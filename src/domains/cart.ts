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

import {times} from "../types/times";
import {ref} from "../types/ref";
import {errors} from "../types/errors";
import {network} from "../network/network";

export namespace cart {
    export type ID = string
    export type Item = {
        commodity_id: string
        quantity: number
        seq: number
        selected: boolean
        available: boolean
        last_at: times.String
    }
    export type Cart = {
        scope: ref.Scope
        lead: ref.Lead
        id: ID
        commodities: Item[]
        birth_at: times.String
    } | null
    export type PutRequest = {
        scope: ref.Scope
        lead: ref.Lead
        id: ID
        commodity_id: string
        quantity: number
    }
    export type DeductRequest = PutRequest
    export type SelectedSwitchRequest = {
        scope: ref.Scope
        lead: ref.Lead
        id: ID
        commodity_id_array: string[]
        selected: boolean
    }
    export type GetRequest = {
        scope: ref.Scope
        lead: ref.Lead | null
        id: ID | null
    }
    export type CleanRequest = GetRequest

    export async function put(req: PutRequest): Promise<[cart: Cart | null, err: errors.Error]> {
        const resp: network.Response<Cart> = await network.cli().call('/cart/put', req)
        return [resp.data, resp.err]
    }

    export async function deduct(req: DeductRequest): Promise<[cart: Cart | null, err: errors.Error]> {
        const resp: network.Response<Cart> = await network.cli().call('/cart/deduct', req)
        return [resp.data, resp.err]
    }

    export async function selectedSwitch(req: SelectedSwitchRequest): Promise<[cart: Cart | null, err: errors.Error]> {
        const resp: network.Response<Cart> = await network.cli().call('/cart/select', req)
        return [resp.data, resp.err]
    }

    export async function get(req: GetRequest): Promise<[cart: Cart, err: errors.Error]> {
        const resp: network.Response<Cart> = await network.cli().call('/cart/g', req)
        return [resp.data, resp.err]
    }

    export async function clean(req: CleanRequest): Promise<errors.Error> {
        const resp: network.Response<Cart> = await network.cli().call('/cart/clean', req)
        return resp.err
    }
}
