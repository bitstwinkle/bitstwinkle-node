import { UError } from "../../types/errors/errors";
export declare function sign(data: string, token: string): {
    signStr: string;
    err: UError;
};
