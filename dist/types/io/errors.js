"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = void 0;
var errors;
(function (errors) {
    errors.CODING = -999;
    errors.SYSTEM = -444;
    errors.APPLICATION = -777;
    function Sys(message) {
        return new UniError(errors.SYSTEM, 'local_run_error', message);
    }
    errors.Sys = Sys;
})(errors || (exports.errors = errors = {}));
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
        return this.type === errors.APPLICATION;
    }
    IsCoding() {
        return this.type === errors.CODING;
    }
    IsSystem() {
        return this.type === errors.SYSTEM;
    }
}
//# sourceMappingURL=errors.js.map