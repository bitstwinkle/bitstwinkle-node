import { errors } from "../../types/errors";
export declare namespace security {
    type IToken = {
        token_pub: string;
        token_expire: string;
        token_pri: string;
        token: string;
    };
    class Token {
        refreshTokenPub: string;
        refreshTokenExpire: Date;
        refreshTokenPri: string;
        tokenPub: string;
        tokenExpire: Date;
        tokenPri: string;
        constructor();
        from(src: IToken): void;
        isAvailable(): boolean;
        isRefreshAvailable(): boolean;
    }
    function injectSecret(secretPub: string, secretPri: string, setHeader: (k: any, v: any) => void, getParams: () => Map<string, string>, getBody: () => string | null): errors.Error;
    function injectToken(tokenPub: string, tokenPri: string, setHeader: (k: any, v: any) => void, getParams: () => Map<string, string>, getBody: () => string | null): errors.Error;
    function analyzeResponse(get: (k: string) => any): void;
}
export type LightToken = {
    refreshTokenPub: string;
    refreshTokenExpire: Date;
    refreshToken: string;
    tokenPub: string;
    tokenExpire: Date;
    token: string;
};
export type NodeToken = {
    tokenPub: string;
    tokenExpire: Date;
    token: string;
};
export declare function getEmptyToken(): LightToken;
export declare function getEmptyNodeToken(): NodeToken;
