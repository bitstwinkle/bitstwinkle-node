"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
var io;
(function (io) {
    function Success(data) {
        return new Response(data, null);
    }
    io.Success = Success;
    function Error(err) {
        return new Response(null, err);
    }
    io.Error = Error;
    class Response {
        data;
        err;
        constructor(data, err) {
            this.data = data;
            if (err) {
                this.err = err;
            }
            else {
                this.err = null;
            }
        }
        isSuccess() {
            return this.err != null;
        }
        getData() {
            return this.data;
        }
    }
    io.Response = Response;
})(io || (exports.io = io = {}));
//# sourceMappingURL=io.js.map