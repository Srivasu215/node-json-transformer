# Example 10 — Tally Voucher

This is the smaller version of the real Voucher transformation used during development.

## Source shape

The application can first extract the `VOUCHER` collection and pass it to the transformer in a small wrapper named `items`. This keeps the transformation focused on the records being transformed.

```json
{
  "items": [
    {
      "DATE.#text": 20260908,
      "VOUCHERNUMBER": 1949,
      "ALLINVENTORYENTRIES.LIST": [
        {
          "STOCKITEMNAME": "ROPE",
          "AMOUNT": 260,
          "BATCHALLOCATIONS.LIST": {
            "BATCHID.#text": 3543,
            "BATCHNAME": "Tuf-Rs.170",
            "AMOUNT": 260
          },
          "ACCOUNTINGALLOCATIONS.LIST": {
            "LEDGERNAME": "Sales",
            "AMOUNT": 260
          }
        }
      ],
      "LEDGERENTRIES.LIST": {
        "LEDGERNAME.#text": "K Eswara Rao",
        "AMOUNT.#text": -260
      }
    }
  ]
}
```

## Transformation

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
                                    amount: "AMOUNT",
                                    batch: [
                                        {
                                            list: "BATCHALLOCATIONS.LIST",
                                            item: {
                                                batchId: "BATCHID.#text",
                                                batchName: "BATCHNAME",
                                                amount: "AMOUNT"
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
                        ]
                    }
                }
            ]
        }
    }
};
```

## Important result

The source contains a single object for `BATCHALLOCATIONS.LIST`, but the transformation expresses `batch` as an array. The same pattern can be used for `ACCOUNTINGALLOCATIONS.LIST` and `LEDGERENTRIES.LIST`.

This gives consumers a consistent collection shape even when upstream XML serialization changes between one element and multiple elements.
