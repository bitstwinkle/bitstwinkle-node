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

import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {errors, UError} from "../../types/io/errors";
import {security} from "../security/security";
import {axiosGetParams, cli} from "./client";
import {sys} from "../../tools/sys/sys";
import {io} from "../../types/io/io";
import {aes} from "../../tools/aes/aes.node";
import {network} from "../network";

const NodeExchangeTokenURL = '/security/turn'

export namespace node {

    import Token = security.Token;
    type Options = {
        baseURL: string,
        secretPub: string,
        secretPri: string,
    }

    const gLocalStore = new cli.KVStore()

    export function initClientEnv(options: Options) {
        if (!options) {
            throw new Error('require option')
        }
        if (options.baseURL.length == 0) {
            options.baseURL = cli.DEFAULT_BITSTWINKLE_URL
        }
        if (options.secretPub.length == 0 || options.secretPri.length == 0) {
            throw new Error('require options.secretPub and options.secretPri')
        }
        gLocalStore.set('options', options)
        gLocalStore.set('token', new security.Token())
    }

    export class Client implements network.IClient {
        private options: Options
        private axiosInstance: AxiosInstance
        private token: security.Token

        public constructor() {
            this.options = gLocalStore.get('options')
            this.token = gLocalStore.get('token')
            this.axiosInstance = axios.create({
                baseURL: this.options.baseURL,
            });
            this.doInit()
        }

        async call<D, R>(api: string, data: D): Promise<io.Response<R>> {
            if(sys.isRd()){
                console.log('[ system run mode ] : ', sys.RUN_MODE)
            }
            const resp = await this.axiosInstance.post(api, data)
            return resp.data as unknown as io.Response<R>
        }

        exchangeToken() {
            this.doExchangeToken() //todo
        }

        doInit() {
            this.axiosInstance.interceptors.request.use(
                async (req: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
                    if (sys.isRd()) {
                        console.log('[ api: ', req.url, "] ", req.data)
                    }
                    if (req.url?.endsWith(NodeExchangeTokenURL)) {
                        const err = security.injectSecret(
                            this.options.secretPub,
                            this.options.secretPri,
                            (k: string, v: any) => {
                                req.headers[k] = v
                            },
                            (): Map<string, string> => {
                                return axiosGetParams(req)
                            },
                            (): string | null => {
                                return req.data
                            })
                        if (err) {
                            console.log("[ node.client.injectSecret ] node auth security.injectSecret failed", err)
                        }
                        return req
                    }
                    if (!this.token.isAvailable()) {
                        const err = await this.doExchangeToken()
                        if (err != null) {
                            console.log("[ client.node.doExchangeToken ] failed", err)
                            throw new Error(err.message)
                        }
                    }

                    if(sys.isRd()) {
                        console.log('[ client.node.token ]', this.token)
                    }
                    const err = security.injectToken(
                        this.token.tokenPub,
                        this.token.tokenPri,
                        (k: string, v: any) => {
                            req.headers[k] = v
                        },
                        (): Map<string, string> => {
                            return axiosGetParams(req)
                        },
                        (): string | null => {
                            return req.data
                        })
                    if (err) {
                        console.log("[ node.client.injectToken ] node auth security.injectToken failed", err)
                    }
                    return req
                },
                (error) => {
                    if (sys.isRd()) {
                        console.log('[ api.err: ', error.request.path, '] ', error)
                    }
                    return Promise.reject({
                        data: null,
                        err: {
                            type: errors.SYSTEM,
                            code: 'LOCAL_ERROR',
                            message: error.message,
                        }
                    });
                }
            );

            this.axiosInstance.interceptors.response.use(
                (resp: AxiosResponse) => {
                    security.analyzeResponse((k: string): any => {
                        return resp.headers[k]
                    })
                    if (sys.isRd()) {
                        console.log('[ api.resp: ', resp.request.path, '][', resp.status, "] ", resp.data)
                    }
                    const customResponse: AxiosResponse<io.Response<any>> = {
                        ...resp,
                        data: io.Success(resp.data)
                    }
                    return customResponse
                },
                (error) => {
                    if(!error.request || !error.response){
                        const customResponse: AxiosResponse<io.Response<any>> = {
                            ...error.response,
                            data: io.Error({
                                code: "LOCAL_ERROR", type: errors.SYSTEM,
                                message: error.message
                            })
                        }
                        return customResponse
                    }
                    if(sys.isRd()){
                        console.log('[ api.resp.err: ', error.request.path, '][', error.response.status, "] ", error.response.data)
                    }
                    const customResponse: AxiosResponse<io.Response<any>> = {
                        ...error.response,
                        data: io.Error(error.response.data)
                    }
                    return customResponse
                }
            )
        }

        async doExchangeToken(): Promise<UError> {
            const resp: io.Response<security.IToken> = await this.call('/security/turn', {})
            if (resp.err != null) {
                return resp.err
            }
            if (resp.data) {
                this.token.from(resp.data)
                this.token.tokenPri = aes.decrypt(this.token.tokenPri, this.options.secretPri)
                gLocalStore.set("token", this.token)
            }
            return null;
        }
    }
}

//
// const DEFAULT_BITSTWINKLE_URL = "http://localhost:8080"
//
// // var gBaseUrl string
// // var gSecretPub string
// // var gSecretKey string
// // var gToken security.Token
// // var gTokenMutex sync.Mutex
//
// abstract class Node {
//     protected axiosInstance: AxiosInstance
//     protected constructor(baseURL: string) {
//         this.axiosInstance = axios.create({
//             baseURL: baseURL,
//         });
//         this.init()
//     }
//     public axios(): AxiosInstance {
//         return this.axiosInstance
//     }
//
//     abstract init(): UError
//     abstract exchangeToken(): void
// }
//
// export type LightOptions = {
//     BaseURL: string,
// }
//
// export class LightClient extends Node{
//     private lightToken: LightToken
//     constructor(options: LightOptions) {
//         super(options.BaseURL)
//         this.lightToken = getEmptyToken()
//     }
//
//     init(): UError {
//         this.axiosInstance.interceptors.request.use(
//             (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//                 // request.headers['x'] = 'xx'
//                 // const queryParams = request.params;
//                 // const postFormData = request.data;
//                 // const bodyData = request.
//                 signature(request, this.lightToken.tokenPub, this.lightToken.token)
//                 // console.log(signStr, err);
//                 return request;
//             },
//             (error) => {
//                 // 处理请求错误
//                 return Promise.reject(error);
//             }
//         );
//
//         this.axiosInstance.interceptors.response.use(
//             (response: AxiosResponse) => {
//                 console.log("---> response:", response)
//                 return response;
//             },
//             (error) => {
//                 return error.response.data
//             }
//         );
//         return null
//     }
//
//     exchangeToken() {
//
//     }
// }
//
// export type NodeOptions = {
//     baseURL: string,
//     secretPub: string,
//     secretPri: string,
// }
//
// export class NodeClient extends Node{
//     private nodeToken: NodeToken
//     private options: NodeOptions
//     constructor(options: NodeOptions) {
//         super(options.baseURL)
//         this.options = options
//         this.nodeToken = getEmptyNodeToken()
//         this.init()
//     }
//
//     init(): UError {
//         this.axiosInstance.interceptors.request.use(
//             (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//                 // request.headers['x'] = 'xx'
//                 // const queryParams = request.params;
//                 // const postFormData = request.data;
//                 // const bodyData = request.
//                 if (request.url?.endsWith('/security/turn')) {
//                     injectNodeHeader(request, this.options.secretPub, this.options.secretPri)
//                     return request
//                 }
//                 if(this.nodeToken.token.length==0){
//                     const err = this.exchangeToken()
//                 }
//                 signature(request, this.nodeToken.tokenPub, this.nodeToken.token)
//                 // console.log(signStr, err);
//                 return request;
//             },
//             (error) => {
//                 return error.response.data
//             }
//         );
//
//         this.axiosInstance.interceptors.response.use(
//             (response: AxiosResponse) => {
//                 response.data = {
//                     data: response.data,
//                     err: null,
//                 }
//                 return response
//             },
//             (error) => {
//                 return { data: null, err: error.response.data };
//             }
//         );
//         return null
//     }
//
//     exchangeToken() {
//        this.doExchangeToken() //todo
//     }
//
//     async doExchangeToken(): Promise<UError> {
//         const resp: { data: NodeToken, err: UError } = await this.axiosInstance.post('/security/turn')
//         if (resp.err != null) {
//             return resp.err
//         }
//         this.nodeToken.tokenPub = resp.data.tokenPub
//         this.nodeToken.tokenExpire = resp.data.tokenExpire
//         this.nodeToken.token = resp.data.token
//         return null;
//     }
// }
//
// export type LOptions = {
//     BaseURL: string,
//     SecretPub: string,
//     SecretKey: string,
// }
//
// export type NOptions = {
//     BaseURL: string,
// }
//
// class Node {
//     private axiosInstance: AxiosInstance
//     private options: LOptions | NOptions
//     private token: Token
//
//     constructor(public mode: Mode, options: LOptions | NOptions) {
//         this.options = options
//         this.axiosInstance = axios.create({
//             baseURL: this.options.BaseURL,
//         });
//         this.token = getEmptyToken()
//         this.init()
//     }
//
//     private init() {
//         this.axiosInstance.interceptors.request.use(
//             (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//                 config.headers['x'] = 'xx'
//                 return config;
//             },
//             (error) => {
//                 // 处理请求错误
//                 return Promise.reject(error);
//             }
//         );
//
//         this.axiosInstance.interceptors.response.use(
//             (response: AxiosResponse) => {
//                 // 在接收到响应数据之前做一些处理
//                 return response;
//             },
//             (error) => {
//                 // 处理响应错误
//                 return Promise.reject(error);
//             }
//         );
//     }
// }

//
// // 发送请求
// instance.get('/data')
//     .then((response: AxiosResponse<string,string>) => {
//         console.log(response.data);
//     })
//     .catch((error) => {
//         console.error(error);
//     });