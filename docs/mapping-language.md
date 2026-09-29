# Mapping Language

V5 uses a small mapping vocabulary.

## `mapping`

The top-level transformation contains the mapping:

```js
{
    mapping: {
        item: {
            name: "NAME"
        }
    }
}
```

## `item`

`item` defines an object mapping.

```js
{
    item: {
        name: "NAME",
        city: "CITY"
    }
}
```

## String instruction

A string is interpreted as a source path or supported special instruction.

```js
name: "customer.name"
```

## Array instruction

An array containing a mapping object represents an output array:

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

## `list`

`list` identifies the source collection:

```js
{
    list: "ITEMS",
    item: {
        name: "NAME"
    }
}
```

## `objectify`

V5 can wrap a resolved source value as a one-item collection:

```js
{
    objectify: "customer",
    item: {
        name: "name"
    }
}
```

## `collect`

`collect` combines values produced by its item instructions into an array. It is an advanced mapping form and should be introduced only when a transformation actually needs collection composition.

## `flat`

`flat` works with the package's `#eq(index)` addressing form to select an array element and then apply an object mapping.

## Special value instructions

V5 also supports functionality implemented in `value.js` and `actions.js`, including:

- `$` hard-coded values;
- `^` parent/root lookup;
- `(TYPE)` type conversion;
- `{ACTION}` actions;
- supported actions such as `APPEND`, `DELETE`, `DELETE_IF_NOT_PRESENT`, `DEPENDS`, and `EVAL`.

These features are separate from the fundamental recursive object/array traversal story.
