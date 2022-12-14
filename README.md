# Typesafe object [![Node.js Package](https://github.com/lirannl/typesafe-object/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/lirannl/typesafe-object/actions/workflows/npm-publish.yml)
A typescript package allowing for safe nested property access within objects. Also comes with arithmetic types (add, subtract) that were needed to support tuples.

This package includes:

## NestedKeyOf
A nested verion of keyof which returns all keys of an object, including nested ones.  
Example:
```ts
type ExampleType = {a: number, b: [string, number], c: {d: string, e: number}};
const a: NestedKeyOf<ExampleType> = "a" // Okay
const b: NestedKeyOf<ExampleType> = "b.0" // Okay
const c: NestedKeyOf<ExampleType> = "a.0" // Error
```

## PathOf
Given a nested path, returns the type of the object at that path
```ts
const g: PathOf<ExampleType, "b.0"> = 0; // Error
const g: PathOf<ExampleType, "b.0"> = "hello"; // Okay
const g: PathOf<ExampleType, "a"> = "hello"; // Error
```

## Get
A nested path getter - given an object and a path, will yield the type of the object and the given path
```ts
const obj = {a: {b: {c: "d"}}, e: ["f", "g"], h: ["i"]}
get(obj, "e.0") // "f"
```

The package requires at least typescript 4.1.
