import { UError } from "../../types/io/errors";
import { cli } from "./client";
import { io } from "../../types/io/io";
export declare namespace node {
    type Options = {
        baseURL: string;
        secretPub: string;
        secretPri: string;
    };
    export function initClientEnv(options: Options): void;
    export class Client implements cli.Client {
        private options;
        private axiosInstance;
        private token;
        constructor();
        call<D, R>(api: string, data: D): Promise<io.Response<R>>;
        exchangeToken(): void;
        doInit(): void;
        doExchangeToken(): Promise<UError>;
    }
    export {};
}
