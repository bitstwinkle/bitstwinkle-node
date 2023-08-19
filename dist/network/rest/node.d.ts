import { UError } from "../../types/io/errors";
import { io } from "../../types/io/io";
import { network } from "../network";
export declare namespace node {
    type Options = {
        baseURL: string;
        secretPub: string;
        secretPri: string;
    };
    export function initClientEnv(options: Options): void;
    export class Client implements network.IClient {
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
