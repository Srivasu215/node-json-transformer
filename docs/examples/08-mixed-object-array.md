# Example 08 — Mixed Object and Array

A real transformation normally mixes objects and arrays.

## Source

```json
{
  "invoice": 1001,
  "customer": {
    "name": "Alpha Global Industries"
  },
  "items": [
    {
      "name": "Industrial Cable",
      "batches": [
        { "id": "LOT-1", "quantity": 10 },
        { "id": "LOT-2", "quantity": 5 }
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
            invoiceNumber: "invoice",
            customer: {
                item: {
                    name: "customer.name"
                }
            },
            items: [
                {
                    list: "items",
                    item: {
                        product: "name",
                        batches: [
                            {
                                list: "batches",
                                item: {
                                    batchId: "id",
                                    quantity: "quantity"
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
  "invoiceNumber": 1001,
  "customer": {
    "name": "Alpha Global Industries"
  },
  "items": [
    {
      "product": "Industrial Cable",
      "batches": [
        { "batchId": "LOT-1", "quantity": 10 },
        { "batchId": "LOT-2", "quantity": 5 }
      ]
    }
  ]
}
```
