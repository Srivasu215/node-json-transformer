# Example 09 — Tally Dotted Keys

This example explains the special path-resolution problem found in XML-derived Tally JSON.

## Source

```json
{
  "ALLINVENTORYENTRIES.LIST": [
    {
      "STOCKITEMNAME": "ROPE",
      "AMOUNT": 260
    }
  ]
}
```

The key is literally named `ALLINVENTORYENTRIES.LIST`. It is **not** an object named `ALLINVENTORYENTRIES` containing a property named `LIST`.

## Transformation

```js
const transformation = {
    mapping: {
        item: {
            items: [
                {
                    list: "ALLINVENTORYENTRIES.LIST",
                    item: {
                        stockItem: "STOCKITEMNAME",
                        amount: "AMOUNT"
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
      "stockItem": "ROPE",
      "amount": 260
    }
  ]
}
```

## Why the resolver matters

For a normal path:

```text
customer.address.city
```

navigation can be:

```text
customer → address → city
```

For the Tally key:

```text
ALLINVENTORYENTRIES.LIST
```

the resolver first checks whether the current object actually contains that complete key. This allows literal dotted keys while retaining ordinary dotted-path navigation.
