import { Add, Subtract } from "./arithmetic";
import { NestedKeyOf, PathOf } from "./nested";

export { NestedKeyOf, PathOf, Add, Subtract };

function _get(obj: object | undefined, path: string | number): any {
    if (path === "") {
        return obj;
    }
    const [head, ...tail] = `${path}`.split(".") as [keyof object, ...string[]];
    const safeObj = obj ?? {};
    if (tail.length === 0)
        return safeObj[head];
    return _get(safeObj[head], tail.join("."));
}
/**
 * A typesafe object getter, reading a path
 * @param obj The object to read from
 * @param path A path to a value within {@link obj}
 */
export function get<T extends object, P extends NestedKeyOf<T>>(obj: T, path: P): PathOf<T, P> {
    return _get(obj, path);
}