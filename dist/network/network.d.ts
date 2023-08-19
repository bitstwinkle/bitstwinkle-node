import { UError } from "../types/io/errors";
import { errors } from "../types/errors";
import { ref } from "../types/ref";
export declare namespace network {
    interface IClient {
        call<D, R>(api: string, data: D): Promise<Response<R>>;
    }
    function init(scope: ref.Scope, cli: IClient): void;
    function scope(): ref.Scope;
    function cli(): IClient;
    function Success<T>(data: T): Response<T>;
    function Error<T>(err: UError): Response<T>;
    class Response<T> {
        data: T | null;
        err: errors.Error;
        constructor(data: T | null, err: errors.Error);
        isSuccess(): boolean;
        getData(): T | null;
    }
}
