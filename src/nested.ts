import { Add, Subtract } from "./arithmetic";

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

type KeyofArr<Arr extends [...unknown[]], I extends number = 1> = Arr extends [] ? never :
    Arr extends [unknown, ...infer Rest] ?
    0 | Subtract<I, 1> | KeyofArr<Rest, Add<I, 1>> : number;

type KeyOf<T> = T extends object ?
    T extends Array<unknown> ? KeyofArr<T> :
    keyof T & string :
    never;

type MaybeSubtract<N extends number | undefined, Amount extends number> = N extends undefined ? undefined : Subtract<Exclude<N, undefined>, Amount>;

type _NestedKeyOf<T extends Record<string, unknown> | unknown[],
    MaxDepth extends number | undefined, Blacklist = never> =
    MaxDepth extends 0 ? KeyOf<T> :
    T extends Blacklist ? never :
    { [K in KeyOf<T>]: K |
        // @ts-ignore
        `${K}.${_NestedKeyOf<T[K], MaybeSubtract<MaxDepth, 1>>}`
    }[KeyOf<T>];

/**
 * Given an object with type {@link T}, returns a union of all paths to a value within {@link T}
 */
export type NestedKeyOf<T extends Record<string, unknown> | unknown[],
    MaxDepth extends number | undefined = undefined> = _NestedKeyOf<DeepReqiuredWriteable<T>, MaxDepth>;

type OptionalPropAccessor<T, K extends keyof Exclude<T, undefined>> = T extends undefined ?
    Exclude<T, undefined>[K] | undefined : Exclude<T, undefined>[K];

type _PathOf<Object, Path extends string | number> =
    Path extends `${infer Key}.${infer Rest}` ?
    Key extends keyof Exclude<Object, undefined> ? _PathOf<OptionalPropAccessor<Object, Key>, Rest> : never :
    Path extends keyof Exclude<Object, undefined> ? OptionalPropAccessor<Object, Path> : never;

/**
 * Given an object with type {@link T}, and a path with type {@link P}, returns the type of the value at {@link P} within {@link T}
 */
export type PathOf<T extends Record<string, unknown> | unknown[], P extends NestedKeyOf<T>> = _PathOf<T, P>;