import { io } from "../../types/io/io";
import { InternalAxiosRequestConfig } from "axios";
export declare namespace cli {
    const DEFAULT_BITSTWINKLE_URL = "http://localhost:8080";
    interface IStore {
        get<V>(key: string): V;
        set<V>(key: string, val: V): void;
    }
    interface Client {
        call<D, R>(api: string, data: D): Promise<io.Response<R>>;
    }
    class KVStore implements IStore {
        private db;
        get<V>(key: string): V;
        set<V>(key: string, val: V): void;
    }
}
export declare function axiosGetParams(req: InternalAxiosRequestConfig): Map<string, string>;
