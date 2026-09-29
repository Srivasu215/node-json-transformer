# Example 05 — Array to Array

## Source

```json
{
  "items": [
    { "name": "ROPE", "amount": 260 },
    { "name": "CABLE", "amount": 540 }
  ]
}
```

## Transformation

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

## Output

```json
{
  "products": [
    {
      "productName": "ROPE",
      "amount": 260
    },
    {
      "productName": "CABLE",
      "amount": 540
    }
  ]
}
```

## Story

`list` resolves the source collection. The nested `item` mapping is applied once for every element.
