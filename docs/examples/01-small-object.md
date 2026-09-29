# Example 01 — Small Object

The smallest useful story is: **source values are read and placed under output keys defined by the transformation**.

## Source

```json
{
  "name": "Keshav",
  "city": "Yamuna Nagar"
}
```

## Transformation

```js
const transformation = {
    mapping: {
        item: {
            customerName: "name",
            customerCity: "city"
        }
    }
};
```

## Output

```json
{
  "customerName": "Keshav",
  "customerCity": "Yamuna Nagar"
}
```

## Story

- `customerName` is an output key.
- `name` is the source path.
- `customerCity` maps to `city`.
- Source keys do not automatically become output keys.
