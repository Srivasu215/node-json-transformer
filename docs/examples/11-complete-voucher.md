# Example 11 — Complete Nested Voucher

This is the complete conceptual shape reached during the Voucher experiment.

```text
voucher[]
│
├── header fields
│
├── items[]
│   │
│   ├── stock item fields
│   │
│   ├── batch[]
│   │    └── batch fields
│   │
│   └── accounting[]
│        └── ledger + amount
│
├── ledger[]
│    └── voucher ledger fields
│
└── allLedger[]
     └── complete ledger-entry fields
```

A corresponding mapping follows the same recursive vocabulary at every level:

```js
const transformation = {
    mapping: {
        item: {
            vouchers: [
                {
                    list: "items",
                    item: {
                        date: "DATE.#text",
                        voucherNumber: "VOUCHERNUMBER",
                        items: [
                            {
                                list: "ALLINVENTORYENTRIES.LIST",
                                item: {
                                    stockItem: "STOCKITEMNAME",
                                    rate: "RATE",
                                    amount: "AMOUNT",
                                    batch: [
                                        {
                                            list: "BATCHALLOCATIONS.LIST",
                                            item: {
                                                batchId: "BATCHID.#text",
                                                batchName: "BATCHNAME",
                                                godown: "GODOWNNAME",
                                                amount: "AMOUNT",
                                                actualQty: "ACTUALQTY",
                                                billedQty: "BILLEDQTY",
                                                batchRate: "BATCHRATE.#text",
                                                manufacturingDate: "MFDON"
                                            }
                                        }
                                    ],
                                    accounting: [
                                        {
                                            list: "ACCOUNTINGALLOCATIONS.LIST",
                                            item: {
                                                ledger: "LEDGERNAME",
                                                amount: "AMOUNT"
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                        ledger: [
                            {
                                list: "LEDGERENTRIES.LIST",
                                item: {
                                    name: "LEDGERNAME.#text",
                                    amount: "AMOUNT.#text"
                                }
                            }
                        ],
                        allLedger: [
                            {
                                list: "ALLLEDGERENTRIES.LIST",
                                item: {
                                    name: "LEDGERNAME",
                                    amount: "AMOUNT"
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

The important architectural point is that `batch`, `accounting`, `ledger`, and `allLedger` are not four different traversal systems. They are four uses of the same recursive array mapping mechanism.
