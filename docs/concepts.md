# Concepts

## The two-document model

The engine works with two JSON structures:

```text
SOURCE JSON                 TRANSFORMATION JSON
───────────                 ───────────────────
data                        output recipe
values                      output keys + instructions
```

The result is a third JSON structure:

```text
SOURCE + TRANSFORMATION → OUTPUT
```

The transformation is not intended to be a copy of the source. It describes the result you want to construct.

## Output keys belong to the transformation

```js
item: {
    customerName: "name"
}
```

The output key is `customerName`.

The string `name` tells the engine where to obtain the value.

## Nested objects

An object instruction creates another output object and recursively processes its `item` mapping.

## Arrays

An array instruction describes a collection. The `list` path identifies the source collection and `item` describes the output object for every member.

## The same rules repeat

This is the central simplifying idea:

```text
object
  └── array
       └── object
            └── array
                 └── object
```

There is no separate algorithm for “array inside array”. It emerges from recursively applying the same mapping rules.

## Source shape and output shape are independent

A source can contain many fields while the output contains only a few. Conversely, the transformation can build a deeper output structure around existing source values.

## Why this matters for adapters

When consuming third-party JSON, application code often becomes filled with property-by-property extraction logic. A mapping keeps that shape knowledge in JSON and leaves the application code focused on using the transformed result.
