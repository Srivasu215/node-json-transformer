# JSON Transformer

A JSON-to-JSON transformation engine where the **source JSON contains the data** and the **transformation JSON describes the output**.

The important idea is simple:

```text
SOURCE JSON + TRANSFORMATION JSON
                │
                ▼
        transformed JSON
```

The transformation is not a second copy of the source. It is an **output recipe**: it decides which output keys exist, where their values come from, and whether a nested result is an object or an array.

This repository is maintained as a practical JSON transformation engine. Its current implementation is especially useful for JSON produced from XML/Tally-style structures, where keys such as `ALLINVENTORYENTRIES.LIST` contain literal dots and where a collection may arrive sometimes as one object and sometimes as an array.

## Installation

```bash
npm install json-traversal
```

## Basic usage

```js
import transformer from "json-traversal";

const source = {
    name: "Keshav",
    city: "Yamuna Nagar"
};

const transformation = {
    mapping: {
        item: {
            customerName: "name",
            customerCity: "city"
        }
    }
};

const result = transformer.transform(source, transformation);

console.log(result);
```

Output:

```json
{
  "customerName": "Keshav",
  "customerCity": "Yamuna Nagar"
}
```

## The mental model

Think of the two JSON documents as two sides of a mapping:

```text
LEFT / SOURCE                         RIGHT / OUTPUT RECIPE
─────────────────                    ─────────────────────
name: Keshav             ────────▶   customerName: "name"
city: Yamuna Nagar       ────────▶   customerCity: "city"
```

The **keys on the transformation side become keys in the output**.
The **string values on the transformation side are instructions for finding values in the source**.

This means the output can be:

- smaller than the source;
- larger in shape than the source;
- renamed;
- nested differently;
- converted from object to array;
- converted from array to one selected object;
- composed from nested arrays;
- populated with constants;
- type-converted or processed by supported actions.

The source does not have to look like the output.

## The core rule

An object mapping describes an output object:

```js
{
    mapping: {
        item: {
            name: "NAME",
            city: "CITY"
        }
    }
}
```

An array mapping describes an output array:

```js
{
    items: [
        {
            list: "ITEMS",
            item: {
                name: "NAME"
            }
        }
    ]
}
```

The same pattern can be placed inside another pattern. That is what makes **array inside array** and deeper structures possible.

## A smaller output from a bigger source

Source:

```json
{
  "id": 1001,
  "name": "Keshav",
  "city": "Yamuna Nagar",
  "phone": "9999999999",
  "internalCode": "SECRET",
  "unusedField": "remove me"
}
```

Transformation:

```js
const transformation = {
    mapping: {
        item: {
            id: "id",
            name: "name",
            city: "city"
        }
    }
};
```

Output:

```json
{
  "id": 1001,
  "name": "Keshav",
  "city": "Yamuna Nagar"
}
```

The transformation defines the output. Unmentioned source fields are not automatically copied.

## A larger output shape from a smaller source

A transformation can also create a larger **shape** than the source by nesting existing values into new output objects or arrays.

Source:

```json
{
  "name": "Keshav",
  "city": "Yamuna Nagar"
}
```

Transformation:

```js
const transformation = {
    mapping: {
        item: {
            customer: {
                item: {
                    name: "name",
                    location: {
                        item: {
                            city: "city"
                        }
                    }
                }
            }
        }
    }
};
```

Output:

```json
{
  "customer": {
    "name": "Keshav",
    "location": {
      "city": "Yamuna Nagar"
    }
  }
}
```

The output shape is described by the transformation, not inherited from the source.

## Arrays

Source:

```json
{
  "items": [
    { "name": "ROPE", "amount": 260 },
    { "name": "CABLE", "amount": 540 }
  ]
}
```

Transformation:

```js
const transformation = {
    mapping: {
        item: {
            products: [
                {
                    list: "items",
                    item: {
                        productName: "name",
                        amount: "amount"
                    }
                }
            ]
        }
    }
};
```

Output:

```json
{
  "products": [
    { "productName": "ROPE", "amount": 260 },
    { "productName": "CABLE", "amount": 540 }
  ]
}
```

## Array inside array

An array mapping can contain another array mapping.

Source:

```json
{
  "orders": [
    {
      "number": 1001,
      "items": [
        { "name": "ROPE", "batches": ["A", "B"] },
        { "name": "CABLE", "batches": ["C"] }
      ]
    },
    {
      "number": 1002,
      "items": [
        { "name": "MESH", "batches": ["D", "E"] }
      ]
    }
  ]
}
```

Transformation:

```js
const transformation = {
    mapping: {
        item: {
            orders: [
                {
                    list: "orders",
                    item: {
                        number: "number",
                        items: [
                            {
                                list: "items",
                                item: {
                                    name: "name",
                                    batches: [
                                        {
                                            list: "batches",
                                            item: {
                                                value: ""
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
};
```

For a complete catalogue of nested-array patterns, see [`docs/arrays.md`](docs/arrays.md).

## Tally / XML-derived JSON

A major practical case is JSON whose property names themselves contain dots:

```json
{
  "ALLINVENTORYENTRIES.LIST": [
    {
      "STOCKITEMNAME": "ROPE",
      "BATCHALLOCATIONS.LIST": {
        "BATCHID": {
          "#text": 3543
        }
      }
    }
  ]
}
```

Here the dot in `ALLINVENTORYENTRIES.LIST` is part of the property name. It is **not** the same thing as the navigation path:

```text
customer.address.city
```

The current resolver therefore supports both:

```text
customer.address.city
```

and literal dotted keys such as:

```text
ALLINVENTORYENTRIES.LIST
BATCHALLOCATIONS.LIST
LEDGERENTRIES.LIST
ALLLEDGERENTRIES.LIST
```

It resolves the longest matching property name before continuing through the path.

This behavior is documented in [`docs/path-resolution.md`](docs/path-resolution.md).

## Object-to-array normalization

Tally-style data can represent a collection as one object in one record and an array in another record. The transformation can deliberately expose the result as an array:

```js
batch: [
    {
        list: "BATCHALLOCATIONS.LIST",
        item: {
            batchId: "BATCHID.#text",
            batchName: "BATCHNAME",
            amount: "AMOUNT"
        }
    }
]
```

If the source collection is an array, each entry is transformed.
If it is not a non-empty array, the current array traversal returns an empty array.

This makes the output contract explicit: `batch` is an array in the transformation model.

## Nested Tally example

A voucher can be expressed as:

```js
const transformation = {
    mapping: {
        item: {
            vouchers: [
                {
                    list: "items",
                    item: {
                        voucherNumber: "VOUCHERNUMBER",
                        items: [
                            {
                                list: "ALLINVENTORYENTRIES.LIST",
                                item: {
                                    stockItem: "STOCKITEMNAME",
                                    batch: [
                                        {
                                            list: "BATCHALLOCATIONS.LIST",
                                            item: {
                                                batchId: "BATCHID.#text",
                                                batchName: "BATCHNAME",
                                                amount: "AMOUNT"
                                            }
                                        }
                                    ],
                                    accounting: [
                                        {
                                            list: "ACCOUNTINGALLOCATIONS.LIST",
                                            item: {
                                                ledger: "LEDGERNAME",
                                                amount: "AMOUNT"
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                        ledger: [
                            {
                                list: "LEDGERENTRIES.LIST",
                                item: {
                                    name: "LEDGERNAME.#text",
                                    amount: "AMOUNT.#text"
                                }
                            }
                        ],
                        allLedger: [
                            {
                                list: "ALLLEDGERENTRIES.LIST",
                                item: {
                                    name: "LEDGERNAME",
                                    amount: "AMOUNT"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
};
```

The important part is not Tally itself. The important part is that the same transformation mechanism composes repeatedly:

```text
voucher array
    └── inventory array
          ├── batch array
          └── accounting array
    ├── ledger array
    └── allLedger array
```

## Supported mapping families

| Mapping | Purpose |
|---|---|
| `item` | Describe an output object |
| `list` | Read a source collection and transform every item |
| `objectify` | Wrap a source value into an array mapping |
| `flat` | Select one indexed element from a source array and map it as an object |
| `collect` | Build an array from several mapping instructions |
| `$value` | Hard-code a value |
| `(TYPE)` | Apply supported type conversion |
| `{ACTION}` | Apply a supported action |
| `^path` | Resolve a path against the root source |

See [`docs/mapping-language.md`](docs/mapping-language.md) for the full syntax currently implemented by V5.

## Architecture

The implementation has two important walks:

```text
                  transform(source, transformation)
                              │
                              ▼
                       mapping traversal
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
          object            array            value
             │                │                │
             │                │                └── resolveValue()
             │                │                         │
             │                │                         ▼
             │                │                    resolvePath()
             │                │
             │                └── resolve source collection
             │
             └── recursively traverse child mapping

                              ▼
                         output JSON
```

The source lookup logic is intentionally separate from mapping traversal:

- `traverse.js` understands the transformation structure.
- `resolve.js` understands source paths.
- `value.js` resolves one mapping instruction and delegates special behavior.
- `actions.js` contains conversions and actions.
- `constants.js` contains the mapping syntax identifiers.

See [`docs/architecture.md`](docs/architecture.md).

## Tests and stories

The repository contains focused tests and progressive implementation folders. The V5 story tests are especially useful because they demonstrate:

- recursive object output;
- source arrays mapped to output arrays;
- ordinary dotted paths;
- literal dotted property names.

The Tally voucher story is under `test/v7/` and uses the real-world structure needed by the project.

Run tests with:

```bash
npm test
```

## Documentation map

- [`docs/architecture.md`](docs/architecture.md) — how the engine thinks and where each responsibility lives.
- [`docs/concepts.md`](docs/concepts.md) — source, transformation, output, and the central mental model.
- [`docs/mapping-language.md`](docs/mapping-language.md) — mapping syntax and every major instruction family.
- [`docs/arrays.md`](docs/arrays.md) — object, array, nested array, array-inside-array, and normalization stories.
- [`docs/path-resolution.md`](docs/path-resolution.md) — normal dotted paths versus literal dotted keys.
- [`docs/tally.md`](docs/tally.md) — Tally-shaped JSON, voucher examples, and the dotted-key problem.
- [`docs/ai-guide.md`](docs/ai-guide.md) — compact machine-oriented explanation intended to help an AI reason about the codebase correctly.
- [`docs/examples.md`](docs/examples.md) — progressive examples from tiny mappings to nested voucher structures.
- [`docs/maintenance.md`](docs/maintenance.md) — rules for changing the engine without breaking its central story.

## Project identity

The repository package is currently named `json-traversal` in `package.json`. The implementation is a JSON transformer: the transformation mapping drives traversal and output construction.

The project should be understood from behavior and architecture rather than from the historical version names alone.

## License

See the license information retained by the upstream project and the repository's package metadata before redistributing a derivative package.

## cloned from

https://github.com/Sudhirmiglani/node-json-transformer