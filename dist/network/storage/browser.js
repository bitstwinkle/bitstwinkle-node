"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserStorage = void 0;
class BrowserStorage {
    get(key) {
        const jsonStr = localStorage.getItem(key);
        if (!jsonStr) {
            return null;
        }
        return JSON.parse(jsonStr);
    }
    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }
    clean() {
        localStorage.clear();
    }
    iter(callback) {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) {
                continue;
            }
            const val = this.get(key);
            if (!val) {
                continue;
            }
            callback(key, val);
        }
    }
    remove(key) {
        localStorage.removeItem(key);
    }
}
exports.BrowserStorage = BrowserStorage;
//# sourceMappingURL=browser.js.map