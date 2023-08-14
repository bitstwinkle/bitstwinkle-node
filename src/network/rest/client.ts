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
import {UError} from "../../types/errors/errors";
import {getEmptyToken, LightToken} from "../security/security";
import {signature} from "../security/http";


const DEFAULT_BITSTWINKLE_URL = "http://localhost:8080"

// var gBaseUrl string
// var gSecretPub string
// var gSecretKey string
// var gToken security.Token
// var gTokenMutex sync.Mutex

export type Options = {
    BaseURL: string,
}

abstract class Client {
    protected options: Options
    protected axiosInstance: AxiosInstance
    protected constructor(options: Options) {
        this.options = options
        this.axiosInstance = axios.create({
            baseURL: this.options.BaseURL,
        });
        this.init()
    }
    public axios(): AxiosInstance {
        return this.axiosInstance
    }

    abstract init(): UError
    abstract exchangeToken(): UError
}

export class LightClient extends Client{
    private lightToken: LightToken
    constructor(options: Options) {
        super(options)
        this.lightToken = getEmptyToken()
    }

    init(): UError {
        this.axiosInstance.interceptors.request.use(
            (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
                // request.headers['x'] = 'xx'
                // const queryParams = request.params;
                // const postFormData = request.data;
                // const bodyData = request.
                signature(request, this.lightToken.tokenPub, this.lightToken.token)
                return request;
            },
            (error) => {
                // 处理请求错误
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // 在接收到响应数据之前做一些处理
                return response;
            },
            (error) => {
                // 处理响应错误
                return Promise.reject(error);
            }
        );
        return null
    }

    exchangeToken(): UError {
        return null;
    }
}

class NodeClient extends Client{
    constructor(options: Options) {
        super(options)
        this.init()
    }

    exchangeToken(): UError {
        return null;
    }

    init(): UError {
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
                config.headers['x'] = 'xx'

                return config;
            },
            (error) => {
                // 处理请求错误
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // 在接收到响应数据之前做一些处理
                return response;
            },
            (error) => {
                // 处理响应错误
                return Promise.reject(error);
            }
        );
        return null
    }
}
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
// class Client {
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