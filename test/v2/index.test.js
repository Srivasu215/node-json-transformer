import test from "node:test";
import assert from "node:assert/strict";
import transformer, { transform } from "../../src/v2/index.js";

test("V2: object to object", () => {
    const data = {
        x: "xx",
        y: {
            z: "zz"
        }
    };

    const transformation = {
        mapping: {
            item: {
                a: "x",
                b: "y.z"
            }
        }
    };

    const expected = {
        a: "xx",
        b: "zz"
    };

    assert.deepEqual(transform(data, transformation), expected);
    assert.deepEqual(transformer.transform(data, transformation), expected);
});

test("V2: array to array", () => {
    const data = {
        items: [
            { name: "one" },
            { name: "two" }
        ]
    };

    const transformation = {
        mapping: {
            item: {
                result: [
                    {
                        list: "items",
                        item: {
                            name: "name"
                        }
                    }
                ]
            }
        }
    };

    assert.deepEqual(transform(data, transformation), {
        result: [
            { name: "one" },
            { name: "two" }
        ]
    });
});

test("V2: array to object with flat index", () => {
    const data = {
        items: [
            { value: "first" },
            { value: "second" }
        ]
    };

    const transformation = {
        mapping: {
            item: {
                selected: {
                    flat: "items#eq(1)",
                    item: {
                        value: "value"
                    }
                }
            }
        }
    };

    assert.deepEqual(transform(data, transformation), {
        selected: {
            value: "second"
        }
    });
});

test("V2: object to array", () => {
    const data = {
        company: {
            name: "KeshavSoft"
        }
    };

    const transformation = {
        mapping: {
            item: {
                companies: {
                    objectify: "company",
                    item: {
                        name: "name"
                    }
                }
            }
        }
    };

    assert.deepEqual(transform(data, transformation), {
        companies: [
            { name: "KeshavSoft" }
        ]
    });
});

test("V2: constant value", () => {
    const data = {
        name: "Keshav"
    };

    const transformation = {
        mapping: {
            item: {
                name: "name",
                country: "$India"
            }
        }
    };

    assert.deepEqual(transform(data, transformation), {
        name: "Keshav",
        country: "India"
    });
});

test("V2: type conversion", () => {
    const data = {
        number: "123",
        text: 456,
        upper: "hello"
    };

    const transformation = {
        mapping: {
            item: {
                number: "number(NUMBER)",
                text: "text(STRING)",
                upper: "upper(UPPER)"
            }
        }
    };

    assert.deepEqual(transform(data, transformation), {
        number: 123,
        text: "456",
        upper: "HELLO"
    });
});

test("V2: depends operation", () => {
    const data = {
        status: "RED"
    };

    const transformation = {
        config: {
            dependentMap: {
                RED: "stop",
                GREEN: "go"
            }
        },
        mapping: {
            item: {
                result: "status{DEPENDS}"
            }
        }
    };

    assert.deepEqual(transform(data, transformation), {
        result: "stop"
    });
});

test("V2: literal dotted key", () => {
    const data = {
        "ALLINVENTORYENTRIES.LIST": [
            {
                STOCKITEMNAME: "ROPE",
                AMOUNT: 260
            }
        ]
    };

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

    assert.deepEqual(transform(data, transformation), {
        items: [
            {
                stockItem: "ROPE",
                amount: 260
            }
        ]
    });
});

test("V2: dotted Tally key with nested dotted child key", () => {
    const data = {
        "ALLINVENTORYENTRIES.LIST": [
            {
                STOCKITEMNAME: "ROPE",
                "BATCHALLOCATIONS.LIST": {
                    "BATCHID.#text": 3543,
                    BATCHNAME: "Tuf-Rs.170"
                }
            }
        ]
    };

    const transformation = {
        mapping: {
            item: {
                items: [
                    {
                        list: "ALLINVENTORYENTRIES.LIST",
                        item: {
                            stockItem: "STOCKITEMNAME",
                            batch: {
                                id: "BATCHALLOCATIONS.LIST.BATCHID.#text",
                                name: "BATCHALLOCATIONS.LIST.BATCHNAME"
                            }
                        }
                    }
                ]
            }
        }
    };

    assert.deepEqual(transform(data, transformation), {
        items: [
            {
                stockItem: "ROPE",
                batch: {
                    id: 3543,
                    name: "Tuf-Rs.170"
                }
            }
        ]
    });
});

test("V2: Tally dotted key can coexist with normal nested path", () => {
    const data = {
        customer: {
            address: {
                city: "Yamuna Nagar"
            }
        },
        "ALLINVENTORYENTRIES.LIST": [
            {
                STOCKITEMNAME: "ROPE"
            }
        ]
    };

    const transformation = {
        mapping: {
            item: {
                city: "customer.address.city",
                items: [
                    {
                        list: "ALLINVENTORYENTRIES.LIST",
                        item: {
                            stockItem: "STOCKITEMNAME"
                        }
                    }
                ]
            }
        }
    };

    assert.deepEqual(transform(data, transformation), {
        city: "Yamuna Nagar",
        items: [
            { stockItem: "ROPE" }
        ]
    });
});

test("V2: Tally voucher shape with inventory, batch and accounting allocations", () => {
    const data = {
        DATE: {
            "#text": 20260908
        },
        GUID: "voucher-guid",
        VOUCHERTYPENAME: "Sales/Cr Mani",
        PARTYLEDGERNAME: {
            "#text": "K Eswara Rao (MR Enterprises)"
        },
        VOUCHERNUMBER: 1949,
        "ALLINVENTORYENTRIES.LIST": [
            {
                STOCKITEMNAME: "9*12 200gsm",
                RATE: "540.00/Nos",
                AMOUNT: 540,
                ACTUALQTY: "1 Nos",
                BILLEDQTY: "1 Nos",
                "BATCHALLOCATIONS.LIST": {
                    MFDON: 20260720,
                    GODOWNNAME: "Main Location",
                    BATCHNAME: "BDC-Blu/Blu-Rs.385/-",
                    "BATCHID.#text": 8909,
                    AMOUNT: 540
                },
                "ACCOUNTINGALLOCATIONS.LIST": {
                    LEDGERNAME: "Sales",
                    AMOUNT: 540
                }
            },
            {
                STOCKITEMNAME: "ROPE",
                RATE: "260.00/kgs",
                AMOUNT: 260,
                ACTUALQTY: "1.000 kgs",
                BILLEDQTY: "1.000 kgs",
                "BATCHALLOCATIONS.LIST": {
                    GODOWNNAME: "Main Location",
                    BATCHNAME: "Tuf-Rs.170",
                    "BATCHID.#text": 3543,
                    AMOUNT: 260
                },
                "ACCOUNTINGALLOCATIONS.LIST": {
                    LEDGERNAME: "Sales",
                    AMOUNT: 260
                }
            }
        ],
        "LEDGERENTRIES.LIST": {
            "LEDGERNAME.#text": "K Eswara Rao (MR Enterprises)",
            "AMOUNT.#text": -800
        }
    };

    const transformation = {
        mapping: {
            item: {
                date: "DATE.#text",
                guid: "GUID",
                voucherType: "VOUCHERTYPENAME",
                party: "PARTYLEDGERNAME.#text",
                voucherNumber: "VOUCHERNUMBER",
                items: [
                    {
                        list: "ALLINVENTORYENTRIES.LIST",
                        item: {
                            stockItem: "STOCKITEMNAME",
                            rate: "RATE",
                            amount: "AMOUNT",
                            batch: {
                                batchId: "BATCHALLOCATIONS.LIST.BATCHID.#text",
                                batchName: "BATCHALLOCATIONS.LIST.BATCHNAME",
                                godown: "BATCHALLOCATIONS.LIST.GODOWNNAME",
                                amount: "BATCHALLOCATIONS.LIST.AMOUNT"
                            },
                            accounting: {
                                ledger: "ACCOUNTINGALLOCATIONS.LIST.LEDGERNAME",
                                amount: "ACCOUNTINGALLOCATIONS.LIST.AMOUNT"
                            }
                        }
                    }
                ],
                ledger: {
                    name: "LEDGERENTRIES.LIST.LEDGERNAME.#text",
                    amount: "LEDGERENTRIES.LIST.AMOUNT.#text"
                }
            }
        }
    };

    assert.deepEqual(transform(data, transformation), {
        date: 20260908,
        guid: "voucher-guid",
        voucherType: "Sales/Cr Mani",
        party: "K Eswara Rao (MR Enterprises)",
        voucherNumber: 1949,
        items: [
            {
                stockItem: "9*12 200gsm",
                rate: "540.00/Nos",
                amount: 540,
                batch: {
                    batchId: 8909,
                    batchName: "BDC-Blu/Blu-Rs.385/-",
                    godown: "Main Location",
                    amount: 540
                },
                accounting: {
                    ledger: "Sales",
                    amount: 540
                }
            },
            {
                stockItem: "ROPE",
                rate: "260.00/kgs",
                amount: 260,
                batch: {
                    batchId: 3543,
                    batchName: "Tuf-Rs.170",
                    godown: "Main Location",
                    amount: 260
                },
                accounting: {
                    ledger: "Sales",
                    amount: 260
                }
            }
        ],
        ledger: {
            name: "K Eswara Rao (MR Enterprises)",
            amount: -800
        }
    });
});
