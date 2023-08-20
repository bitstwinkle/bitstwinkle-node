import { network } from "../network";
export declare class NodeClient implements network.IClient {
    private axiosInstance;
    constructor();
    call<D, R>(api: string, data: D): Promise<network.Response<R>>;
    doInit(): void;
}
