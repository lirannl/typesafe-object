import { Add } from "./arithmetic";
declare type DeepWriteable<T> = {
    -readonly [P in keyof T]: DeepWriteable<T[P]>;
};
declare type _NestedKeyOf<T, TupleI extends number = 0> = T extends [] ? never : T extends [infer Head, ...infer Tail] ? Head extends object ? `${TupleI}` | `${TupleI}.${Exclude<_NestedKeyOf<Head>, symbol>}` | _NestedKeyOf<Tail, Add<TupleI, 1>> : `${TupleI}` | _NestedKeyOf<Tail, Add<TupleI, 1>> : T extends (infer M)[] ? M extends object ? `${number}` | `${number}.${Exclude<_NestedKeyOf<M>, symbol>}` : `${number}` : {
    [K in keyof T]: T[K] extends object ? Exclude<K, symbol> | `${Exclude<K, symbol>}.${_NestedKeyOf<T[K]>}` : Exclude<K, symbol>;
}[keyof T];
export declare type NestedKeyOf<T extends object> = _NestedKeyOf<DeepWriteable<T>>;
declare type _PathOf<Object, Path extends string | number> = Path extends `${infer Head}.${infer Tail}` ? Head extends `${number}` ? _PathOf<Object[Head extends keyof Object ? Head : never], Tail> : Head extends keyof Object ? _PathOf<Object[Head], Tail> : never : Path extends `${number}` ? Object[Path extends keyof Object ? Path : never] : Path extends keyof Object ? Object[Path] : never;
export declare type PathOf<T extends object, P extends NestedKeyOf<T>> = _PathOf<T, P>;
export {};
