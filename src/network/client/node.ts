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
import axios, {AxiosInstance} from "axios";
import {sys} from "../../tools/sys";
import {axiosOnAfterResp, axiosOnBeforeReq, axiosOnReqError, axiosOnRespError} from "./axios";

export class NodeClient implements network.IClient {
    private axiosInstance: AxiosInstance

    public constructor() {
        this.axiosInstance = axios.create({
            baseURL: network.options().access,
        });
        this.doInit()
    }

    async call<D, R>(api: string, data: D): Promise<network.Response<R>> {
        if (sys.isRd()) {
            console.log('[ system run mode ] : ', sys.RUN_MODE)
        }
        const resp = await this.axiosInstance.post(api, data)
        return resp.data as unknown as network.Response<R>
    }

    doInit() {
        this.axiosInstance.interceptors.request.use(axiosOnBeforeReq, axiosOnReqError,);
        this.axiosInstance.interceptors.response.use(axiosOnAfterResp, axiosOnRespError,)
    }

}
