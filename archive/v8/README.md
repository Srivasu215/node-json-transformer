# JSON Transformer V5

## The story

The transformer has two JSON documents with different jobs:

- **Source** — the data that already exists.
- **Transformation** — the recipe that describes the output shape and where each output value comes from.

The transformation is walked from the outside toward the inside.

```text
transform(source, transformation)
        |
        v
     mapping
        |
        v
     traverse()
        |
        +---- mapping describes an object
        |          |
        |          +-- string instruction -> resolve a value from source
        |          +-- object instruction -> traverse again
        |          +-- array instruction  -> traverse an array mapping
        |
        +---- mapping describes an array
                   |
                   +-- find source array/value
                   +-- transform each selected source item
```

There are therefore two different walks:

1. **Mapping traversal** — `traverse.js` walks the transformation recipe and constructs the result.
2. **Source-path resolution** — `resolve.js` walks the source data to find the value requested by a string path.

They cooperate, but they have different jobs.

### The important recursive step

Nested output objects do not require a second transformation engine. An object instruction calls `traverse()` again:

```js
result[outputKey] = traverse(instruction, source, context);
```

That is the recursive core of the transformer.

### Literal dotted keys

Source paths normally use dots as navigation:

```text
customer.address.city
```

But source data can also contain a literal key containing dots:

```text
ALLINVENTORYENTRIES.LIST
BATCHALLOCATIONS.LIST
LEDGERENTRIES.LIST
```

`resolve.js` therefore resolves the longest matching property name before continuing through the remaining path. This allows normal dotted paths and Tally-style literal dotted keys to coexist.
