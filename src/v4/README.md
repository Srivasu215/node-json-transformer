# JSON Transformer V4

V4 makes the transformation mechanism visible in the code.

The source JSON remains the data. The transformation JSON describes how to walk the source and construct the result.

## Two traversals

There are two related jobs:

1. **Transformation traversal** — `traverse.js` walks the mapping structure and decides whether the next operation is an object, an array, an indexed item, or a collected result.
2. **Source-path traversal** — `resolve.js` walks the source JSON for a mapping value such as `customer.address.city`. It also understands literal dotted keys such as `ALLINVENTORYENTRIES.LIST`.

The overall flow is:

```text
source JSON + transformation JSON
              │
              ▼
        transformation traversal
              │
              ├── resolve source value
              ├── transform object
              ├── transform array
              ├── convert value / action
              │
              ▼
          result JSON
```

V4 is intended to make the existing behavior easier to inspect and maintain; it is not a new transformation language.
