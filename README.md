# Typesafe object
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