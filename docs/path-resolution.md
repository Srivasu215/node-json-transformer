# Path Resolution

Path resolution answers one question:

> Given this source node and this string path, where is the value?

It is implemented in `src/v5/resolve.js`.

## Ordinary dotted path

Source:

```json
{
  "customer": {
    "address": {
      "city": "Yamuna Nagar"
    }
  }
}
```

Path:

```text
customer.address.city
```

means:

```text
customer → address → city
```

## Literal dotted key

Source:

```json
{
  "ALLINVENTORYENTRIES.LIST": []
}
```

The string:

```text
ALLINVENTORYENTRIES.LIST
```

must resolve to the literal property name, not to nested properties.

## Longest existing key

The resolver splits the requested path into segments but, while traversing an object, checks the longest candidate key that actually exists on that object.

Conceptually:

```text
parts:
ALLINVENTORYENTRIES | LIST

candidate 1:
ALLINVENTORYENTRIES.LIST   ← exists

therefore use the complete key
```

For ordinary nested data:

```text
customer | address | city
```

no complete dotted key exists, so traversal continues one segment at a time.

## Arrays during resolution

When the resolver reaches an array while there is still path text remaining, it resolves the remaining path against every array element and returns the resulting array.

That is what allows paths to work naturally across repeated structures.

## Why this belongs in `resolve.js`

Traversal should not know how source property names are encoded. It asks the resolver for a value.

```text
traverse → resolvePath → source value
```

This keeps the dotted-key compatibility rule isolated and testable.
