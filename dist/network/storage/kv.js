"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KVStorage = void 0;
class KVStorage {
    db = new Map;
    get(key) {
        return this.db.get(key);
    }
    set(key, val) {
        this.db.set(key, val);
    }
    clean() {
        this.db.clear();
    }
    iter(callback) {
        for (const key of this.db.keys()) {
            const val = this.db.get(key);
            callback(key, val);
        }
    }
    remove(key) {
        this.db.delete(key);
    }
}
exports.KVStorage = KVStorage;
//# sourceMappingURL=kv.js.map