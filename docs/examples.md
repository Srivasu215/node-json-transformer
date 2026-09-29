# Progressive Examples

These examples are intentionally small first and deep later. The purpose is to learn the mapping language by composition.

## Example 1 — rename by output shape

Source:

```json
{
  "firstName": "Keshav",
  "lastName": "Nalam"
}
```

Mapping:

```js
{
    mapping: {
        item: {
            first: "firstName",
            last: "lastName"
        }
    }
}
```

## Example 2 — remove by omission

Source:

```json
{
  "name": "Keshav",
  "city": "Yamuna Nagar",
  "internal": "do not expose"
}
```

Mapping:

```js
{
    mapping: {
        item: {
            name: "name",
            city: "city"
        }
    }
}
```

Only the described output keys are constructed.

## Example 3 — smaller output

A 10-field source can produce a 2-field output simply by describing two fields.

## Example 4 — larger shape

```js
customer: {
    item: {
        identity: {
            item: {
                name: "name"
            }
        },
        location: {
            item: {
                city: "city"
            }
        }
    }
}
```

## Example 5 — array

```js
items: [
    {
        list: "items",
        item: {
            name: "name"
        }
    }
]
```

## Example 6 — array inside array

```js
orders: [
    {
        list: "orders",
        item: {
            items: [
                {
                    list: "items",
                    item: {
                        name: "name"
                    }
                }
            ]
        }
    }
]
```

## Example 7 — array inside array inside array

```js
orders: [
    {
        list: "orders",
        item: {
            items: [
                {
                    list: "items",
                    item: {
                        batches: [
                            {
                                list: "batches",
                                item: {
                                    id: "id"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
]
```

## Example 8 — literal dotted source key

Source:

```json
{
  "ALLINVENTORYENTRIES.LIST": [
    { "STOCKITEMNAME": "ROPE" }
  ]
}
```

Mapping:

```js
items: [
    {
        list: "ALLINVENTORYENTRIES.LIST",
        item: {
            stockItem: "STOCKITEMNAME"
        }
    }
]
```

## Example 9 — dotted key plus nested dotted field

```js
batch: [
    {
        list: "BATCHALLOCATIONS.LIST",
        item: {
            id: "BATCHID.#text",
            rate: "BATCHRATE.#text"
        }
    }
]
```

The first dotted name can be a literal source key while `BATCHID.#text` can continue through a nested object.

## Example 10 — voucher composition

```text
voucher[]
  └── items[]
        ├── batch[]
        └── accounting[]
  ├── ledger[]
  └── allLedger[]
```

The complete version is documented in `docs/tally.md` and `test/v7/index.js`.
