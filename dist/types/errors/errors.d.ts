type Type = number;
export type UError = UniError | null;
declare class UniError {
    type: Type;
    code: string;
    message: string;
    constructor(type: Type, code: string, message: string);
    IsApplication(): boolean;
    IsCoding(): boolean;
    IsSystem(): boolean;
}
export {};
