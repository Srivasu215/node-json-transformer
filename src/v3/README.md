# V3 source map

V3 keeps the transformer behavior and separates the capabilities already present in the engine into understandable source files.

## Source blocks

- `index.js` — public `transform(data, transformation)` entry point.
- `engine.js` — connects object, array, and special-object transformations for one transform call.
- `object.js` — builds an output object from an `item` mapping.
- `array.js` — builds arrays from `list`, `objectify`, and `collect` mappings.
- `value.js` — turns one mapping value into the value placed in the output.
- `path.js` — resolves JSON paths, including literal dotted keys used by Tally data.
- `actions.js` — contains the existing type conversions and mapping actions.
- `constants.js` — mapping syntax identifiers and default values.

## The useful boundary

A mapping value can be a normal path:

```text
customer.address.city
```

or a literal dotted property name:

```text
ALLINVENTORYENTRIES.LIST
```

The resolver is responsible for deciding how that path is read. The transformation files are responsible for deciding whether the result becomes an object, array, or value in the output.

## Why the files are separate

The split follows behavior already present in the implementation. It is not a new transformation language and it does not change the mapping format.

Each source file can therefore be read, tested, and studied as one capability without first understanding the complete transformer.
