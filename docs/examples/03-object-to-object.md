# Example 03 — Object to Object

An output object can have a different naming and nesting structure from the source.

## Source

```json
{
  "firstName": "Keshav",
  "city": "Yamuna Nagar",
  "age": 40
}
```

## Transformation

```js
const transformation = {
    mapping: {
        item: {
            person: {
                item: {
                    name: "firstName",
                    location: "city"
                }
            },
            age: "age"
        }
    }
};
```

## Output

```json
{
  "person": {
    "name": "Keshav",
    "location": "Yamuna Nagar"
  },
  "age": 40
}
```

## Story

The nested `item` mapping creates a nested output object. Traversal follows the transformation structure recursively.
