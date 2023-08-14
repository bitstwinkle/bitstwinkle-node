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
