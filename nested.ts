import { Add } from "./arithmetic";

type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

type _NestedKeyOf<T, TupleI extends number = 0> =
    // Empty tuples have no members
    T extends [] ? never :
    T extends [infer Head, ...infer Tail] ?
    // Tuple handling    
    Head extends object ?
    // Object tuple handling
    `${TupleI}` | `${TupleI}.${Exclude<_NestedKeyOf<Head>, symbol>}` |
    _NestedKeyOf<Tail, Add<TupleI, 1>> :
    // Primitive tuple handling
    `${TupleI}` | _NestedKeyOf<Tail, Add<TupleI, 1>> :
    T extends (infer M)[] ?
    // Array handling
    M extends object ?
    // Object array handling
    `${number}` | `${number}.${Exclude<_NestedKeyOf<M>, symbol>}` :
    // Primitive array handling
    `${number}` :
    // Non-array handling
    { [K in keyof T]: T[K] extends object ? Exclude<K, symbol> |
        `${Exclude<K, symbol>}.${_NestedKeyOf<T[K]>}` : Exclude<K, symbol> }[keyof T];

/**
 * Given an object with type {@link T}, returns a union of all paths to a value within {@link T}
 */
export type NestedKeyOf<T extends object> = _NestedKeyOf<DeepWriteable<T>>;

type _PathOf<Object, Path extends string | number> =
    Path extends `${infer Head}.${infer Tail}` ?
    Head extends `${number}` ?
    // Array handling
    _PathOf<Object[Head extends keyof Object ? Head : never], Tail> :
    Head extends keyof Object ? _PathOf<Object[Head], Tail> : never :
    Path extends `${number}` ? Object[Path extends keyof Object ? Path : never] :
    Path extends keyof Object ? Object[Path] : never;

/**
 * Given an object with type {@link T}, and a path with type {@link P}, returns the type of the value at {@link P} within {@link T}
 */
export type PathOf<T extends object, P extends NestedKeyOf<T>> = _PathOf<T, P>;