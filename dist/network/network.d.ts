import { errors } from "../types/errors";
import { ref } from "../types/ref";
import { security } from "./security/security";
export declare namespace network {
    type Options = {
        access: string;
        scope: ref.Scope;
        secret: {
            pub: string;
            pri: string;
        } | null;
        onLogin: (() => void) | null;
    };
    interface IStorage {
        get<V>(key: string): V | null;
        set<V>(key: string, val: V): void;
        remove(key: string): void;
        clean(): void;
        iter<V>(callback: (key: string, val: V) => void): void;
    }
    interface IClient {
        call<D, R>(api: string, data: D): Promise<Response<R>>;
    }
    function init(options: Options): null;
    function use(storage: IStorage, cli: IClient): void;
    function options(): Options;
    function scope(): ref.Scope;
    function storage(): IStorage;
    function cli(): IClient;
    function token(): security.Token;
    function upToken(iToken: security.IToken): void;
    function Success<T>(data: T): Response<T>;
    function Error<T>(err: errors.Error): Response<T>;
    class Response<T> {
        data: T | null;
        err: errors.Error;
        constructor(data: T | null, err: errors.Error);
        isSuccess(): boolean;
        getData(): T | null;
    }
}
