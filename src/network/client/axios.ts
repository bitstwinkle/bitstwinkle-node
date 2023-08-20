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

import axios, {AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {sys} from "../../tools/sys";
import {crypto} from "../../tools/crypto";
import {security} from "../security/security";
import {errors} from "../../types/errors";
import {network} from "../network";

export async function axiosOnBeforeReq(req: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    if (sys.isRd()) {
        console.log('[ api: ', req.url, "] ", req.data)
    }
    let token: security.Token = network.token()
    if (!token.isAvailable()) {
        if (token.isRefreshAvailable()) {
            const err = await doTurnByRefreshToken()
            if (err !== null) {
                return Promise.reject({
                    data: null,
                    err: {
                        type: errors.SYSTEM,
                        code: 'req_err',
                        message: err.message,
                    }
                });
            }
            token = network.storage().get('token') as security.Token
        } else {
            if (network.options().secret != null) {
                const err = await doTurnBySecret()
                if (err !== null) {
                    return Promise.reject({
                        data: null,
                        err: {
                            type: errors.SYSTEM,
                            code: 'req_err',
                            message: err.message,
                        }
                    });
                }
                token = network.storage().get('token') as security.Token
            }else{
                const onLoginFunc = network.options().onLogin
                if(onLoginFunc){
                    onLoginFunc()
                    return Promise.reject({
                        data: null,
                        err: {
                            type: errors.APPLICATION,
                            code: 'req_err',
                            message: 'redirect to login...',
                        }
                    });
                }
            }
        }
    }

    const err = security.injectToken(
        token.tokenPub,
        token.tokenPri,
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
        console.log("[ axios.injectToken ] axios auth security.injectToken failed", err)
    }
    return req
}


export function axiosOnReqError(error: any) {
    if (sys.isRd()) {
        console.log('[ api.err: ', error.request.path, '] ', error)
    }
    return Promise.reject({
        data: null,
        err: {
            type: errors.SYSTEM,
            code: 'req_err',
            message: error.message,
        }
    });
}

export function axiosOnAfterResp(resp: AxiosResponse) {
    security.analyzeResponse((k: string): any => {
        return resp.headers[k]
    })
    if (sys.isRd()) {
        console.log('[ api.resp: ', resp.request.path, '][', resp.status, "] ", resp.data)
    }
    const customResponse: AxiosResponse<network.Response<any>> = {
        ...resp,
        data: network.Success(resp.data)
    }
    return customResponse
}

export function axiosOnRespError(error: any) {
    if (!error.request || !error.response) {
        const customResponse: AxiosResponse<network.Response<any>> = {
            ...error.response,
            data: network.Error({
                code: "resp_err", type: errors.SYSTEM,
                message: error.message
            })
        }
        return customResponse
    }
    if (sys.isRd()) {
        console.log('[ api.resp.err: ', error.request.path, '][', error.response.status, "] ", error.response.data)
    }
    const customResponse: AxiosResponse<network.Response<any>> = {
        ...error.response,
        data: network.Error(error.response.data)
    }
    return customResponse
}

async function axiosOnBeforeSecretReq(req: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    if (sys.isRd()) {
        console.log('[ api: ', req.url, "] ", req.data)
    }

    const err = security.injectSecret(
        network.options().secret?.pub as string,
        network.options().secret?.pri as string,
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
        console.log("[ axios.axiosOnBeforeSecretReq ] axios auth security.injectSecret failed", err)
        return Promise.reject({
            data: null,
            err: {
                type: errors.SYSTEM,
                code: 'req_err',
                message: err.message,
            }
        });
    }
    return req
}


export async function doTurnBySecret(): Promise<errors.Error> {
    const secretAxios = axios.create({
        baseURL: network.options().access,
    })
    secretAxios.interceptors.request.use(axiosOnBeforeSecretReq, axiosOnReqError)
    secretAxios.interceptors.response.use(axiosOnAfterResp, axiosOnRespError)
    const axiosResp = await secretAxios.post('/security/access/secret', {})
    const resp = axiosResp.data as unknown as network.Response<security.IToken>
    if (resp.err != null) {
        return resp.err
    }
    if (resp.data) {
        const iToken = resp.data
        iToken.token_pri = crypto.aesDecrypt(iToken.token_pri, network.options().secret?.pri as string)
        network.upToken(iToken)
    }
    return null;
}

async function axiosOnBeforeRefreshReq(req: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    if (sys.isRd()) {
        console.log('[ api: ', req.url, "] ", req.data)
    }

    const token = network.token()
    if(!token.isAvailable()){
        return Promise.reject({
            data: null,
            err: {
                type: errors.CODING,
                code: 'token_unavailable',
                message: 'assert token available',
            }
        });
    }
    const err = security.injectSecret(
        token.refreshTokenPub,
        token.refreshTokenPri,
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
        console.log("[ axios.axiosOnBeforeRefreshReq ] axios auth security.injectSecret failed", err)
        return Promise.reject({
            data: null,
            err: {
                type: errors.SYSTEM,
                code: 'req_err',
                message: err.message,
            }
        });
    }
    return req
}

export async function doTurnByRefreshToken(): Promise<errors.Error> {
    const refreshAxios = axios.create({
        baseURL: network.options().access,
    })
    refreshAxios.interceptors.request.use(axiosOnBeforeRefreshReq, axiosOnReqError)
    refreshAxios.interceptors.response.use(axiosOnAfterResp, axiosOnRespError)
    const axiosResp = await refreshAxios.post('/security/access/refresh', {})
    const resp = axiosResp.data as unknown as network.Response<security.IToken>
    if (resp.err != null) {
        return resp.err
    }
    if (resp.data) {
        const srcToken = network.token()
        const iToken = resp.data
        iToken.token_pri = crypto.aesDecrypt(iToken.token_pri, srcToken.refreshTokenPri as string)
        network.upToken(iToken)
    }
    return null;
}

export function axiosGetParams(req: InternalAxiosRequestConfig): Map<string, string> {
    const wrapper = new Map<string, string>()

    if (req.params) {
        Object.keys(req.params).forEach((key: string) => {
            wrapper.set(key, req.params[key])
        });
    }

    if (req.url) {
        const idx = req.url.search('\\?')
        if (idx > -1) {
            const urlQuery = req.url.substring(idx)
            const urlSearchParams = new URLSearchParams(urlQuery);
            urlSearchParams.forEach((value: string, key: string) => {
                wrapper.set(key, value)
            });
        }
    }

    return wrapper
}