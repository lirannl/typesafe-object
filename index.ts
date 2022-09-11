import { Add, Subtract } from "./arithmetic";
import { NestedKeyOf, PathOf } from "./nested";

export { NestedKeyOf, PathOf, Add, Subtract };

function _get(obj: object, path: string | number): any {
    if (path === "") {
        return obj;
    }
    const [head, ...tail] = `${path}`.split(".");
    if (tail.length === 0)
        return obj[head as keyof object];
    return _get(obj[head as keyof object], tail.join("."));
}
export function get<T extends object, P extends NestedKeyOf<T>>(obj: T, path: P): PathOf<T, P> {
    return _get(obj, path);
}