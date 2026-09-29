# AI Maintenance Guide

This file is intentionally explicit so an AI working on the repository can recover the mental model before changing code.

## 1. Start with the entry point

Read:

```text
src/v5/index.js
```

The public operation is:

```js
transform(source, transformation)
```

It extracts `mapping` and starts `traverse()`.

## 2. Understand the three traversal arguments

```js
traverse(mapping, source, context)
```

- `mapping` = what output structure to construct now.
- `source` = the source node currently being read.
- `context` = root source and configuration shared through recursion.

Do not confuse `mapping` with source data.

## 3. Find the recursive owner

Read:

```text
src/v5/traverse.js
```

The recursive owner is `traverse()`.

Object traversal loops over output keys and calls `traverse()` for nested object instructions.

Array traversal maps `traverseObject()` over the selected source collection.

## 4. Do not create a second traversal casually

Before adding recursion anywhere else, ask:

> Is this really traversal, or is it source resolution/value interpretation?

Source lookup belongs in `resolve.js`.
String instruction interpretation belongs in `value.js`.
Action/type behavior belongs in `actions.js`.

## 5. Preserve the dotted-key rule

A change to path resolution must preserve both cases:

```text
customer.address.city
```

and:

```text
ALLINVENTORYENTRIES.LIST
```

A test for only one case is insufficient.

## 6. Preserve recursive array behavior

Before changing array logic, test:

```text
array
array → object
array → array
array → array → array
```

and a Tally-style array key containing dots.

## 7. Prefer a new version for architectural experiments

The repository has versioned `src/v*` implementations. When a new architecture is experimental, create a new version rather than silently changing an older story.

The tests should point explicitly at the version they describe.

## 8. Documentation is part of the architecture

When a behavior becomes important enough to preserve, document:

1. source shape;
2. transformation shape;
3. output shape;
4. which file owns the behavior;
5. a regression test.

## 9. The shortest mental model

```text
SOURCE
  +
TRANSFORMATION
  ↓
traverse
  ├── object mapping → output object
  ├── array mapping  → output array
  └── recurse        → same rules again

string instruction
  ↓
resolveValue
  ↓
resolvePath
  ↓
source value
```

That is the model to recover before proposing a refactor.
