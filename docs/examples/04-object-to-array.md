# Example 04 — Object to Array

A source object can be represented as a one-element output array using `list` with an indexed source path.

## Source

```json
{
  "id": 1001,
  "name": "ROPE",
  "amount": 260
}
```

## Transformation

```js
const transformation = {
    mapping: {
        item: {
            items: [
                {
                    list: "[]",
                    item: {
                        id: "id",
                        name: "name",
                        amount: "amount"
                    }
                }
            ]
        }
    }
};
```

## Output

```json
{
  "items": [
    {
      "id": 1001,
      "name": "ROPE",
      "amount": 260
    }
  ]
}
```

The engine's array forms are documented in [Arrays](../arrays.md). The important idea is that an array mapping controls the output collection and then applies its `item` mapping to each selected source item.
