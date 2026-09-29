# Maintenance

## Keep the stories versioned

This repository has multiple implementation versions because transformation behavior has been explored incrementally. Do not silently rewrite an old version when a new experiment changes its contract.

## One meaningful responsibility per file

The current V5 split is intentionally small:

```text
index.js    → public entry
traverse.js → mapping traversal
resolve.js  → source path resolution
value.js    → string instruction interpretation
actions.js  → type/action behavior
constants.js→ identifiers and default values
```

A file should represent a meaningful chapter of the engine, not merely one function.

## Regression-first changes

When fixing a transformation behavior:

1. reproduce it with a small source;
2. create or update a focused test;
3. identify the owning module;
4. make the smallest implementation change;
5. rerun the full suite;
6. add the example to documentation if the behavior is important.

## Tally resolver rule

Never simplify path resolution back to unconditional `split('.')`.

The engine must retain support for literal dotted keys such as:

```text
ALLINVENTORYENTRIES.LIST
BATCHALLOCATIONS.LIST
LEDGERENTRIES.LIST
```

while continuing to support ordinary paths such as:

```text
customer.address.city
```

## Array cardinality rule

When a source integration has inconsistent single-item versus multi-item serialization, normalize the consumer-facing shape through the transformation where appropriate instead of scattering cardinality checks throughout application code.

## Documentation rule

Every important behavior should have an example showing:

```text
SOURCE
TRANSFORMATION
OUTPUT
```

This is more useful than documenting function names alone.
