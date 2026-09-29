# Example 02 — Large Source, Small Output

The source may contain much more data than the output needs.

## Source

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

## Transformation

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

## Output

```json
{
  "id": 1001,
  "name": "Keshav",
  "city": "Yamuna Nagar"
}
```

## Story

The transformation is an **output recipe**. Fields not described by the recipe are not copied into the result.
