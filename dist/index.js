"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
function _get(obj, path) {
    if (path === "") {
        return obj;
    }
    var _a = ("" + path).split("."), head = _a[0], tail = _a.slice(1);
    if (tail.length === 0)
        return obj[head];
    return _get(obj[head], tail.join("."));
}
function get(obj, path) {
    return _get(obj, path);
}
exports.get = get;
