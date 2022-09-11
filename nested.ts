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

export type NestedKeyOf<T extends object> = _NestedKeyOf<DeepWriteable<T>>;