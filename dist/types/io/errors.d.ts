type Type = number;
export declare namespace errors {
    const CODING: Type;
    const SYSTEM: Type;
    const APPLICATION: Type;
}
export type UError = {
    type: Type;
    code: string;
    message: string;
} | null;
export {};
