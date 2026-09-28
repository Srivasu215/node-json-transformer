# Analysis V1 — Transformer Brain

This folder is not production code.

It records small executable observations of the current transformer so the
mental model can be recovered from the source instead of being invented.

## Observation 1 — entry

`transform(source, transformation)` separates:

- source: the input JSON
- transformation: instructions
- mapping: the transformation mapping
- config: transformation configuration

It then calls:

```text
traverse(mapping, source, context)
```

## Observation 2 — one traversal

`traverse()` is the central transformation traversal.

It decides what the current mapping means:

```text
mapping
  ├─ list / objectify / collect → traverseArray
  ├─ flat                       → traverseObject(selected item)
  ├─ item                       → traverseObject(item)
  └─ otherwise                  → traverseObject(mapping)
```

`traverseObject()` walks mapping keys and builds the result object.

## Observation 3 — values

When a mapping value is a string, `traverseObject()` sends it to
`resolveValue()`.

`resolveValue()` can:

- use a hard-coded value
- read from the root source
- resolve a source path
- convert a value
- perform an action

## Observation 4 — source lookup

`resolvePath()` is used to locate a value in the current source.

It understands both:

```text
customer.address.city
```

and literal dotted keys such as:

```text
ALLINVENTORYENTRIES.LIST
```

This is source lookup used by the transformation traversal; it is not a
second transformation strategy.

## Observation 5 — arrays

For an array instruction:

```text
list → resolve source array → each item → traverseObject(item)
```

That is the key recursive movement through a nested transformation.

## Why this folder exists

The code here is intentionally small. Each file isolates one observation and
uses the real V4 implementation. The tests make those observations executable.
