import nodeJsonTransformer from "../../src/index.js";

const testData = {
    "ALLINVENTORYENTRIES.LIST": [
        {
            STOCKITEMNAME: "ROPE",
            AMOUNT: 260
        }
    ]
};

const testTransformation = {
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

const output = nodeJsonTransformer.transform(
    testData,
    testTransformation
);

console.log(JSON.stringify(output, null, 4));