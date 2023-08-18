type Type = number;
export declare namespace errors {
    const CODING: Type;
    const SYSTEM: Type;
    const APPLICATION: Type;
    function Sys(message: string): UError;
}
export type UError = {
    type: Type;
    code: string;
    message: string;
} | null;
export {};
