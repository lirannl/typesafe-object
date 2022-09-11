type Length<T extends any[]> =
    T extends { length: infer L } ? L : never;

type BuildTuple<L extends number, T extends any[] = []> =
    T extends { length: L } ? T : BuildTuple<L, [...T, any]>;

export type Add<A extends number, B extends number> =
    Length<[...BuildTuple<A>, ...BuildTuple<B>]>;

export type Subtract<A extends number, B extends number> =
    BuildTuple<A> extends [...(infer U), ...BuildTuple<B>]
    ? Length<U>
    : never;