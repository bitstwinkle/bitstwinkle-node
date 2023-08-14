import { AxiosInstance } from "axios";
import { UError } from "../../types/errors/errors";
export type Options = {
    BaseURL: string;
};
declare abstract class Client {
    protected options: Options;
    protected axiosInstance: AxiosInstance;
    protected constructor(options: Options);
    axios(): AxiosInstance;
    abstract init(): UError;
    abstract exchangeToken(): UError;
}
export declare class LightClient extends Client {
    private lightToken;
    constructor(options: Options);
    init(): UError;
    exchangeToken(): UError;
}
export {};
