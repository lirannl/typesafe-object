import { Add } from "./arithmetic";

type _OmitByValue<O, V> = V extends infer Head | V ?
    never extends Head ? { [K in keyof O as V extends O[K] ? never : K]: O[K] } :
    { [K in keyof O as Head extends O[K] ? never : K]: O[K] } | _OmitByValue<O, Exclude<V, Head>> :
    never;

/**
 * Omit properties from an object whose value is in the given blacklist union
 */
type OmitByValue<O, Blacklist> = keyof _OmitByValue<O, Blacklist> extends never ? Record<string, never> : { [Key in keyof _OmitByValue<O, Blacklist>]: _OmitByValue<O, Blacklist>[Key] };

/**
 * Removes any keys containing any of the types that have already been entered
 */
export type RemoveCirularReferences<T, Blacklist = T> =
    T extends [] ? T :
    T extends (infer M)[] ?
    (M extends object ? RemoveCirularReferences<Exclude<M, Blacklist>, Blacklist> : Exclude<M, Blacklist>)[] :
    // Object handling
    T extends object ?
    { [K in keyof OmitByValue<T, T>]: RemoveCirularReferences<OmitByValue<T, T>[K], OmitByValue<T, T>[K] | Blacklist> } :
    // Only objects can have circular references - therefore we can just return primitives as-is
    T;

type DeepReqiuredWriteable<T> = { -readonly [P in keyof T]-?: DeepReqiuredWriteable<RemoveCirularReferences<NonNullable<T[P]>>> };

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

type OptionalPropAccessor<T, K extends keyof Exclude<T, undefined>> = T extends undefined ?
    Exclude<T, undefined>[K] | undefined : Exclude<T, undefined>[K];

/**
 * Given an object with type {@link T}, returns a union of all paths to a value within {@link T}
 */
export type NestedKeyOf<T extends object> = _NestedKeyOf<DeepReqiuredWriteable<DeepReqiuredWriteable<T>>>;

type _PathOf<Object, Path extends string | number> =
    Path extends `${infer Key}.${infer Rest}` ?
    Key extends keyof Exclude<Object, undefined> ? _PathOf<OptionalPropAccessor<Object, Key>, Rest> : never :
    Path extends keyof Exclude<Object, undefined> ? OptionalPropAccessor<Object, Path> : never;

/**
 * Given an object with type {@link T}, and a path with type {@link P}, returns the type of the value at {@link P} within {@link T}
 */
export type PathOf<T extends object, P extends NestedKeyOf<T>> = _PathOf<T, P>;