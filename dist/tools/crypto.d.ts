export declare namespace crypto {
    function sha256(data: string, token: string): string;
    function aesEncrypt(content: string, key: string): string;
    function aesDecrypt(encryptedHexStr: string, key: string): string;
}
