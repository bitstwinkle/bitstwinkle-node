"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unique = void 0;
const uuid_1 = require("uuid");
var unique;
(function (unique) {
    function randID() {
        return (0, uuid_1.v4)().replace(/-/g, '');
    }
    unique.randID = randID;
})(unique || (exports.unique = unique = {}));
//# sourceMappingURL=unique.js.map