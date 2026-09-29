# JSON Transformer Documentation

A practical guide to transforming one JSON shape into another using a JSON transformation recipe.

## Start here

1. [Concepts](concepts.md) — the mental model.
2. [Architecture](architecture.md) — how the engine executes a transformation.
3. [Mapping Language](mapping-language.md) — the mapping vocabulary.
4. [Arrays](arrays.md) — object/array and nested-array patterns.
5. [Path Resolution](path-resolution.md) — how source paths are resolved.
6. [Tally](tally.md) — the XML/Tally-shaped JSON problem this implementation handles.
7. [AI Guide](ai-guide.md) — a compact repository model for AI-assisted maintenance.
8. [Maintenance](maintenance.md) — rules for changing the engine safely.

## Examples

The examples move from a two-field object to deeply nested arrays and finally to a Tally voucher.

- [01 — Small object](examples/01-small-object.md)
- [02 — Large source, small output](examples/02-large-object.md)
- [03 — Rename and reshape](examples/03-object-to-object.md)
- [04 — Object to array](examples/04-object-to-array.md)
- [05 — Array to array](examples/05-array-to-array.md)
- [06 — Array inside array](examples/06-array-inside-array.md)
- [07 — Array inside array inside array](examples/07-array-inside-array-inside-array.md)
- [08 — Mixed object and array](examples/08-mixed-object-array.md)
- [09 — Tally dotted keys](examples/09-tally-dotted-keys.md)
- [10 — Tally voucher](examples/10-tally-voucher.md)
- [11 — Complete nested voucher](examples/11-complete-voucher.md)
