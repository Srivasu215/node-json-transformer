# Example 06 — Array Inside Array

The same recursive rule continues when an array appears inside another array.

## Source

```json
{
  "orders": [
    {
      "number": 1001,
      "items": [
        { "name": "ROPE", "amount": 260 },
        { "name": "CABLE", "amount": 540 }
      ]
    },
    {
      "number": 1002,
      "items": [
        { "name": "MESH", "amount": 910 }
      ]
    }
  ]
}
```

## Transformation

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
                                    product: "name",
                                    amount: "amount"
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

## Output

```json
{
  "orders": [
    {
      "number": 1001,
      "items": [
        { "product": "ROPE", "amount": 260 },
        { "product": "CABLE", "amount": 540 }
      ]
    },
    {
      "number": 1002,
      "items": [
        { "product": "MESH", "amount": 910 }
      ]
    }
  ]
}
```

## Story

There is still only one traversal rule: an array mapping selects a collection and recursively transforms each item. The recursion is what makes nesting possible.
