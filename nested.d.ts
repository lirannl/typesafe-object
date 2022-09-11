import { Add } from "./arithmetic";

type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

type _NestedKeyOf<T, TupleI extends number = 0> =
    // Empty tuples have no members
    T extends [] ? never :
    // Tuple handling
    T extends [infer Head, ...infer Tail] ?
    `${TupleI}` | _NestedKeyOf<Tail, Add<TupleI, 1>> |
    // Object Tuple handling
    (Head extends object ? `${TupleI}.${_NestedKeyOf<Head>}` : never)
    :
    // Array handling
    T extends (infer M)[] ?
    `${number}` |
    // Object array handling
    (M extends object ? `${number}.${Exclude<_NestedKeyOf<M>, symbol>}` : never)
    :
    // Record handling
    string extends keyof T ? `${string}` |
    // Record object handling
    (T[string] extends object ? `${string}.${_NestedKeyOf<T[string]>}` : never)
    :
    // Non-array handling
    { [K in keyof T]: T[K] extends object ? Exclude<K, symbol> |
        `${Exclude<K, symbol>}.${_NestedKeyOf<T[K]>}` : Exclude<K, symbol> }[keyof T];

export type NestedKeyOf<T extends object> = _NestedKeyOf<DeepWriteable<T>>;

type _PathOf<Object, Path extends string | number> =
    Path extends `${infer Head}.${infer Tail}` ?
    Head extends `${number}` ?
    // Array handling
    _PathOf<Object[Head extends keyof Object ? Head : never], Tail> :
    Head extends keyof Object ? _PathOf<Object[Head], Tail> : never :
    Path extends `${number}` ? Object[Path extends keyof Object ? Path : never] :
    Path extends keyof Object ? Object[Path] : never;

export type PathOf<T extends object, P extends NestedKeyOf<T>> = _PathOf<T, P>;