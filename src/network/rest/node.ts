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
//
// import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
// import {errors, UError} from "../../types/io/errors";
// import {security} from "../security/security";
// import {axiosGetParams, cli} from "./client";
// import {sys} from "../../tools/sys";
// import {io} from "../../types/io/io";
// import {crypto} from "../../tools/crypto";
// import {network} from "../network";
//
// const NodeExchangeTokenURL = '/security/turn'
//
// export namespace node {
//
//     type Options = {
//         baseURL: string,
//         secretPub: string,
//         secretPri: string,
//     }
//
//     const gLocalStore = new cli.KVStore()
//
//     export function initClientEnv(options: Options) {
//         if (!options) {
//             throw new Error('require option')
//         }
//         if (options.baseURL.length == 0) {
//             options.baseURL = cli.DEFAULT_BITSTWINKLE_URL
//         }
//         if (options.secretPub.length == 0 || options.secretPri.length == 0) {
//             throw new Error('require options.secretPub and options.secretPri')
//         }
//         gLocalStore.set('options', options)
//         gLocalStore.set('token', new security.Token())
//         if(sys.isRd()){
//             gLocalStore.dump()
//         }
//     }
//
//     export class Client implements network.IClient {
//         private options: Options
//         private axiosInstance: AxiosInstance
//         private readonly token: security.Token
//
//         public constructor() {
//             this.options = gLocalStore.get('options')
//             this.token = gLocalStore.get('token')
//             this.axiosInstance = axios.create({
//                 baseURL: this.options.baseURL,
//             });
//             this.doInit()
//         }
//
//         async call<D, R>(api: string, data: D): Promise<io.Response<R>> {
//             if(sys.isRd()){
//                 console.log('[ system run mode ] : ', sys.RUN_MODE)
//             }
//             const resp = await this.axiosInstance.post(api, data)
//             return resp.data as unknown as io.Response<R>
//         }
//
//         doInit() {
//             this.axiosInstance.interceptors.request.use(
//                 async (req: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
//                     if (sys.isRd()) {
//                         console.log('[ api: ', req.url, "] ", req.data)
//                     }
//                     if (req.url?.endsWith(NodeExchangeTokenURL)) {
//                         const err = security.injectSecret(
//                             this.options.secretPub,
//                             this.options.secretPri,
//                             (k: string, v: any) => {
//                                 req.headers[k] = v
//                             },
//                             (): Map<string, string> => {
//                                 return axiosGetParams(req)
//                             },
//                             (): string | null => {
//                                 return req.data
//                             })
//                         if (err) {
//                             console.log("[ node.client.injectSecret ] node auth security.injectSecret failed", err)
//                         }
//                         return req
//                     }
//                     if (!this.token.isAvailable()) {
//                         const err = await this.doExchangeToken()
//                         if (err != null) {
//                             console.log("[ client.node.doExchangeToken ] failed", err)
//                             throw new Error(err.message)
//                         }
//                     }
//
//                     if(sys.isRd()) {
//                         console.log('[ client.node.token ]', this.token)
//                     }
//                     const err = security.injectToken(
//                         this.token.tokenPub,
//                         this.token.tokenPri,
//                         (k: string, v: any) => {
//                             req.headers[k] = v
//                         },
//                         (): Map<string, string> => {
//                             return axiosGetParams(req)
//                         },
//                         (): string | null => {
//                             return req.data
//                         })
//                     if (err) {
//                         console.log("[ node.client.injectToken ] node auth security.injectToken failed", err)
//                     }
//                     return req
//                 },
//                 (error) => {
//                     if (sys.isRd()) {
//                         console.log('[ api.err: ', error.request.path, '] ', error)
//                     }
//                     return Promise.reject({
//                         data: null,
//                         err: {
//                             type: errors.SYSTEM,
//                             code: 'LOCAL_ERROR',
//                             message: error.message,
//                         }
//                     });
//                 }
//             );
//
//             this.axiosInstance.interceptors.response.use(
//                 (resp: AxiosResponse) => {
//                     security.analyzeResponse((k: string): any => {
//                         return resp.headers[k]
//                     })
//                     if (sys.isRd()) {
//                         console.log('[ api.resp: ', resp.request.path, '][', resp.status, "] ", resp.data)
//                     }
//                     const customResponse: AxiosResponse<io.Response<any>> = {
//                         ...resp,
//                         data: io.Success(resp.data)
//                     }
//                     return customResponse
//                 },
//                 (error) => {
//                     if(!error.request || !error.response){
//                         const customResponse: AxiosResponse<io.Response<any>> = {
//                             ...error.response,
//                             data: io.Error({
//                                 code: "LOCAL_ERROR", type: errors.SYSTEM,
//                                 message: error.message
//                             })
//                         }
//                         return customResponse
//                     }
//                     if(sys.isRd()){
//                         console.log('[ api.resp.err: ', error.request.path, '][', error.response.status, "] ", error.response.data)
//                     }
//                     const customResponse: AxiosResponse<io.Response<any>> = {
//                         ...error.response,
//                         data: io.Error(error.response.data)
//                     }
//                     return customResponse
//                 }
//             )
//         }
//
//         async doExchangeToken(): Promise<UError> {
//             const resp: io.Response<security.IToken> = await this.call('/security/turn', {})
//             if (resp.err != null) {
//                 return resp.err
//             }
//             if (resp.data) {
//                 this.token.from(resp.data)
//                 this.token.tokenPri = crypto.aesDecrypt(this.token.tokenPri, this.options.secretPri)
//                 gLocalStore.set("token", this.token)
//             }
//             return null;
//         }
//     }
// }
