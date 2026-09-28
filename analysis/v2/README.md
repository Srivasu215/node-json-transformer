# Analysis V2 — Recovering the Traversal Story

This analysis is based on the current `src/v4` implementation.

Unlike V1, this version starts with a source search so the call relationships
are discovered from the code before writing the explanation.

## Search result

The important calls are:

```text
index.js
  transform()
    -> traverse()

traverse.js
  traverse()
    -> traverseObject()
    -> traverseArray()

traverseObject()
  -> resolveValue()
  -> traverseArray()
  -> traverse()

traverseArray()
  -> resolvePath()
  -> traverseObject()

value.js
  resolveValue()
    -> resolvePath()
    -> performAction()

actions.js
  -> resolvePath()
```

## Recovered mental model

There is one transformation traversal.

`traverse()` is the dispatcher for the current mapping node.

It does not itself walk every child. It identifies what kind of mapping node
it has and hands that node to the corresponding traversal operation.

The recursive relationship is visible in `traverseObject()`:

```js
if (instruction && typeof instruction === "object") {
    result[outputKey] = traverse(instruction, source, context);
}
```

That is the central recursion.

Arrays add another movement:

```text
mapping.list
    ↓
resolvePath()
    ↓
source array
    ↓
map each source item
    ↓
traverseObject(mapping.item, item, context)
```

## Two different meanings of "traversal"

There is one transformation traversal, but source lookup has its own
path-walking mechanism.

### Transformation traversal

```text
mapping
  ↓
traverse
  ↓
traverseObject / traverseArray
  ↓
nested traverse
```

### Source-path lookup

```text
"path.to.value"
  ↓
resolvePath
  ↓
walk source
  ↓
value
```

The second one is not a second transformation strategy. It is the mechanism
used when a mapping says where a value should come from.

## Source and transformation

The entry point establishes:

```text
source          = input JSON
transformation  = instructions
mapping         = transformation.mapping
config          = transformation.config
```

Then:

```text
traverse(mapping, source, context)
```

The source is the data being read.

The mapping describes the output shape and where each output value comes from.

The traversal therefore moves primarily through the mapping, while source
lookup follows paths into the source.

## Smallest useful story

```text
SOURCE JSON
    │
    │ values
    ▼
TRANSFORMATION / MAPPING
    │
    │ describes output
    ▼
TRAVERSE
    │
    ├── object mapping → traverseObject
    │                      │
    │                      ├── string → resolveValue → resolvePath
    │                      └── object → traverse again
    │
    └── array mapping → traverseArray
                           │
                           ├── resolvePath(list)
                           └── each item → traverseObject
    │
    ▼
RESULT JSON
```

This is the story recovered from the implementation; it is not an injected
redesign.
