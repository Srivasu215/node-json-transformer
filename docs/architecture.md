# Architecture

## One traversal story

There is one central idea: **the transformation is traversed recursively**.

The entry point receives:

```text
source + transformation
        ↓
      traverse
        ↓
      output
```

At runtime V5 carries three values through the traversal:

```js
traverse(mapping, source, context)
```

### `mapping`

The current transformation node. It tells the engine what output to construct.

### `source`

The current source node. It is the data from which the current mapping reads values.

### `context`

Shared execution information. V5 currently carries the root source and configuration through context.

```js
{
    rootSource: source,
    configuration: config
}
```

## The entry point

`src/v5/index.js` extracts `mapping` and `config`, then starts traversal:

```js
return traverse(mapping, source, {
    rootSource: source,
    configuration: config
});
```

The entry point does not perform the recursive mapping itself.

## Traversal decision

`src/v5/traverse.js` decides what the current mapping node represents:

```text
mapping
  │
  ├── list / objectify / collect → array traversal
  │
  ├── flat                       → selected object traversal
  │
  ├── item                       → object traversal
  │
  └── plain mapping              → object traversal
```

This is a **dispatch decision**, not a second independent traversal system.

## Object traversal

`traverseObject()` walks the output keys of the current mapping:

```text
for each output key
       │
       ├── string       → resolve a value
       ├── array        → traverse an array mapping
       └── object       → recurse through traverse()
```

The output key comes from the transformation. The source is queried only when the instruction requires a value.

## Array traversal

`traverseArray()` first obtains the source collection and then reuses object traversal for each item:

```text
array mapping
     │
     ├── resolve source list
     │
     └── map each source item
              │
              └── traverseObject(item mapping)
```

That is why nested arrays do not require a special traversal algorithm. An array mapping can contain an object mapping, which can contain another array mapping, and so on.

## Value resolution

`src/v5/value.js` handles a string instruction. It delegates source lookup to `resolvePath()` and can also handle supported hard-coded values, parent/root lookup, type conversion, and actions.

## Path resolution

`src/v5/resolve.js` owns source-path lookup.

This separation matters:

```text
traverse.js  → decides WHAT structure to build
resolve.js   → decides WHERE a source value is
value.js     → decides HOW a string instruction is interpreted
```

The resolver is therefore not another transformation traversal. It is a source-navigation service used by traversal.

## Recursion in one sentence

The recursive call is visible in object traversal:

```js
result[outputKey] = traverse(instruction, source, context);
```

An array then applies the object traversal to every selected source item:

```js
return sourceArray.map((item) => {
    return traverseObject(mapping.item, item, context);
});
```

This is the core recursive story of V5.
