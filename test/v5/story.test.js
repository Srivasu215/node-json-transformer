import test from "node:test";
import assert from "node:assert/strict";
import { transform } from "../../src/v5/index.js";

test("V5 story: output mapping drives recursive traversal", () => {
    const source = {
        customer: {
            name: "Keshav",
            address: {
                city: "Yamuna Nagar"
            }
        }
    };

    const transformation = {
        mapping: {
            customer: {
                item: {
                    name: "customer.name",
                    city: "customer.address.city"
                }
            }
        }
    };

    assert.deepEqual(transform(source, transformation), {
        customer: {
            name: "Keshav",
            city: "Yamuna Nagar"
        }
    });
});

test("V5 story: array mapping selects source collection then reuses object traversal", () => {
    const source = {
        "ALLINVENTORYENTRIES.LIST": [
            { STOCKITEMNAME: "ROPE", AMOUNT: 260 },
            { STOCKITEMNAME: "CABLE", AMOUNT: 540 }
        ]
    };

    const transformation = {
        mapping: {
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
    };

    assert.deepEqual(transform(source, transformation), {
        items: [
            { stockItem: "ROPE", amount: 260 },
            { stockItem: "CABLE", amount: 540 }
        ]
    });
});

test("V5 story: dotted source keys and ordinary dotted paths use the same resolver", () => {
    const source = {
        customer: {
            address: {
                city: "Yamuna Nagar"
            }
        },
        "ALLINVENTORYENTRIES.LIST": [
            { STOCKITEMNAME: "ROPE" }
        ]
    };

    const transformation = {
        mapping: {
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
    };

    assert.deepEqual(transform(source, transformation), {
        city: "Yamuna Nagar",
        items: [
            { stockItem: "ROPE" }
        ]
    });
});
