"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.times = void 0;
var times;
(function (times) {
    function getTime(timeStr) {
        if (!timeStr) {
            return new Date();
        }
        return new Date(timeStr);
    }
    times.getTime = getTime;
})(times || (exports.times = times = {}));
//# sourceMappingURL=times.js.map