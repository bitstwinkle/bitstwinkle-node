"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CODING = -999;
const SYSTEM = -444;
const APPLICATION = -777;
class UniError {
    type;
    code;
    message;
    constructor(type, code, message) {
        this.type = type;
        this.code = code;
        this.message = message;
    }
    IsApplication() {
        return this.type === APPLICATION;
    }
    IsCoding() {
        return this.type === CODING;
    }
    IsSystem() {
        return this.type === SYSTEM;
    }
}
//# sourceMappingURL=errors.js.map