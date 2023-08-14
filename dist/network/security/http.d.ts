import { InternalAxiosRequestConfig } from "axios/index";
import { UError } from "../../types/errors/errors";
export interface HttpRequest {
    setHeader(key: string, value: string): void;
    getHeader(key: string): string;
    getQueryMap(): Map<string, string[]>;
    getPostForm(): Map<string, string[]>;
    getBody(): string;
}
export declare function signature(req: InternalAxiosRequestConfig, tokenPub: string, tokenPri: string): UError;
export declare function genSignature(req: InternalAxiosRequestConfig, priKey: string): {
    signStr: string;
    err: UError;
};
