"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = void 0;
var errors;
(function (errors) {
    errors.CODING = -999;
    errors.SYSTEM = -444;
    errors.APPLICATION = -777;
    class UniError {
        type;
        code;
        message;
        constructor(type, code, message) {
            this.type = type;
            this.code = code;
            this.message = message;
        }
        To() {
            return {
                type: this.type,
                code: this.code,
                message: this.message,
            };
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
    errors.UniError = UniError;
})(errors || (exports.errors = errors = {}));
//# sourceMappingURL=errors.js.map