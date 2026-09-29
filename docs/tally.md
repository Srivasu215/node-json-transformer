# Tally / XML-Derived JSON

The Tally use case exposed a practical JSON problem: XML collection names can survive serialization as literal property names containing dots.

Examples include:

```text
ALLINVENTORYENTRIES.LIST
BATCHALLOCATIONS.LIST
ACCOUNTINGALLOCATIONS.LIST
LEDGERENTRIES.LIST
ALLLEDGERENTRIES.LIST
```

These are keys, not necessarily nested paths.

## Mixed cardinality

The same conceptual XML collection may appear as one object when there is one member and as an array when there are multiple members.

For example:

```json
{
  "BATCHALLOCATIONS.LIST": {
    "BATCHID.#text": 3543
  }
}
```

and:

```json
{
  "BATCHALLOCATIONS.LIST": [
    { "BATCHID.#text": 3543 },
    { "BATCHID.#text": 4186 }
  ]
}
```

A transformation can describe the consumer-facing collection shape rather than forcing application code to branch on the upstream serialization.

## Voucher shape

The Voucher experiments produced a structure conceptually like:

```text
voucher[]
  ├── items[]
  │     ├── batch[]
  │     └── accounting[]
  ├── ledger[]
  └── allLedger[]
```

Each collection is described with the same array mapping mechanism.

## Dotted keys and dotted paths coexist

The resolver must support both:

```text
customer.address.city
```

and:

```text
ALLINVENTORYENTRIES.LIST
```

without changing the transformation language.

That is the central Tally-specific extension documented by this repository.
