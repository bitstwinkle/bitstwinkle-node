import { UError } from "./errors";
export declare namespace io {
    function Success<T>(data: T): Response<T>;
    function Error<T>(err: UError): Response<T>;
    class Response<T> {
        data: T | null;
        err: UError;
        constructor(data: T | null, err: UError);
        isSuccess(): boolean;
        getData(): T | null;
    }
}
