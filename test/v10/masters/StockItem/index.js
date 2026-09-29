import fs from "fs";
import nodeJsonTransformer from "../../../../src/index.js";

import withBatchesJson from './withBatches.json' with {type: 'json'};

var transformation = {
    mapping: {
        item: {
            stockItems: [{
                "list": "STOCKITEM",
                "item": {
                    itemName: "@_NAME",
                    baseUnit: "BASEUNITS.#text",
                    batches: [{
                        "list": "BATCHALLOCATIONS.LIST",
                        "item": [{
                            godownName: "GODOWNNAME",
                            batchName: "BATCHNAME",
                            openingBalance: "OPENINGBALANCE",
                            openingValue: "OPENINGVALUE",
                            openingRate: "OPENINGRATE"
                        }]
                    }]
                }
            }]
        }
    }
};

const output = nodeJsonTransformer.transform(withBatchesJson, transformation);

console.log("result : ", JSON.stringify(output, null, 4));

// fs.writeFileSync("new.json", JSON.stringify(output));