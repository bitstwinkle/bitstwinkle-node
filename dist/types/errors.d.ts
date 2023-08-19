export declare namespace errors {
    type Type = number;
    const CODING: Type;
    const SYSTEM: Type;
    const APPLICATION: Type;
    type Error = {
        type: Type;
        code: string;
        message: string;
    } | null;
    class UniError {
        type: Type;
        code: string;
        message: string;
        constructor(type: Type, code: string, message: string);
        To(): Error;
        IsApplication(): boolean;
        IsCoding(): boolean;
        IsSystem(): boolean;
    }
}
