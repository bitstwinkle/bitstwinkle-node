"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randID = void 0;
const uuid_1 = require("uuid");
function randID() {
    return (0, uuid_1.v4)().replace(/-/g, '');
}
exports.randID = randID;
//# sourceMappingURL=unique.js.map