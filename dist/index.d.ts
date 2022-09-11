import { Add, Subtract } from "./arithmetic";
import { NestedKeyOf, PathOf } from "./nested";
export { NestedKeyOf, PathOf, Add, Subtract };
export declare function get<T extends object, P extends NestedKeyOf<T>>(obj: T, path: P): PathOf<T, P>;
