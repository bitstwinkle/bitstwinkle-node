export declare namespace sys {
    const SERVER_ID: string;
    enum Mode {
        LOCAL = "local",
        DEV = "dev",
        TEST = "test",
        PRE = "pre",
        PROD = "prod"
    }
    function modeOf(modeStr: string): Mode;
    let RUN_MODE: Mode;
    function SetRunMode(currentMode: string): void;
    function isRd(): boolean;
}
