# Arrays

Arrays are where the recursive nature of the engine becomes easiest to see.

## Array → array

```js
items: [
    {
        list: "ITEMS",
        item: {
            name: "NAME"
        }
    }
]
```

The engine resolves `ITEMS`, confirms that it is a non-empty array, and applies the `item` mapping to each element.

## Array inside array

```js
orders: [
    {
        list: "ORDERS",
        item: {
            items: [
                {
                    list: "ITEMS",
                    item: {
                        name: "NAME"
                    }
                }
            ]
        }
    }
]
```

The outer array maps orders. For each order, the inner array maps its items.

## Three or more levels

The same form can be repeated:

```text
companies[]
  → departments[]
      → teams[]
          → members[]
```

The depth comes from nesting mappings, not from adding new traversal functions.

## Object that arrives where a collection is expected

Tally/XML-derived JSON can serialize a one-element collection as an object and multiple elements as an array. This repository's path resolution lets the mapping address the literal collection key; the transformation can then express the desired collection shape.

Example source:

```json
{
  "BATCHALLOCATIONS.LIST": {
    "BATCHNAME": "LOT-1"
  }
}
```

The mapping can still declare:

```js
batch: [
    {
        list: "BATCHALLOCATIONS.LIST",
        item: {
            name: "BATCHNAME"
        }
    }
]
```

This is one of the important practical reasons for the Tally-focused resolver work.
