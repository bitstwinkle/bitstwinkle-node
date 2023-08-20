"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sys = void 0;
const unique_1 = require("./unique");
var sys;
(function (sys) {
    sys.SERVER_ID = unique_1.unique.randID();
    let Mode;
    (function (Mode) {
        Mode["LOCAL"] = "local";
        Mode["DEV"] = "dev";
        Mode["TEST"] = "test";
        Mode["PRE"] = "pre";
        Mode["PROD"] = "prod";
    })(Mode = sys.Mode || (sys.Mode = {}));
    function modeOf(modeStr) {
        switch (modeStr) {
            case Mode.LOCAL:
                return Mode.LOCAL;
            case Mode.DEV:
                return Mode.DEV;
            case Mode.TEST:
                return Mode.TEST;
            case Mode.PRE:
                return Mode.PRE;
            case Mode.PROD:
                return Mode.PROD;
        }
        return Mode.DEV;
    }
    sys.modeOf = modeOf;
    sys.RUN_MODE = Mode.LOCAL;
    function SetRunMode(currentMode) {
        sys.RUN_MODE = currentMode;
    }
    sys.SetRunMode = SetRunMode;
    function isRd() {
        return sys.RUN_MODE === Mode.LOCAL ||
            sys.RUN_MODE === Mode.DEV ||
            sys.RUN_MODE === Mode.TEST ||
            sys.RUN_MODE === Mode.PRE;
    }
    sys.isRd = isRd;
})(sys || (exports.sys = sys = {}));
//# sourceMappingURL=sys.js.map