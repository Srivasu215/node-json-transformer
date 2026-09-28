import test from "node:test";
import assert from "node:assert/strict";
import transformer, { transform } from "../../src/index.js";

test("object to object transformation", () => {
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

    const result = transform(data, transformation);
    assert.deepEqual(result, expected);

    // Also test default export .transform()
    const result2 = transformer.transform(data, transformation);
    assert.deepEqual(result2, expected);
});

test("array with dotted keys transformation", () => {
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

    const expected = {
        items: [
            {
                stockItem: "ROPE",
                amount: 260
            }
        ]
    };

    const result = transform(data, transformation);
    assert.deepEqual(result, expected);
});
